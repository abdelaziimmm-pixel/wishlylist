// Wishlylist: receives a screenshot from the iPhone Shortcut ("Share → Wishlylist").
// Adds it straight away to the person's chosen list, marked "review", then fills in the details in the background.
// Vercel env vars: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (server-only, never in the site's code).
const { readItem, supaUrl, json } = require("./_lib");
let waitUntil = null;                         // keep working after replying (Vercel); otherwise finish first
try { waitUntil = require("@vercel/functions").waitUntil; } catch (e) {}

const admin = async (path, init = {}) => {
  const k = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const headers = { apikey: k, "Content-Type": "application/json", ...(init.headers || {}) };
  if (/^eyJ/.test(k)) headers.Authorization = "Bearer " + k;   // older JWT-style key; newer sb_secret_ keys use apikey only
  const r = await fetch(supaUrl() + path, { ...init, headers });
  const text = await r.text(); let body = null; try { body = JSON.parse(text); } catch (e) { body = text; }
  return { ok: r.ok, status: r.status, body };
};
const say = (res, code, text) => { res.statusCode = code; res.setHeader("Content-Type", "text/plain; charset=utf-8"); res.end(text); };

function readRaw(req) {
  return new Promise((resolve, reject) => { const chunks = []; req.on("data", c => chunks.push(c)); req.on("end", () => resolve(Buffer.concat(chunks))); req.on("error", reject); });
}
function parseMultipart(buf, type) {
  const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(type || ""); if (!m) return {};
  const boundary = Buffer.from("--" + (m[1] || m[2]).trim()), out = {};
  let pos = buf.indexOf(boundary);
  while (pos !== -1) {
    const start = pos + boundary.length;
    if (buf.slice(start, start + 2).toString() === "--") break;
    const next = buf.indexOf(boundary, start); if (next === -1) break;
    const part = buf.slice(start + 2, next - 2);                    // drop leading CRLF and trailing CRLF
    const sep = part.indexOf("\r\n\r\n");
    if (sep !== -1) {
      const head = part.slice(0, sep).toString(), body = part.slice(sep + 4);
      const name = (/name="([^"]*)"/i.exec(head) || [])[1];
      const ctype = (/content-type:\s*([^\r\n;]+)/i.exec(head) || [])[1];
      if (name) out[name] = /filename=/i.test(head) ? { data: body, type: (ctype || "image/jpeg").trim() } : body.toString("utf8");
    }
    pos = next;
  }
  return out;
}

module.exports = async (req, res) => {
  if (req.method === "GET") return say(res, 200, "Wishlylist share is ready. Use it from the iPhone Shortcut.");
  if (req.method !== "POST") return say(res, 405, "Method not allowed");
  if (!(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()) return say(res, 503, "Wishlylist: sharing from iPhone isn't switched on yet (SUPABASE_SERVICE_ROLE_KEY is missing in Vercel).");
  if (!(process.env.ANTHROPIC_API_KEY || "").trim()) return say(res, 503, "Wishlylist: screenshot reading isn't switched on yet (ANTHROPIC_API_KEY is missing in Vercel).");

  // 1. read what the Shortcut sent: key + image (form upload), or JSON { key, image: "data:image/…;base64,…", text }
  let key = "", img = null, text = "";
  const ctype = req.headers["content-type"] || "";
  try {
    if (/multipart\/form-data/i.test(ctype)) {
      const f = parseMultipart(await readRaw(req), ctype);
      key = String(f.key || "").trim(); text = String(f.text || "").trim();
      const file = Object.values(f).find(v => v && v.data && v.data.length);
      if (file) img = file;
    } else {
      const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      key = String(b.key || "").trim(); text = String(b.text || "").trim();
      const m = /^data:(image\/[a-z]+);base64,(.+)$/.exec(b.image || "");
      if (m) img = { data: Buffer.from(m[2], "base64"), type: m[1] };
    }
  } catch (e) { return say(res, 400, "Wishlylist: couldn't read what was shared. Try again."); }
  if (!/^[a-f0-9]{20,64}$/.test(key)) return say(res, 401, "Wishlylist: the share key in your Shortcut is missing or wrong. Copy it again from Wishlylist → ☰ → iPhone sharing.");
  if (!img && !text) return say(res, 400, "Wishlylist: nothing was shared. Share a screenshot.");
  if (img && img.data.length > 4 * 1024 * 1024) return say(res, 413, "Wishlylist: the screenshot is too large. Check the Resize step in the Shortcut.");

  // 2. whose key is it, and which list
  const k = await admin(`/rest/v1/share_keys?token=eq.${key}&select=user_id,list_id`);
  if (!k.ok) return say(res, 500, "Wishlylist: sharing isn't set up in the database yet. Run the latest SQL update in Supabase.");
  if (!Array.isArray(k.body) || !k.body.length) return say(res, 401, "Wishlylist: this share key isn't recognised. Copy it again from Wishlylist → ☰ → iPhone sharing.");
  const uid = k.body[0].user_id;
  let listId = k.body[0].list_id, listName = "";
  const mem = await admin(`/rest/v1/list_members?user_id=eq.${uid}&select=list_id,lists(id,name,kind,created_at,owner_id)`);
  const lists = (Array.isArray(mem.body) ? mem.body : []).map(r => r.lists).filter(Boolean);
  let list = lists.find(l => l.id === listId) || lists.filter(l => l.kind === "private" && l.owner_id === uid).sort((a, b) => a.created_at.localeCompare(b.created_at))[0] || lists[0];
  if (!list) return say(res, 404, "Wishlylist: you don't have a list to add to.");
  listId = list.id; listName = list.name;

  // 3. daily limit
  const limit = parseInt(process.env.LOOKUP_DAILY_LIMIT || "20", 10) || 20;
  const used = await admin("/rest/v1/rpc/use_lookup_for", { method: "POST", body: JSON.stringify({ u: uid, max_per_day: limit }) });
  if (!used.ok) return say(res, /daily limit/i.test(JSON.stringify(used.body)) ? 429 : 500,
    /daily limit/i.test(JSON.stringify(used.body)) ? `Wishlylist: you've reached today's limit of ${limit} screenshots.` : "Wishlylist: usage counter isn't set up. Run the latest SQL update in Supabase.");

  // 4. save the screenshot and add a placeholder item right away
  let imagePath = null;
  if (img) {
    const ext = /png/.test(img.type) ? "png" : "jpg";
    const path = `${uid}/${require("crypto").randomUUID()}.${ext}`;
    const up = await admin(`/storage/v1/object/item-images/${path}`, { method: "POST", headers: { "Content-Type": img.type || "image/jpeg" }, body: img.data });
    if (up.ok) imagePath = path;
  }
  const ins = await admin("/rest/v1/items", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({
    list_id: listId, kind: "place", type: "other", status: "want", name: "Reading screenshot…",
    details: { review: true, processing: true, ...(text ? { notes: text } : {}) }, image_path: imagePath, added_by: uid }) });
  if (!ins.ok || !Array.isArray(ins.body)) return say(res, 500, "Wishlylist: couldn't add it to your list. Try again.");
  const itemId = ins.body[0].id;

  // 5. reply now, then read + check the details in the background
  const work = (async () => {
    let patch;
    try {
      const image = img ? `data:${img.type};base64,${img.data.toString("base64")}` : "";
      const it = await readItem({ image, note: text });
      const { kind, type, status, ...details } = it;
      patch = { kind, type, name: it.name_en || it.name_ar || "Untitled", details: { ...details, review: true, ...(text && !details.notes ? { notes: text } : {}) } };
    } catch (e) {
      patch = { name: "Screenshot — add the details", details: { review: true, notes: [text, e.message].filter(Boolean).join("\n") } };
    }
    await admin(`/rest/v1/items?id=eq.${itemId}`, { method: "PATCH", body: JSON.stringify(patch) });
  })();
  if (waitUntil) waitUntil(work); else await work;
  return say(res, 200, `✓ Added to “${listName}”. Details will appear in about a minute — open Wishlylist to review.`);
};
