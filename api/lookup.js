// Wishlylist: called from the site's "Fill in from a screenshot" button. Returns details for the user to review.
// Vercel env vars: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY.
// Optional: CLAUDE_MODEL (default claude-sonnet-5-5), LOOKUP_DAILY_LIMIT (default 20 per person per day),
//           LOOKUP_ALLOWED_EMAILS (comma-separated; if set, only these people can use it).
const { readItem, supaUrl, json } = require("./_lib");

async function supa(path, token, init = {}) {
  const r = await fetch(supaUrl() + path, { ...init, headers: { apikey: (process.env.SUPABASE_ANON_KEY || "").trim(), Authorization: "Bearer " + token, "Content-Type": "application/json", ...(init.headers || {}) } });
  const text = await r.text(); let body = null; try { body = JSON.parse(text); } catch (e) { body = text; }
  return { ok: r.ok, status: r.status, body };
}

module.exports = async (req, res) => {
  const enabled = !!(process.env.ANTHROPIC_API_KEY || "").trim();
  if (req.method === "GET") return json(res, 200, { enabled, shortcut: enabled && !!(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim() });
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  if (!enabled) return json(res, 503, { error: "Screenshot reading isn't switched on yet (ANTHROPIC_API_KEY is missing in Vercel)." });

  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return json(res, 401, { error: "Please sign in." });
  const me = await supa("/auth/v1/user", token);
  if (!me.ok || !me.body || !me.body.id) return json(res, 401, { error: "Please sign in again." });
  const allow = (process.env.LOOKUP_ALLOWED_EMAILS || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  if (allow.length && !allow.includes(String(me.body.email || "").toLowerCase())) return json(res, 403, { error: "Screenshot reading isn't available for this account." });

  const limit = parseInt(process.env.LOOKUP_DAILY_LIMIT || "20", 10) || 20;
  const used = await supa("/rest/v1/rpc/use_lookup", token, { method: "POST", body: JSON.stringify({ max_per_day: limit }) });
  if (!used.ok) {
    if (/daily limit/i.test(JSON.stringify(used.body || ""))) return json(res, 429, { error: `You've reached today's limit of ${limit} screenshots. Try again tomorrow.` });
    return json(res, 500, { error: "Usage counter isn't set up. Run the latest SQL update in Supabase." });
  }
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  try { return json(res, 200, { item: await readItem(body) }); }
  catch (e) { return json(res, 502, { error: e.message }); }
};
