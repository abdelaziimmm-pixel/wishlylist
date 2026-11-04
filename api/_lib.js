// Shared by api/lookup.js (from the site) and api/share.js (from the iPhone Shortcut).
const TYPES = {
  place: "restaurant, cafe, entertainment, adventure, cinema, attraction, beach, hotel, shopping, other",
  buy: "electronics, home, fashion, beauty, kids, sports, books, car, other",
  service: "maintenance, cleaning, car, beauty, health, education, travel, events, other",
  movie: "movie, series, documentary, animation, other",
  book: "novel, selfhelp, business, history, religion, science, kids, other"
};

const SYSTEM = `You help fill in a personal wishlist app from a screenshot (or a name/link) the user shares.
The user lives in the Eastern Province of Saudi Arabia, speaks Arabic (Egyptian dialect) and English, and often saves places in Saudi Arabia and Egypt.

1. Work out what the screenshot shows and which kind it is:
   place (restaurant, café, attraction, hotel, beach, activity…), buy (a product), service (a provider or company), movie (film or series), book.
2. Use web search (a few searches at most) to confirm it and fill in current, real details: official name, city, prices, opening hours, phone, links.
   Never invent facts. Leave a field out if you can't confirm it. Prefer official sites, Google Maps listings and reputable sources.
3. Reply with ONLY one JSON object, no other text. Fields (omit any you don't have):
{
 "kind": "place|buy|service|movie|book",
 "type": one key from the list for that kind,
 "name_en": "", "name_ar": "",
 "summary_en": "1–3 sentences", "summary_ar": "same in Egyptian Arabic",
 "country": "2-letter code (places/services)", "city_en": "", "city_ar": "", "address_en": "", "address_ar": "",
 "price_from": "e.g. SAR 89 / person", "prices": [{"en": "", "ar": "", "value": ""}],
 "features_en": ["short tags"], "features_ar": ["same in Arabic"],
 "hours_en": "", "hours_ar": "", "ages_en": "", "ages_ar": "", "phone": "",
 "maps": "https://www.google.com/maps/search/?api=1&query=<name+city url-encoded>", "instagram": "", "website": "",
 "store": "", "price": "", "product_url": "",
 "provider": "",
 "year": "", "genre_en": "", "genre_ar": "", "cast": [""], "director": "", "runtime_en": "", "runtime_ar": "", "watch_en": "", "watch_ar": "", "rating": "",
 "author": "", "pages": "", "language_en": "", "language_ar": "", "goodreads": "",
 "notes": "anything the user should double-check, in English",
 "checked": "Mon YYYY · main sources"
}
Type keys — place: ${TYPES.place}. buy: ${TYPES.buy}. service: ${TYPES.service}. movie: ${TYPES.movie}. book: ${TYPES.book}.
All links must be full https URLs. Arabic text should read naturally in Egyptian Arabic.`;

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return JSON.parse(raw);
}

function clean(o) {
  const KINDS = ["place", "buy", "service", "movie", "book"];
  const out = {};
  const str = v => typeof v === "string" ? v.trim().slice(0, 2000) : typeof v === "number" ? String(v) : "";
  const url = v => /^https?:\/\//i.test(str(v)) ? str(v) : "";
  for (const [k, v] of Object.entries(o || {})) {
    if (["maps", "instagram", "website", "product_url", "goodreads", "trailer"].includes(k)) { if (url(v)) out[k] = url(v); }
    else if (["features_en", "features_ar", "cast"].includes(k)) { if (Array.isArray(v)) { const a = v.map(str).filter(Boolean).slice(0, 12); if (a.length) out[k] = a; } }
    else if (k === "prices") { if (Array.isArray(v)) { const a = v.filter(x => x && typeof x === "object").map(x => ({ en: str(x.en), ar: str(x.ar), value: str(x.value) })).filter(x => x.value).slice(0, 10); if (a.length) out.prices = a; } }
    else if (str(v)) out[k] = str(v);
  }
  out.kind = KINDS.includes(out.kind) ? out.kind : "place";
  const allowed = TYPES[out.kind].split(", ");
  out.type = allowed.includes(out.type) ? out.type : "other";
  if (out.country) out.country = out.country.toUpperCase().slice(0, 2);
  return out;
}


// Ask Claude to read the screenshot / text and check it on the web. Returns a cleaned item, or throws Error(message).
async function readItem({ image, note, url, kind }) {
  const key = (process.env.ANTHROPIC_API_KEY || "").trim();
  if (!key) throw new Error("Screenshot reading isn't switched on yet (ANTHROPIC_API_KEY is missing in Vercel).");
  const content = [];
  const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/.exec(image || "");
  if (m) content.push({ type: "image", source: { type: "base64", media_type: m[1], data: m[2] } });
  if (!m && !note && !url) throw new Error("Add a screenshot, a name or a link.");
  const hints = [
    note ? `User's note / shared text: ${String(note).slice(0, 1500)}` : "",
    url ? `Shared link: ${String(url).slice(0, 500)}` : "",
    kind ? `The user had the "${kind}" tab open (a hint, not a rule).` : "",
    `Today is ${new Date().toISOString().slice(0, 10)}.`
  ].filter(Boolean).join("\n");
  content.push({ type: "text", text: (m ? "Here is the screenshot.\n" : "") + hints + "\nReturn the JSON object only." });
  const messages = [{ role: "user", content }];
  const request = {
    model: (process.env.CLAUDE_MODEL || "claude-sonnet-5-5").trim(),
    max_tokens: 3000,
    system: SYSTEM,
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 4,
      user_location: { type: "approximate", country: "SA", city: "Al Khobar", timezone: "Asia/Riyadh" } }],
    messages
  };
  let data;
  for (let i = 0; i < 4; i++) {            // web search can pause a long turn; continue it
    let r;
    try {
      r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" }, body: JSON.stringify(request) });
    } catch (e) { throw new Error("Couldn't reach the AI service. Try again."); }
    data = await r.json();
    if (!r.ok) throw new Error("The AI service returned an error: " + ((data.error && data.error.message) || r.status));
    if (data.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: data.content });
  }
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
  try { return clean(extractJson(text)); } catch (e) { throw new Error("Couldn't read the details. Try again or add them yourself."); }
}

const supaUrl = () => { const u = (process.env.SUPABASE_URL || "").trim(); try { return new URL(u).origin; } catch (e) { return u; } };
const json = (res, code, body) => { res.statusCode = code; res.setHeader("Content-Type", "application/json"); res.setHeader("Cache-Control", "no-store"); res.end(JSON.stringify(body)); };

module.exports = { readItem, supaUrl, json, TYPES };
