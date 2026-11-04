// Copies the site into public/ and writes config.js from Vercel environment variables.
const fs = require("fs"), path = require("path");
const out = path.join(__dirname, "public");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
for (const f of fs.readdirSync(path.join(__dirname, "src"))) fs.copyFileSync(path.join(__dirname, "src", f), path.join(out, f));
const cfg = {
  appName: process.env.APP_NAME || "To Go List",
  supabaseUrl: (process.env.SUPABASE_URL || "").trim(),
  supabaseAnonKey: (process.env.SUPABASE_ANON_KEY || "").trim()
};
fs.writeFileSync(path.join(out, "config.js"), "window.TGL_CONFIG = " + JSON.stringify(cfg) + ";\n");
const html = path.join(out, "index.html");
fs.writeFileSync(html, fs.readFileSync(html, "utf8").replace("<title>To Go List</title>", `<title>${cfg.appName.replace(/[<&]/g, "")}</title>`));
console.log(`Built "${cfg.appName}" →`, out, cfg.supabaseUrl ? "(Supabase configured)" : "(WARNING: SUPABASE_URL missing)");
