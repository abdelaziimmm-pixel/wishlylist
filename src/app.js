/* Wishlylist — standalone app (Supabase for login + data, static hosting on Vercel) */
const CFG = window.TGL_CONFIG || {};
const APP_NAME = CFG.appName || "Wishlylist";
const BUCKET = "item-images";

/* ───────────── Text ───────────── */
const T = {
  en: {
    search:"Search",all:"All",anyStatus:"Any status",countries:n=>`${n} countr${n==1?"y":"ies"}`,
    from:"From",prices:"Prices",price:"Price",features:"Features",hours:"Opening hours",ages:"Ages",address:"Location",
    links:"Links",notes:"Notes",save:"Save",saved:"Saved",markW:"Move back to list",
    del:"Delete",delSure:"Tap again to delete",close:"Close",cancel:"Cancel",map:"Google Maps",insta:"Instagram",web:"Website",
    verified:"Info checked",noprice:"Price not published",phone:"Phone",about:"About",story:"Story",
    viewProduct:"View product",store:"Store",provider:"Provider",cast:"Cast",director:"Director",rating:"Rating",runtime:"Length",watch:"Where to watch",
    gSummary:"Summary on Google",gCast:"Cast on Google",trailer:"Trailer",author:"Author",pages:"Pages",language:"Language",gReviews:"Reviews on Goodreads",buyBook:"Find to buy",
    nomatch:"Nothing matches these filters.",add:"＋ Add",err:"Something went wrong. Try again.",
    emptyB:n=>`Tap “＋ Add” to add your first ${n}.`,emptyRO:"Nothing here yet.",
    addedBy:"Added by",someone:"Someone",edit:"Edit",copyTo:"Copy to another list",copied:"Copied",
    cover:"Change photo",coverOk:"Photo updated",loading:"Loading…",
    // auth
    tagline:"Places to go, things to buy, movies to watch — for you, your family and friends.",
    signIn:"Sign in",signUp:"Create account",name:"Your name",email:"Email",password:"Password",
    pwHint:"At least 6 characters",forgot:"Forgot password?",resetSent:"Check your email for a link to reset your password.",
    confirmSent:"Account created. Check your email and tap the confirmation link, then sign in.",
    newPw:"Set a new password",pwSaved:"Password updated.",signOut:"Sign out",
    inviteTo:(l,o)=>`<b>${o||"Someone"}</b> invited you to the list <b>${l}</b>. Sign in or create an account to join.`,
    badInvite:"This invite link is invalid or has expired. Ask for a new one.",joined:l=>`You joined “${l}”`,
    // lists
    myLists:"My lists",newList:"New list",listName:"List name",listType:"Type",create:"Create",
    kindName:{private:"Private",family:"Family",friends:"Friends",public:"Public"},
    kindDesc:{private:"Only you",family:"You and family you invite",friends:"You and friends you invite",public:"Anyone with the link can view"},
    kindIcon:{private:"🔒",family:"🏠",friends:"👥",public:"🌍"},
    settings:"List settings",rename:"Rename",members:"Members",owner:"Owner",remove:"Remove",
    invite:"Invite people",inviteHelp:"Anyone with this link can join this list for 14 days.",makeLink:"Create invite link",
    copy:"Copy",share:"Share",whatsapp:"WhatsApp",linkCopied:"Link copied",
    publicLink:"Public link",publicHelp:"Anyone with this link can view this list without an account.",
    leave:"Leave this list",leaveSure:"Tap again to leave",deleteList:"Delete this list",deleteSure:"Tap again — this deletes all its items",
    viewing:"You're viewing a public list.",saveToMine:"Sign in to save items to your own lists",
    notFound:"This list doesn't exist, or you don't have access to it.",
    inviteMsg:(l,u)=>`Join my list “${l}” on ${APP_NAME}: ${u}`,
    // form
    addT:n=>`Add ${n.toLowerCase()}`,editT:"Edit",kindL:"What is it?",typeL:"Category",
    nameL:"Name",summaryL:"About",countryL:"Country",cityL:"City / area",priceFromL:"Price from",priceL:"Price",
    storeL:"Store",linkL:"Product link",mapsL:"Google Maps link",webL:"Website",instaL:"Instagram link",phoneL:"Phone",
    providerL:"Provider",yearL:"Year",genreL:"Genre",directorL:"Director",watchL:"Where to watch",authorL:"Author",pagesL:"Pages",
    photoL:"Photo",pickPhoto:"Tap to choose a photo",statusL:"Status",none:"—",needName:"Please enter a name.",
    importT:"Import your old list",importB:"Copies the items from your previous Claude version into a list you choose. Photos aren't included; add them with “Change photo”.",
    aiPick:"Fill in from a screenshot",aiHelp:"Choose a screenshot; the details are found and checked online for you to review.",
    aiFromLink:"Look up the shared link",aiBusy:"Reading and checking online… this takes 20–60 seconds.",aiDone:"Details filled in. Check them, then tap Save.",aiAlso:"Also saved",
    review:"REVIEW",reading:"READING…",reviewT:"Added from a screenshot. Check the details, then confirm.",readingT:"Still reading the screenshot… details appear here in about a minute.",looksGood:"Looks good ✓",
    iphone:"iPhone sharing",iphoneT:"Share screenshots from iPhone",iphoneB:"Set this up once. Then take a screenshot, tap Share → Wishlylist, and it's added to your list with the details filled in, marked REVIEW.",
    shareTo:"Shared screenshots go to",yourKey:"Your private share key",keyNote:"Treat it like a password: anyone with this key can add items to your lists.",newKey:"Make a new key",
    off:"iPhone sharing isn't switched on yet. It needs the SUPABASE_SERVICE_ROLE_KEY and ANTHROPIC_API_KEY settings in Vercel.",
    steps:["Open the Shortcuts app → tap ＋ → name it <b>Wishlylist</b>.","Tap ⓘ at the bottom → turn on <b>Show in Share Sheet</b>. At the top, set it to receive <b>Images</b> only.","Add action <b>Resize Image</b> → Width <b>1200</b>.","Add action <b>Convert Image</b> → <b>JPEG</b>.","Add action <b>Get Contents of URL</b> → paste the address below. Tap ▸ Show More: Method <b>POST</b>, Request Body <b>Form</b>. Add a <b>Text</b> field named <b>key</b> with your key, and a <b>File</b> field named <b>image</b> set to <b>Converted Image</b>.","Add action <b>Show Notification</b> → <b>Contents of URL</b>. Tap Done."],
    address:"Address",
    importGo:"Import",importDone:n=>`Imported ${n} items`,importNone:"Everything is already imported."
  },
  ar: {
    search:"ابحث",all:"الكل",anyStatus:"كل الحالات",countries:n=>`${n} دولة`,
    from:"يبدأ من",prices:"الأسعار",price:"السعر",features:"المميزات",hours:"مواعيد العمل",ages:"الأعمار",address:"الموقع",
    links:"روابط",notes:"ملاحظات",save:"حفظ",saved:"تم الحفظ",markW:"رجّعه للقائمة",
    del:"حذف",delSure:"اضغط تاني للتأكيد",close:"إغلاق",cancel:"إلغاء",map:"خرائط جوجل",insta:"إنستجرام",web:"الموقع الإلكتروني",
    verified:"تم التحقق من المعلومات",noprice:"السعر غير معلن",phone:"الهاتف",about:"نبذة",story:"القصة",
    viewProduct:"عرض المنتج",store:"المتجر",provider:"مقدم الخدمة",cast:"الممثلين",director:"المخرج",rating:"التقييم",runtime:"المدة",watch:"تتفرج عليه فين",
    gSummary:"الملخص على جوجل",gCast:"الممثلين على جوجل",trailer:"الإعلان",author:"المؤلف",pages:"عدد الصفحات",language:"اللغة",gReviews:"المراجعات على Goodreads",buyBook:"دوّر عليه للشراء",
    nomatch:"مفيش نتائج مطابقة للفلاتر.",add:"＋ إضافة",err:"حصلت مشكلة، حاول تاني.",
    emptyB:n=>`اضغط «＋ إضافة» علشان تضيف أول ${n}.`,emptyRO:"مفيش حاجة هنا لسه.",
    addedBy:"أضافه",someone:"حد",edit:"تعديل",copyTo:"انسخه لقائمة تانية",copied:"تم النسخ",
    cover:"تغيير الصورة",coverOk:"تم تحديث الصورة",loading:"جاري التحميل…",
    tagline:"أماكن تروحها، حاجات تشتريها، أفلام تتفرج عليها — ليك ولعيلتك وصحابك.",
    signIn:"تسجيل الدخول",signUp:"حساب جديد",name:"اسمك",email:"الإيميل",password:"كلمة السر",
    pwHint:"6 حروف على الأقل",forgot:"نسيت كلمة السر؟",resetSent:"بعتنالك إيميل فيه لينك لتغيير كلمة السر.",
    confirmSent:"تم إنشاء الحساب. افتح إيميلك واضغط لينك التأكيد، وبعدين سجّل دخول.",
    newPw:"اختار كلمة سر جديدة",pwSaved:"تم تغيير كلمة السر.",signOut:"تسجيل الخروج",
    inviteTo:(l,o)=>`<b>${o||"حد"}</b> عزمك على قائمة <b>${l}</b>. سجّل دخول أو اعمل حساب علشان تنضم.`,
    badInvite:"لينك الدعوة غير صالح أو انتهى. اطلب لينك جديد.",joined:l=>`انضميت لـ «${l}»`,
    myLists:"قوائمي",newList:"قائمة جديدة",listName:"اسم القائمة",listType:"النوع",create:"إنشاء",
    kindName:{private:"خاصة",family:"العيلة",friends:"الصحاب",public:"عامة"},
    kindDesc:{private:"ليك انت بس",family:"انت والعيلة اللي تعزمهم",friends:"انت والصحاب اللي تعزمهم",public:"أي حد معاه اللينك يقدر يشوفها"},
    kindIcon:{private:"🔒",family:"🏠",friends:"👥",public:"🌍"},
    settings:"إعدادات القائمة",rename:"تغيير الاسم",members:"الأعضاء",owner:"المالك",remove:"إزالة",
    invite:"اعزم ناس",inviteHelp:"أي حد معاه اللينك ده يقدر ينضم للقائمة لمدة 14 يوم.",makeLink:"اعمل لينك دعوة",
    copy:"نسخ",share:"مشاركة",whatsapp:"واتساب",linkCopied:"تم نسخ اللينك",
    publicLink:"اللينك العام",publicHelp:"أي حد معاه اللينك ده يقدر يشوف القائمة من غير حساب.",
    leave:"اخرج من القائمة",leaveSure:"اضغط تاني للخروج",deleteList:"احذف القائمة",deleteSure:"اضغط تاني — هيتمسح كل اللي فيها",
    viewing:"انت بتتفرج على قائمة عامة.",saveToMine:"سجّل دخول علشان تحفظ حاجات في قوائمك",
    notFound:"القائمة دي مش موجودة أو مش متاحة ليك.",
    inviteMsg:(l,u)=>`انضم لقائمتي «${l}» على ${APP_NAME}: ${u}`,
    addT:n=>`إضافة ${n}`,editT:"تعديل",kindL:"إيه نوعه؟",typeL:"التصنيف",
    nameL:"الاسم",summaryL:"نبذة",countryL:"الدولة",cityL:"المدينة / المنطقة",priceFromL:"السعر يبدأ من",priceL:"السعر",
    storeL:"المتجر",linkL:"لينك المنتج",mapsL:"لينك خرائط جوجل",webL:"الموقع",instaL:"لينك إنستجرام",phoneL:"الهاتف",
    providerL:"مقدم الخدمة",yearL:"السنة",genreL:"النوع",directorL:"المخرج",watchL:"تتفرج عليه فين",authorL:"المؤلف",pagesL:"عدد الصفحات",
    photoL:"الصورة",pickPhoto:"اضغط لاختيار صورة",statusL:"الحالة",none:"—",needName:"اكتب الاسم.",
    importT:"استورد قائمتك القديمة",importB:"بينسخ الحاجات من نسخة Claude القديمة لقائمة تختارها. الصور مش بتتنقل؛ ضيفها من «تغيير الصورة».",
    aiPick:"املأ البيانات من سكرين شوت",aiHelp:"اختار سكرين شوت، وهيتم البحث عن التفاصيل والتأكد منها أونلاين علشان تراجعها.",
    aiFromLink:"دوّر على اللينك اللي اتبعت",aiBusy:"جاري القراءة والتأكد أونلاين… بياخد من 20 لـ 60 ثانية.",aiDone:"التفاصيل اتملت. راجعها واضغط حفظ.",aiAlso:"هيتحفظ كمان",
    review:"راجعه",reading:"جاري القراءة…",reviewT:"اتضاف من سكرين شوت. راجع التفاصيل وبعدين أكّد.",readingT:"لسه بنقرا السكرين شوت… التفاصيل هتظهر هنا خلال دقيقة تقريبًا.",looksGood:"تمام ✓",
    iphone:"المشاركة من الآيفون",iphoneT:"شارك سكرين شوت من الآيفون",iphoneB:"اعمل الخطوات دي مرة واحدة. بعدها خد سكرين شوت، اضغط مشاركة ← Wishlylist، وهيتضاف لقائمتك بالتفاصيل ومتعلّم «راجعه».",
    shareTo:"السكرين شوت هيروح لـ",yourKey:"مفتاح المشاركة الخاص بيك",keyNote:"خليه زي الباسورد: أي حد معاه المفتاح ده يقدر يضيف حاجات لقوايمك.",newKey:"اعمل مفتاح جديد",
    off:"المشاركة من الآيفون لسه مش متفعلة. محتاجة إعدادات SUPABASE_SERVICE_ROLE_KEY و ANTHROPIC_API_KEY في Vercel.",
    steps:["افتح تطبيق Shortcuts ← اضغط ＋ ← سمّيه <b>Wishlylist</b>.","اضغط ⓘ تحت ← فعّل <b>Show in Share Sheet</b>. فوق، خليه يستقبل <b>Images</b> بس.","ضيف أكشن <b>Resize Image</b> ← Width <b>1200</b>.","ضيف أكشن <b>Convert Image</b> ← <b>JPEG</b>.","ضيف أكشن <b>Get Contents of URL</b> ← الصق العنوان اللي تحت. اضغط ▸ Show More: Method <b>POST</b>، Request Body <b>Form</b>. ضيف حقل <b>Text</b> اسمه <b>key</b> فيه المفتاح، وحقل <b>File</b> اسمه <b>image</b> قيمته <b>Converted Image</b>.","ضيف أكشن <b>Show Notification</b> ← <b>Contents of URL</b>. اضغط Done."],
    address:"العنوان",
    importGo:"استيراد",importDone:n=>`تم استيراد ${n} عنصر`,importNone:"كل حاجة متستوردة بالفعل."
  }
};

/* ───────────── State ───────────── */
let lang = "en", kind = "place", typeF = "all", statusF = "any", query = "", collapsed = new Set(), openId = null;
let sb = null, session = null, me = null;
let myLists = [];            // [{...list, role}]
let cur = null;              // current list
let items = [], members = [], names = {}, canEdit = false, isOwner = false;
let channel = null, recovering = false, aiEnabled = false, shortcutEnabled = false;
try { lang = localStorage.getItem("tgl-lang") || (navigator.language || "").startsWith("ar") && "ar" || "en"; } catch (e) {}

/* ───────────── Helpers ───────────── */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const L = (o, k) => lang === "ar" ? (o[k+"_ar"] || o[k] || o[k+"_en"]) : (o[k+"_en"] || o[k] || o[k+"_ar"]);
const flag = cc => cc && cc.length === 2 ? String.fromCodePoint(...[...cc.toUpperCase()].map(c => 127397 + c.charCodeAt(0))) : "🌍";
const cName = cc => { try { return new Intl.DisplayNames([lang], {type:"region"}).of(cc); } catch (e) { return cc; } };
const tx = k => T[lang][k];
const kindOf = p => KINDS[p.kind] ? p.kind : "place";
const typeOf = p => { const ts = KINDS[kindOf(p)].types; return ts[p.type] || ts.other; };
const count = (k, n) => `${n} ${n == 1 ? KINDS[k].one[lang] : KINDS[k].many[lang]}`;
const gsearch = q => "https://www.google.com/search?q=" + encodeURIComponent(q);
const ofKind = k => items.filter(p => kindOf(p) === k);
const who = id => names[id] || tx("someone");
const safeUrl = u => /^https?:\/\//i.test(u || "") ? u : "";
const photoUrl = path => path ? sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl : "";
const coverOf = p => photoUrl(p.image_path) || safeUrl(p.image_url);
const origin = () => location.origin + location.pathname.replace(/index\.html$/, "");
/* "Wishlylist" → Wishly + accented "list"; multi-word names accent the last word */
function brandHtml() {
  const n = APP_NAME, w = n.split(" ");
  if (w.length > 1) return `${esc(w.slice(0, -1).join(" "))} <span>${esc(w[w.length - 1])}</span>`;
  const m = n.match(/^(.+?)(list)$/i);
  return m ? `${esc(m[1])}<span>${esc(m[2])}</span>` : esc(n);
}
const listUrl = id => `${origin()}#/l/${id}`;

function toast(m) { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(() => t.hidden = true, 2600); }
function closeSheet() { openId = null; $("#sheetHost").innerHTML = ""; }
function sheet(html, label) {
  $("#sheetHost").innerHTML = `<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(label || "")}"><div class="grab"></div>${html}</div></div>`;
  $("#scrim").onclick = e => { if (e.target.id === "scrim") closeSheet(); };
  const c = $("#cls"); if (c) c.onclick = closeSheet;
}
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
async function copyText(s) { try { await navigator.clipboard.writeText(s); toast(tx("linkCopied")); } catch (e) { prompt("", s); } }

/* flatten a database row into the shape the renderer uses */
const flat = r => ({ ...(r.details || {}), id: r.id, kind: r.kind, type: r.type, status: r.status, name: r.name,
  image_path: r.image_path, added_by: r.added_by, added: (r.created_at || "").slice(0, 10), _row: r });

/* shrink a photo before upload so big phone photos stay light */
function shrink(file, max) { return new Promise((res, rej) => { const u = URL.createObjectURL(file), im = new Image();
  im.onload = () => { const s = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
    c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); c.toBlob(b => b ? res(b) : rej(new Error("encode")), "image/jpeg", .82); };
  im.onerror = () => { URL.revokeObjectURL(u); rej(new Error("read")); }; im.src = u; }); }
async function uploadPhoto(file) {
  const blob = await shrink(file, 1200);
  const path = `${session.user.id}/${crypto.randomUUID()}.jpg`;
  const { error } = await sb.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  return path;
}

/* ───────────── Language ───────────── */
function applyLang() {
  document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  $("#l-en").setAttribute("aria-pressed", lang === "en"); $("#l-ar").setAttribute("aria-pressed", lang === "ar");
  $("#q").placeholder = tx("search"); $("#fab").textContent = tx("add");
  try { localStorage.setItem("tgl-lang", lang); } catch (e) {}
  rerender();
}
$("#l-en").onclick = () => { lang = "en"; applyLang(); };
$("#l-ar").onclick = () => { lang = "ar"; applyLang(); };
$("#q").oninput = e => { query = e.target.value.trim().toLowerCase(); renderGroups(); };
$("#fab").onclick = () => openForm(null);
$("#listBtn").onclick = openListPicker;
$("#menuBtn").onclick = openListPicker;
let lastView = null;
function rerender() { if (lastView) lastView(); if (openId) openSheet(openId); }

/* ───────────── Routing ───────────── */
function parseHash() {
  const h = location.hash.replace(/^#\/?/, "").split("/");
  return { page: h[0] || "", id: h[1] || "", sub: h[2] || "" };
}
function go(hash) { if (location.hash !== hash) location.hash = hash; else route(); }
window.addEventListener("hashchange", route);

async function route() {
  closeSheet();
  if (recovering) return showNewPassword();
  const r = parseHash();
  if (r.page === "join") return session ? acceptInvite(r.id) : showAuth({ invite: r.id });
  if (r.page === "import") return session ? showImport() : showAuth({});
  if (r.page === "l" && r.id) {
    const k = Object.keys(KINDS).find(k => KINDS[k].hash === r.sub);
    return openList(r.id, k);
  }
  if (!session) return showAuth({});
  await loadMyLists();
  let last = null; try { last = localStorage.getItem("tgl-last"); } catch (e) {}
  const pick = myLists.find(l => l.id === last) || myLists.find(l => l.kind === "private" && l.role === "owner") || myLists[0];
  if (pick) go(`#/l/${pick.id}`); else showScreen(`<div class="center">${esc(tx("notFound"))}</div>`);
}

/* ───────────── Screens ───────────── */
function showScreen(html) {
  lastView = null; $("#hdr").hidden = true; $("#fab").hidden = true; $("#groups").innerHTML = "";
  $("#screen").innerHTML = html; document.title = APP_NAME;
}
function langToggle() {
  return `<div class="lang" role="group" style="margin-bottom:12px;width:max-content"><button data-l="en" aria-pressed="${lang==="en"}">EN</button><button data-l="ar" aria-pressed="${lang==="ar"}">عربي</button></div>`;
}
function wireLangToggle(redraw) {
  document.querySelectorAll("#screen .lang button").forEach(b => b.onclick = () => { lang = b.dataset.l; applyLang(); redraw(); });
}

async function showAuth({ invite }) {
  let mode = "in", inviteInfo = null;
  if (invite) {
    const { data } = await sb.rpc("invite_info", { t: invite });
    inviteInfo = data && data[0];
  }
  const draw = () => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    showScreen(`<div class="auth">${langToggle()}
      <h1>${brandHtml()}</h1>
      <div class="tagline">${tx("tagline")}</div>
      ${invite ? `<div class="invitecard">${inviteInfo && inviteInfo.valid ? tx("inviteTo")(esc(inviteInfo.list_name), esc(inviteInfo.owner_name)) : tx("badInvite")}</div>` : ""}
      <div class="seg"><button data-m="in" aria-pressed="${mode==="in"}">${tx("signIn")}</button><button data-m="up" aria-pressed="${mode==="up"}">${tx("signUp")}</button></div>
      <form id="authF" novalidate>
        ${mode === "up" ? `<div class="field"><label for="aName">${tx("name")}</label><input id="aName" autocomplete="name" required></div>` : ""}
        <div class="field"><label for="aEmail">${tx("email")}</label><input id="aEmail" type="email" autocomplete="email" dir="ltr" required></div>
        <div class="field"><label for="aPw">${tx("password")}</label><input id="aPw" type="password" minlength="6" autocomplete="${mode==="up"?"new-password":"current-password"}" dir="ltr" required>
          ${mode === "up" ? `<span class="note">${tx("pwHint")}</span>` : ""}</div>
        <div id="aMsg"></div>
        <button class="btn pri full" style="margin-top:16px" id="aGo">${mode === "up" ? tx("signUp") : tx("signIn")}</button>
        ${mode === "in" ? `<div style="margin-top:12px;text-align:center"><button type="button" class="linkbtn" id="aForgot">${tx("forgot")}</button></div>` : ""}
      </form></div>`);
    wireLangToggle(draw);
    document.querySelectorAll(".seg button").forEach(b => b.onclick = () => { mode = b.dataset.m; draw(); });
    const msg = (cls, t) => $("#aMsg").innerHTML = `<div class="${cls}">${esc(t)}</div>`;
    const f = $("#aForgot"); if (f) f.onclick = async () => {
      const email = $("#aEmail").value.trim(); if (!email) { $("#aEmail").focus(); return; }
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: origin() });
      error ? msg("err", error.message) : msg("ok", tx("resetSent"));
    };
    $("#authF").onsubmit = async e => {
      e.preventDefault();
      const email = $("#aEmail").value.trim(), password = $("#aPw").value, btn = $("#aGo");
      if (!email || password.length < 6) { msg("err", tx("pwHint")); return; }
      btn.disabled = true;
      if (mode === "up") {
        const display_name = ($("#aName").value || "").trim();
        const { data, error } = await sb.auth.signUp({ email, password, options: { data: { display_name }, emailRedirectTo: origin() + location.hash } });
        btn.disabled = false;
        if (error) return msg("err", error.message);
        if (!data.session) return msg("ok", tx("confirmSent"));
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        btn.disabled = false;
        if (error) return msg("err", error.message);
      }
      // onAuthStateChange re-routes
    };
  };
  draw();
}

function showNewPassword() {
  showScreen(`<div class="auth"><h1>${tx("newPw")}</h1>
    <form id="pwF"><div class="field"><label for="nPw">${tx("password")}</label><input id="nPw" type="password" minlength="6" autocomplete="new-password" dir="ltr"><span class="note">${tx("pwHint")}</span></div>
    <div id="aMsg"></div><button class="btn pri full" style="margin-top:16px">${tx("save")}</button></form></div>`);
  $("#pwF").onsubmit = async e => {
    e.preventDefault();
    const { error } = await sb.auth.updateUser({ password: $("#nPw").value });
    if (error) { $("#aMsg").innerHTML = `<div class="err">${esc(error.message)}</div>`; return; }
    recovering = false; toast(tx("pwSaved")); history.replaceState(null, "", location.pathname); route();
  };
}

async function acceptInvite(token) {
  showScreen(`<div class="center">${tx("loading")}</div>`);
  const { data, error } = await sb.rpc("accept_invite", { t: token });
  if (error) { showScreen(`<div class="auth"><div class="invitecard">${tx("badInvite")}</div><button class="btn pri full" id="home">OK</button></div>`); $("#home").onclick = () => go("#/"); return; }
  await loadMyLists();
  const l = myLists.find(x => x.id === data);
  if (l) toast(tx("joined")(l.name));
  go(`#/l/${data}`);
}

/* ───────────── Data ───────────── */
async function loadMe() {
  if (!session) { me = null; return; }
  const { data } = await sb.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
  me = data || { id: session.user.id, display_name: session.user.email };
  names[me.id] = me.display_name;
}
async function loadMyLists() {
  if (!session) { myLists = []; return; }
  const { data, error } = await sb.from("list_members").select("role, lists(*)").eq("user_id", session.user.id);
  if (error) { toast(tx("err")); return; }
  const order = { private: 0, family: 1, friends: 2, public: 3 };
  myLists = (data || []).filter(r => r.lists).map(r => ({ ...r.lists, role: r.role }))
    .sort((a, b) => order[a.kind] - order[b.kind] || a.created_at.localeCompare(b.created_at));
}
async function loadItems() {
  const { data, error } = await sb.from("items").select("*").eq("list_id", cur.id).order("created_at", { ascending: false });
  if (error) { toast(tx("err")); return; }
  items = (data || []).map(flat);
}
async function loadMembers() {
  members = [];
  if (!canEdit) return;
  const { data } = await sb.from("list_members").select("user_id, role, joined_at").eq("list_id", cur.id);
  members = data || [];
  await loadNames(members.map(m => m.user_id).concat(items.map(i => i.added_by)));
}
async function loadNames(ids) {
  ids = [...new Set(ids.filter(id => id && !names[id]))]; if (!ids.length || !session) return;
  const { data } = await sb.from("profiles").select("id, display_name").in("id", ids);
  (data || []).forEach(p => names[p.id] = p.display_name);
}

async function openList(id, k) {
  if (!cur || cur.id !== id) {
    showScreen(`<div class="center">${tx("loading")}</div>`);
    if (session && !myLists.length) await loadMyLists();
    const mine = myLists.find(l => l.id === id);
    let list = mine;
    if (!list) { const { data } = await sb.from("lists").select("*").eq("id", id).maybeSingle(); list = data; }
    if (!list) {
      if (!session) return showAuth({});
      showScreen(`<div class="auth"><div class="invitecard">${tx("notFound")}</div><button class="btn pri full" id="home">OK</button></div>`);
      $("#home").onclick = () => { try { localStorage.removeItem("tgl-last"); } catch (e) {} go("#/"); }; return;
    }
    cur = list; canEdit = !!mine; isOwner = !!(mine && mine.role === "owner");
    typeF = "all"; statusF = "any"; query = ""; $("#q").value = "";
    await loadItems(); await loadMembers();
    if (canEdit) { try { localStorage.setItem("tgl-last", id); } catch (e) {} }
    subscribe();
  }
  kind = k || kind;
  $("#screen").innerHTML = ""; $("#hdr").hidden = false; $("#fab").hidden = !canEdit;
  lastView = renderMain; renderMain();
  const share = takeShare();
  if (share && canEdit) {
    if (share.img) { try { const c = await caches.open("wl-share"); const r = await c.match("/shared-image");
      if (r) { const blob = await r.blob(); share.image = new File([blob], "screenshot.jpg", { type: blob.type || "image/jpeg" }); await c.delete("/shared-image"); } } catch (e) {} }
    if (share.image && !aiEnabled) await new Promise(r => setTimeout(r, 800));   // give the feature check a moment
    openForm(null, share);
  }
}
function subscribe() {
  if (channel) { sb.removeChannel(channel); channel = null; }
  if (!cur) return;
  let t = null;
  channel = sb.channel("items-" + cur.id)
    .on("postgres_changes", { event: "*", schema: "public", table: "items", filter: "list_id=eq." + cur.id }, () => {
      clearTimeout(t); t = setTimeout(async () => { await loadItems(); await loadNames(items.map(i => i.added_by)); if (lastView === renderMain) { renderMain(); if (openId) openSheet(openId); } }, 300);
    }).subscribe();
}

/* ───────────── Main view ───────────── */
function setKind(k) { kind = k; typeF = "all"; statusF = "any"; history.replaceState(null, "", `#/l/${cur.id}/${KINDS[k].hash}`); renderMain(); }
function renderMain() {
  if (!cur) return;
  document.title = `${cur.name} · ${APP_NAME}`;
  $("#t-title").textContent = cur.name;
  $("#lKind").innerHTML = `${tx("kindIcon")[cur.kind]} ${esc(tx("kindName")[cur.kind])} · ${esc(APP_NAME)}`;
  const b = $("#banner");
  if (!canEdit) {
    b.hidden = false;
    b.innerHTML = `<span>🌍 ${tx("viewing")}</span>${session ? "" : `<button class="btn pri" id="bIn">${tx("signIn")}</button>`}`;
    const bi = $("#bIn"); if (bi) bi.onclick = () => showAuth({});
  } else b.hidden = true;
  renderTabs(); renderChips(); renderGroups();
}
function renderTabs() {
  $("#tabs").innerHTML = Object.entries(KINDS).map(([k, v]) => `<button class="tab" role="tab" aria-selected="${kind===k}" data-k="${k}">${v.tab[lang]}<span class="tcount">${ofKind(k).length}</span></button>`).join("");
  $("#tabs").querySelectorAll(".tab").forEach(b => b.onclick = () => setKind(b.dataset.k));
}
function renderChips() {
  const K = KINDS[kind], used = new Set(ofKind(kind).map(p => K.types[p.type] ? p.type : "other"));
  const keys = ["all", ...Object.keys(K.types).filter(k => used.has(k))];
  $("#types").innerHTML = keys.length > 2 ? keys.map(k => `<button class="chip" data-t="${k}" aria-pressed="${typeF===k}">${k==="all"?tx("all"):`<span class="dot" style="background:${K.types[k].c}"></span>${K.types[k][lang]}`}</button>`).join("") : "";
  $("#types").querySelectorAll("button").forEach(b => b.onclick = () => { typeF = b.dataset.t; renderChips(); renderGroups(); });
  $("#status").innerHTML = [["any", tx("anyStatus")], ["want", K.want[lang]], ["visited", K.done[lang]]].map(([k, v]) => `<button class="chip" data-s="${k}" aria-pressed="${statusF===k}">${v}</button>`).join("");
  $("#status").querySelectorAll("button").forEach(b => b.onclick = () => { statusF = b.dataset.s; renderChips(); renderGroups(); });
}
function renderGroups() {
  const K = KINDS[kind], list = ofKind(kind);
  const cs = new Set(list.map(p => p.country).filter(Boolean));
  $("#stat").textContent = list.length ? count(kind, list.length) + (K.group === "country" && cs.size ? ` · ${tx("countries")(cs.size)}` : "") : "";
  const host = $("#groups");
  if (!list.length) { host.innerHTML = `<div class="empty"><b>${K.emptyT[lang]}</b>${canEdit ? tx("emptyB")(K.one[lang]) : tx("emptyRO")}</div>`; return; }
  const f = list.filter(p => (typeF === "all" || (K.types[p.type] ? p.type : "other") === typeF) && (statusF === "any" || (p.status || "want") === statusF) &&
    (!query || [p.name, p.name_en, p.name_ar, p.city, p.city_en, p.city_ar, p.store, p.provider, p.genre, p.genre_en, p.genre_ar, (p.cast || []).join(" "), p.author].join(" ").toLowerCase().includes(query)));
  if (!f.length) { host.innerHTML = `<div class="empty">${tx("nomatch")}</div>`; return; }
  const keyOf = p => K.group === "country" ? (p.country || "ZZ") : (K.types[p.type] ? p.type : "other");
  const g = {}; f.forEach(p => (g[keyOf(p)] ??= []).push(p));
  const label = k => K.group === "country" ? (k === "ZZ" ? "🌍" : cName(k)) : K.types[k][lang];
  const order = Object.keys(g).sort((a, b) => g[b].length - g[a].length || label(a).localeCompare(label(b)));
  host.innerHTML = order.map(gk => {
    const ck = kind + ":" + gk, t = K.types[gk];
    const badge = K.group === "country" ? `<span class="flag">${flag(gk === "ZZ" ? "" : gk)}</span>` : `<span class="flag gbadge" style="background:${t.c}">${esc([...t[lang]][0])}</span>`;
    return `<section class="group ${collapsed.has(ck) ? "collapsed" : ""}" data-ck="${esc(ck)}">
      <button class="chead" aria-expanded="${!collapsed.has(ck)}">${badge}
        <span><div class="cname">${esc(label(gk))}</div><div class="ccount">${count(kind, g[gk].length)}</div></span>
        <span class="chev">▾</span></button>
      <div class="list">${g[gk].map(card).join("")}</div></section>`;
  }).join("");
  host.querySelectorAll(".chead").forEach(b => b.onclick = () => { const ck = b.parentElement.dataset.ck; collapsed.has(ck) ? collapsed.delete(ck) : collapsed.add(ck); renderGroups(); });
  host.querySelectorAll(".card").forEach(b => b.onclick = () => openSheet(b.dataset.id));
}
function metaOf(p) {
  const k = kindOf(p);
  if (k === "buy") return p.store || "";
  if (k === "service") return [p.provider, L(p, "city")].filter(Boolean).join(" · ");
  if (k === "book") return [p.author, p.year].filter(Boolean).join(" · ");
  if (k === "movie") return [p.year, L(p, "genre")].filter(Boolean).join(" · ");
  return L(p, "city") || "";
}
function priceOf(p) {
  const k = kindOf(p);
  if (k === "movie" || k === "book") return p.rating ? `★ ${p.rating}` : "";
  if (k === "buy") return p.price || p.price_from || "";
  return p.price_from ? `${tx("from")} ${p.price_from}` : "";
}
function card(p) {
  const k = kindOf(p), t = typeOf(p), name = L(p, "name") || "", c = coverOf(p), pr = priceOf(p), m = metaOf(p);
  const shared = cur && cur.kind !== "private" && p.added_by && names[p.added_by];
  return `<button class="card" data-id="${esc(p.id)}">
    <span class="thumb" style="${c ? `background-image:url('${esc(c)}')` : ""}">${c ? "" : esc([...name][0] || "?")}</span>
    <span class="cbody"><span class="pname">${esc(name)}</span>
      <span class="type"><span class="dot" style="background:${t.c}"></span>${t[lang]}</span>
      ${m ? `<span class="meta">${esc(m)}</span>` : ""}
      ${pr ? `<span class="price">${esc(pr)}</span>` : ""}
      ${shared ? `<span class="note">${tx("addedBy")} ${esc(who(p.added_by))}</span>` : ""}</span>
    ${p.processing ? `<span class="visited rev">${tx("reading")}</span>` : p.review ? `<span class="visited rev">${tx("review")}</span>` : p.status === "visited" ? `<span class="visited">${KINDS[k].badge[lang]}</span>` : ""}</button>`;
}

/* ───────────── Item detail ───────────── */
const blk = (label, html) => html ? `<div class="blk"><div class="lbl">${label}</div>${html}</div>` : "";
const chipsHtml = a => (a && a.length) ? `<div class="feats">${a.map(f => `<span>${esc(f)}</span>`).join("")}</div>` : "";
const pricesHtml = p => (p.prices || []).length ? `<table class="pr">${p.prices.map(r => `<tr><td>${esc(lang === "ar" ? r.ar : r.en)}</td><td>${esc(r.value)}</td></tr>`).join("")}</table>` : "";
const ext = (u, label, cls = "btn") => safeUrl(u) ? `<a class="${cls}" href="${esc(u)}" target="_blank" rel="noopener">${label} ↗</a>` : "";

function openSheet(id) {
  const p = items.find(x => x.id === id); if (!p) { closeSheet(); return; }
  openId = id; const k = kindOf(p), K = KINDS[k], t = typeOf(p), c = coverOf(p), name = L(p, "name") || "";
  let sub = `<span class="type"><span class="dot" style="background:${t.c}"></span>${t[lang]}</span>`;
  if (k === "place" || k === "service") {
    const loc = [k === "service" ? p.provider : "", L(p, "city")].filter(Boolean).map(esc).join(" · ");
    sub += (loc || p.country) ? ` · ${p.country ? flag(p.country) + " " : ""}${loc}${p.country ? `${loc ? ", " : ""}${esc(cName(p.country))}` : ""}` : "";
  } else if (k === "buy") sub += p.store ? ` · ${esc(p.store)}` : "";
  else sub += metaOf(p) ? ` · ${esc(metaOf(p))}` : "";

  let cta = "";
  if (k === "buy" && safeUrl(p.product_url)) cta = `<div class="cta">${ext(p.product_url, tx("viewProduct"), "btn pri")}</div>`;
  if (k === "movie") { const q = [p.name_en || name, p.year, p.type === "series" ? "TV series" : "film"].filter(Boolean).join(" ");
    cta = `<div class="cta">${ext(p.summary_link || gsearch(q + " plot summary"), tx("gSummary"), "btn pri")}${ext(p.cast_link || gsearch(q + " cast"), tx("gCast"))}${ext(p.trailer || ("https://www.youtube.com/results?search_query=" + encodeURIComponent(q + " trailer")), tx("trailer"))}</div>`; }
  if (k === "book") { const q = [p.name_en || name, p.author].filter(Boolean).join(" ");
    cta = `<div class="cta">${ext(p.summary_link || gsearch(q + " book summary"), tx("gSummary"), "btn pri")}${ext(p.goodreads || ("https://www.goodreads.com/search?q=" + encodeURIComponent(q)), tx("gReviews"))}${ext(p.product_url || ("https://www.amazon.sa/s?k=" + encodeURIComponent(q)), tx("buyBook"))}</div>`; }

  let body = blk(k === "movie" ? tx("story") : tx("about"), L(p, "summary") ? `<div>${esc(L(p, "summary"))}</div>` : "");
  if (k === "movie") {
    body += blk(tx("cast"), chipsHtml(p.cast)) + blk(tx("director"), p.director ? `<div>${esc(p.director)}</div>` : "")
      + blk(tx("rating"), p.rating ? `<div>★ ${esc(p.rating)}</div>` : "") + blk(tx("runtime"), L(p, "runtime") ? `<div>${esc(L(p, "runtime"))}</div>` : "")
      + blk(tx("watch"), L(p, "watch") ? `<div>${esc(L(p, "watch"))}</div>` : "");
  } else if (k === "book") {
    body += blk(tx("author"), p.author ? `<div>${esc(p.author)}</div>` : "") + blk(tx("pages"), p.pages ? `<div>${esc(p.pages)}</div>` : "")
      + blk(tx("language"), L(p, "language") ? `<div>${esc(L(p, "language"))}</div>` : "") + blk(tx("rating"), p.rating ? `<div>★ ${esc(p.rating)}</div>` : "");
  } else if (k === "buy") {
    body += blk(tx("price"), (p.price ? `<div class="bigprice">${esc(p.price)}</div>` : "") + pricesHtml(p) || `<div class="note">${tx("noprice")}</div>`);
  } else {
    body += blk(tx("prices"), (p.price_from && !(p.prices || []).length ? `<div class="bigprice">${esc(tx("from"))} ${esc(p.price_from)}</div>` : "") + pricesHtml(p) || `<div class="note">${tx("noprice")}</div>`);
  }
  body += blk(tx("features"), chipsHtml(lang === "ar" ? (p.features_ar || p.features_en) : (p.features_en || p.features_ar)))
    + blk(tx("hours"), L(p, "hours") ? `<div>${esc(L(p, "hours"))}</div>` : "")
    + blk(tx("ages"), L(p, "ages") ? `<div>${esc(L(p, "ages"))}</div>` : "")
    + blk(tx("address"), L(p, "address") ? `<div>${esc(L(p, "address"))}</div>` : "")
    + blk(tx("phone"), p.phone ? `<div dir="ltr" style="user-select:all;font-variant-numeric:tabular-nums">${esc(p.phone)}</div>` : "");
  const links = [[p.maps, tx("map")], [p.instagram, tx("insta")], [p.website, tx("web")]].filter(x => safeUrl(x[0]));
  body += blk(tx("links"), links.length ? `<div class="links">${links.map(([u, l]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${l} ↗</a>`).join("")}</div>` : "");
  const others = myLists.filter(l => l.id !== cur.id);

  sheet(`${c ? `<img class="shot${k === "movie" || k === "buy" || k === "book" ? " poster" : ""}" src="${esc(c)}" alt="">` : ""}
    ${canEdit ? `<div class="row" style="margin-top:8px"><label class="linkbtn">${tx("cover")}<input type="file" id="coverIn" accept="image/*" hidden></label></div>` : ""}
    ${canEdit && (p.review || p.processing) ? `<div class="banner" style="margin-top:12px">${p.processing ? `<span class="spin"></span><span>${tx("readingT")}</span>`
      : `<span style="flex:1">${tx("reviewT")}</span><button class="btn pri" id="okRev">${tx("looksGood")}</button><button class="btn" id="edRev">${tx("edit")}</button>`}</div>` : ""}
    <h2>${esc(name)}</h2>
    <div class="sub">${sub}</div>
    ${cur.kind !== "private" && p.added_by && names[p.added_by] ? `<div class="note" style="margin-top:4px">${tx("addedBy")} ${esc(who(p.added_by))}</div>` : ""}
    ${cta}${body}
    ${canEdit ? `<div class="blk"><div class="lbl">${tx("notes")}</div><textarea id="notes">${esc(p.notes || "")}</textarea>
      <div class="row" style="margin-top:8px"><button class="btn" id="saveN">${tx("save")}</button></div></div>`
      : (p.notes ? blk(tx("notes"), `<div>${esc(p.notes)}</div>`) : "")}
    ${session && others.length ? `<div class="blk"><div class="lbl">${tx("copyTo")}</div><div class="row">${others.map(l => `<button class="btn" data-copy="${l.id}">${tx("kindIcon")[l.kind]} ${esc(l.name)}</button>`).join("")}</div></div>` : ""}
    ${!session ? `<div class="blk note">${tx("saveToMine")}</div>` : ""}
    <div class="blk row">
      ${canEdit ? `<button class="btn pri" id="tog">${p.status === "visited" ? tx("markW") : K.markD[lang]}</button>
        <button class="btn" id="edit">${tx("edit")}</button>
        <button class="btn danger" id="del">${tx("del")}</button>` : ""}
      <button class="btn" id="cls">${tx("close")}</button></div>
    ${p.checked ? `<div class="note blk">${tx("verified")}: ${esc(p.checked)}</div>` : ""}`, name);

  document.querySelectorAll("[data-copy]").forEach(b => b.onclick = () => copyItem(p, b.dataset.copy));
  if (!canEdit) return;
  $("#coverIn").onchange = async e => { const f = e.target.files[0]; if (!f) return;
    try { const path = await uploadPhoto(f); await patch(p, { image_path: path }); toast(tx("coverOk")); } catch (err) { toast(tx("err")); } };
  $("#saveN").onclick = () => patch(p, { details: { ...p._row.details, notes: $("#notes").value } }, tx("saved"));
  $("#tog").onclick = () => patch(p, { status: p.status === "visited" ? "want" : "visited" });
  $("#edit").onclick = () => openForm(p);
  const ok = $("#okRev"); if (ok) ok.onclick = () => { const d = { ...p._row.details }; delete d.review; delete d.processing; patch(p, { details: d }); };
  const er = $("#edRev"); if (er) er.onclick = () => openForm(p);
  let armed = false;
  $("#del").onclick = async e => {
    if (!armed) { armed = true; e.target.textContent = tx("delSure"); return; }
    const { error } = await sb.from("items").delete().eq("id", p.id);
    if (error) return toast(tx("err"));
    items = items.filter(x => x.id !== p.id); closeSheet(); renderMain();
  };
}
async function patch(p, upd, msg) {
  const { data, error } = await sb.from("items").update(upd).eq("id", p.id).select().single();
  if (error) { toast(tx("err")); return; }
  const i = items.findIndex(x => x.id === p.id); if (i >= 0) items[i] = flat(data);
  renderMain(); if (openId) openSheet(openId); if (msg) toast(msg);
}
async function copyItem(p, listId) {
  const r = p._row;
  const { error } = await sb.from("items").insert({ list_id: listId, kind: r.kind, type: r.type, status: "want", name: r.name, details: r.details, image_path: r.image_path, added_by: session.user.id });
  error ? toast(tx("err")) : toast(tx("copied"));
}

/* ───────────── Add / edit form ───────────── */
const COUNTRIES = ["SA","EG","AE","KW","QA","BH","OM","JO","LB","MA","TN","TR","GR","IT","ES","FR","DE","AT","CH","NL","GB","GE","AZ","MV","TH","ID","MY","SG","JP","US","CA"];
const FIELDS = {
  place:   [["country","countryL","country"],["city","cityL"],["price_from","priceFromL"],["phone","phoneL","tel"],["maps","mapsL","url"],["website","webL","url"],["instagram","instaL","url"]],
  buy:     [["store","storeL"],["price","priceL"],["product_url","linkL","url"]],
  service: [["provider","providerL"],["country","countryL","country"],["city","cityL"],["price_from","priceFromL"],["phone","phoneL","tel"],["website","webL","url"]],
  movie:   [["year","yearL"],["genre","genreL"],["director","directorL"],["watch","watchL"]],
  book:    [["author","authorL"],["year","yearL"],["pages","pagesL"]]
};
function openForm(p, pre) {
  closeSheet();
  let fk = p ? kindOf(p) : (pre && pre.kind) || kind, photo = (pre && pre.image) || null;
  let ai = null, busy = false, aiErr = "";            // ai = details found from a screenshot, waiting for review
  const base = () => p || ai;                         // what the form started from
  const val = f => {
    if (p) return L(p, f) ?? "";
    if (ai) return f === "notes" ? [ai.notes, pre && pre.notes].filter(Boolean).join("\n") : (L(ai, f) ?? "");
    return pre ? (sharedFields(pre, fk)[f] ?? "") : "";
  };
  const curType = () => p ? p.type : ai ? ai.type : "";
  const draw = () => {
    const K = KINDS[fk];
    const fieldHtml = ([f, lbl, ty]) => {
      if (ty === "country") return `<div class="field"><label for="f_${f}">${tx(lbl)}</label><select id="f_${f}"><option value="">${tx("none")}</option>${
        [...new Set([...COUNTRIES, val(f)].filter(Boolean))].map(c => ({ c, n: cName(c) })).sort((a, b) => a.n.localeCompare(b.n, lang)).map(({ c, n }) => `<option value="${c}" ${val(f) === c ? "selected" : ""}>${flag(c)} ${esc(n)}</option>`).join("")}</select></div>`;
      return `<div class="field"><label for="f_${f}">${tx(lbl)}</label><input id="f_${f}" ${ty === "url" ? 'type="url" dir="ltr" placeholder="https://"' : ty === "tel" ? 'type="tel" dir="ltr"' : ""} value="${esc(val(f))}"></div>`;
    };
    const aiBox = !p && aiEnabled ? `<div class="blk aibox">
        ${busy ? `<div class="aibusy"><span class="spin"></span>${tx("aiBusy")}</div>`
        : ai ? `<div class="ok" style="margin:0">✓ ${tx("aiDone")}</div>`
        : `<label class="drop ai" for="f_ai"><b>✨ ${tx("aiPick")}</b><span class="note">${tx("aiHelp")}</span><input type="file" id="f_ai" accept="image/*"></label>
           ${pre && (pre.name || pre.url) ? `<button type="button" class="btn" id="aiText" style="margin-top:8px">✨ ${tx("aiFromLink")}</button>` : ""}`}
        ${aiErr ? `<div class="err">${esc(aiErr)}</div>` : ""}</div>` : "";
    const extras = ai ? [ai.prices && ai.prices.length ? `${ai.prices.length} ${tx("prices").toLowerCase()}` : "", (ai.features_en || ai.features_ar) ? tx("features") : "", L(ai, "hours") ? tx("hours") : "", L(ai, "address") ? tx("address") : ""].filter(Boolean) : [];
    sheet(`<h2>${p ? tx("editT") : tx("addT")(K.noun[lang])}</h2>
      ${aiBox}
      ${p ? "" : `<div class="blk"><div class="lbl">${tx("kindL")}</div><div class="chips" id="fKind" style="flex-wrap:wrap;padding-top:0">${Object.entries(KINDS).map(([k, v]) => `<button class="chip" data-k="${k}" aria-pressed="${k === fk}">${v.noun[lang]}</button>`).join("")}</div></div>`}
      <form id="itemF" novalidate>
        <div class="field"><label for="f_name">${tx("nameL")} *</label><input id="f_name" required value="${esc(val("name"))}"></div>
        <div class="grid2">
          <div class="field"><label for="f_type">${tx("typeL")}</label><select id="f_type">${Object.entries(K.types).map(([k, v]) => `<option value="${k}" ${curType() === k ? "selected" : ""}>${esc(v[lang])}</option>`).join("")}</select></div>
          <div class="field"><label for="f_status">${tx("statusL")}</label><select id="f_status"><option value="want">${esc(K.want[lang])}</option><option value="visited" ${p && p.status === "visited" ? "selected" : ""}>${esc(K.done[lang])}</option></select></div>
        </div>
        <div class="grid2">${FIELDS[fk].map(fieldHtml).join("")}</div>
        <div class="field"><label for="f_summary">${tx("summaryL")}</label><textarea id="f_summary">${esc(val("summary"))}</textarea></div>
        <div class="field"><label for="f_notes">${tx("notes")}</label><textarea id="f_notes">${esc(p ? p.notes || "" : val("notes"))}</textarea></div>
        ${extras.length ? `<div class="note">${tx("aiAlso")}: ${esc(extras.join(" · "))}</div>` : ""}
        <div class="blk"><div class="lbl">${tx("photoL")}</div><label class="drop" for="f_photo">${tx("pickPhoto")}<input type="file" id="f_photo" accept="image/*"></label><div class="previews" id="prev">${photo ? `<img src="${URL.createObjectURL(photo)}" alt="">` : p && coverOf(p) ? `<img src="${esc(coverOf(p))}" alt="">` : ""}</div></div>
        <div id="fMsg"></div>
        <div class="blk row"><button class="btn pri" id="fSave" ${busy ? "disabled" : ""}>${tx("save")}</button><button type="button" class="btn" id="cls">${tx("cancel")}</button></div>
      </form>`, tx("editT"));
    $("#cls").onclick = closeSheet;
    if (!p) $("#fKind").querySelectorAll("button").forEach(b => b.onclick = () => { fk = b.dataset.k; draw(); });
    $("#f_photo").onchange = e => { photo = e.target.files[0] || null; $("#prev").innerHTML = photo ? `<img src="${URL.createObjectURL(photo)}" alt="">` : ""; };
    const fa = $("#f_ai"); if (fa) fa.onchange = e => { const f = e.target.files[0]; if (f) { photo = photo || f; runAI(f); } };
    const at = $("#aiText"); if (at) at.onclick = () => runAI(null);
    $("#itemF").onsubmit = async e => {
      e.preventDefault();
      const name = $("#f_name").value.trim();
      if (!name) { $("#fMsg").innerHTML = `<div class="err">${tx("needName")}</div>`; $("#f_name").focus(); return; }
      const btn = $("#fSave"); btn.disabled = true;
      const B = base();
      const details = p ? (({ review, processing, ...d }) => d)(p._row.details) : ai ? (({ kind, type, status, notes, ...rest }) => rest)(ai) : {};
      const setText = (f, v) => {           // changing a field replaces its English/Arabic variants
        if (B && v === (L(B, f) ?? "")) return;
        delete details[f + "_en"]; delete details[f + "_ar"];
        if (v) details[f] = v; else delete details[f];
      };
      FIELDS[fk].forEach(([f]) => setText(f, $("#f_" + f).value.trim()));
      setText("summary", $("#f_summary").value.trim());
      setText("name", name); delete details.name;
      details.notes = $("#f_notes").value.trim(); if (!details.notes) delete details.notes;
      const keepName = B && name === (L(B, "name") ?? "");
      const row = { kind: fk, type: $("#f_type").value, status: $("#f_status").value,
        name: keepName ? (p ? p._row.name : (ai.name_en || ai.name_ar || name)) : name, details };
      try {
        if (photo) row.image_path = await uploadPhoto(photo);
        if (p) {
          const { data, error } = await sb.from("items").update(row).eq("id", p.id).select().single(); if (error) throw error;
          const i = items.findIndex(x => x.id === p.id); if (i >= 0) items[i] = flat(data);
        } else {
          const { data, error } = await sb.from("items").insert({ ...row, list_id: cur.id, added_by: session.user.id }).select().single(); if (error) throw error;
          items.unshift(flat(data));
        }
        closeSheet(); if (fk !== kind) setKind(fk); else renderMain(); toast(tx("saved"));
      } catch (err) { btn.disabled = false; $("#fMsg").innerHTML = `<div class="err">${esc(err.message || tx("err"))}</div>`; }
    };
  };
  async function runAI(file) {
    busy = true; aiErr = ""; draw();
    try {
      const image = file ? await new Promise(async (res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(await shrink(file, 1500)); }) : "";
      const note = [pre && pre.name, pre && pre.notes].filter(Boolean).join("\n");
      const resp = await fetch("/api/lookup", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + session.access_token },
        body: JSON.stringify({ image, note, url: pre && pre.url || "", kind: fk }) });
      const out = await resp.json().catch(() => ({}));
      if (!resp.ok || !out.item) throw new Error(out.error || tx("err"));
      ai = out.item; fk = ai.kind;
      if (pre && pre.url) {                              // keep the link the user shared
        const f = sharedFields(pre, fk); ["maps", "instagram", "website", "product_url"].forEach(k => { if (f[k] && !ai[k]) ai[k] = f[k]; });
      }
    } catch (e) { aiErr = e.message || tx("err"); }
    busy = false; draw();
  }
  draw();
  if (pre && pre.image && aiEnabled) runAI(pre.image);
}

/* ───────────── Sharing from other apps (phone Share menu) ───────────── */
const SHARE_KEY = "tgl-share";
function captureShare() {               // called on load: ?title=&text=&url= from the Share menu
  const q = new URLSearchParams(location.search);
  if (!["title", "text", "url", "img"].some(k => q.get(k))) return;
  let title = (q.get("title") || "").trim(), text = (q.get("text") || "").trim(), url = (q.get("url") || "").trim();
  const found = (text.match(/https?:\/\/\S+/) || [])[0];
  if (!url && found) url = found;
  if (found) text = text.replace(found, "").trim();
  if (/^https?:\/\//.test(title)) { if (!url) url = title; title = ""; }
  const host = (() => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return ""; } })();
  const isMaps = /(^|\.)google\.[a-z.]+$/.test(host) && /\/maps/.test(url) || /maps\.app\.goo\.gl|goo\.gl\/maps|maps\.apple\.com/.test(url);
  // name: shared title, else the first line of the shared text (minus app suffixes like " - Google Maps")
  let name = (title || text.split(/\n/)[0] || "").replace(/\s*[-|·–]\s*(Google Maps|YouTube|Instagram|TikTok|Amazon\.sa|noon|SHEIN|IMDb|Goodreads)\s*$/i, "").trim();
  if (name.length > 120) name = name.slice(0, 117) + "…";
  const kindGuess =
    isMaps || /instagram\.com|tiktok\.com|tripadvisor|booking\.com|airbnb/.test(host) ? "place" :
    /imdb\.com|netflix\.com|shahid\.net|osn|primevideo|disneyplus|letterboxd|youtube\.com|youtu\.be/.test(host) ? "movie" :
    /goodreads\.com|jarir\.com\/.*book|kitabi|books\.google/.test(host + url) ? "book" :
    /amazon\.|noon\.com|shein\.|extra\.com|jarir\.com|namshi|ikea\.|aliexpress|temu\.|apple\.com\/.*shop|ounass|trendyol/.test(host + url) ? "buy" : "";
  const notes = [text && text !== name ? text : ""].filter(Boolean).join("\n");
  try { sessionStorage.setItem(SHARE_KEY, JSON.stringify({ name, url, notes, isMaps, kind: kindGuess, img: q.get("img") === "1" })); } catch (e) {}
  history.replaceState(null, "", location.pathname + location.hash);
}
function takeShare() {
  try { const v = sessionStorage.getItem(SHARE_KEY); if (!v) return null; sessionStorage.removeItem(SHARE_KEY); return JSON.parse(v); } catch (e) { return null; }
}
function sharedFields(pre, k) {           // put the shared link in the field that fits the chosen tab
  const f = { name: pre.name || "", notes: pre.notes || "" };
  const u = pre.url || "";
  if (u) {
    if (k === "place") f[pre.isMaps ? "maps" : /instagram\.com/.test(u) ? "instagram" : "website"] = u;
    else if (k === "buy") f.product_url = u;
    else if (k === "service") f.website = u;
    else f.notes = [f.notes, u].filter(Boolean).join("\n");
  }
  return f;
}

/* ───────────── Lists: picker, create, settings ───────────── */
function openListPicker() {
  if (!session) return showAuth({});
  const groups = ["private", "family", "friends", "public"].map(k => [k, myLists.filter(l => l.kind === k)]).filter(([, a]) => a.length);
  sheet(`<h2>${tx("myLists")}</h2>
    ${groups.map(([k, a]) => `<div class="lgroup"><div class="lbl">${tx("kindIcon")[k]} ${esc(tx("kindName")[k])}</div>
      ${a.map(l => `<button class="litem" data-id="${l.id}" aria-current="${cur && cur.id === l.id}"><span class="ic">${tx("kindIcon")[l.kind]}</span>
        <span style="min-width:0"><div class="nm">${esc(l.name)}</div><div class="sm">${l.role === "owner" ? esc(tx("owner")) : esc(tx("kindDesc")[l.kind])}</div></span></button>`).join("")}</div>`).join("")}
    <div class="blk row">
      <button class="btn pri" id="newL">＋ ${tx("newList")}</button>
      ${cur && canEdit ? `<button class="btn" id="setL">⚙︎ ${tx("settings")}</button>` : ""}
      <button class="btn" id="iph">📱 ${tx("iphone")}</button>
    </div>
    <div class="blk row" style="justify-content:space-between;align-items:center">
      <span class="note">${esc(me ? me.display_name : "")} · ${esc(session.user.email)}</span>
      <button class="btn" id="out">${tx("signOut")}</button>
    </div>
    <div class="blk row"><button class="btn" id="cls">${tx("close")}</button></div>`, tx("myLists"));
  document.querySelectorAll(".litem").forEach(b => b.onclick = () => { closeSheet(); go(`#/l/${b.dataset.id}`); });
  $("#newL").onclick = openNewList;
  const s = $("#setL"); if (s) s.onclick = openSettings;
  $("#iph").onclick = openIphone;
  $("#out").onclick = async () => { await sb.auth.signOut(); };
}
function openNewList() {
  let k = "family";
  const draw = () => {
    sheet(`<h2>${tx("newList")}</h2>
      <form id="nlF"><div class="field"><label for="nlName">${tx("listName")}</label><input id="nlName" maxlength="80" required></div>
      <div class="blk"><div class="lbl">${tx("listType")}</div><div class="kindpick">${["private", "family", "friends", "public"].map(x =>
        `<button type="button" data-k="${x}" aria-pressed="${k === x}"><b>${tx("kindIcon")[x]} ${esc(tx("kindName")[x])}</b><span>${esc(tx("kindDesc")[x])}</span></button>`).join("")}</div></div>
      <div id="nlMsg"></div>
      <div class="blk row"><button class="btn pri">${tx("create")}</button><button type="button" class="btn" id="cls">${tx("cancel")}</button></div></form>`, tx("newList"));
    $("#cls").onclick = closeSheet;
    document.querySelectorAll(".kindpick button").forEach(b => b.onclick = () => { const v = $("#nlName").value; k = b.dataset.k; draw(); $("#nlName").value = v; });
    $("#nlF").onsubmit = async e => {
      e.preventDefault();
      const name = $("#nlName").value.trim(); if (!name) return $("#nlName").focus();
      const { data, error } = await sb.from("lists").insert({ name, kind: k, owner_id: session.user.id }).select().single();
      if (error) { $("#nlMsg").innerHTML = `<div class="err">${esc(error.message)}</div>`; return; }
      await loadMyLists(); closeSheet(); go(`#/l/${data.id}`);
      if (k !== "private") setTimeout(openSettings, 400);
    };
  };
  draw();
}
async function openSettings() {
  if (!cur || !canEdit) return;
  await loadMembers();
  let link = "";
  const draw = () => {
    const shareable = cur.kind !== "private";
    sheet(`<h2>${tx("kindIcon")[cur.kind]} ${esc(cur.name)}</h2><div class="sub">${esc(tx("kindName")[cur.kind])} · ${esc(tx("kindDesc")[cur.kind])}</div>
      ${isOwner ? `<form id="rnF" class="blk"><div class="lbl">${tx("rename")}</div><div class="linkbox"><input id="rnName" value="${esc(cur.name)}" maxlength="80"><button class="btn">${tx("save")}</button></div></form>` : ""}
      ${isOwner && shareable ? `<div class="blk"><div class="lbl">${tx("listType")}</div><div class="row">${["family", "friends", "public"].map(x =>
        `<button class="chip" data-kind="${x}" aria-pressed="${cur.kind === x}">${tx("kindIcon")[x]} ${esc(tx("kindName")[x])}</button>`).join("")}</div></div>` : ""}
      ${isOwner && shareable ? `<div class="blk"><div class="lbl">${tx("invite")}</div><div class="note">${tx("inviteHelp")}</div>
        ${link ? `<div class="linkbox"><input readonly value="${esc(link)}" dir="ltr"><button class="btn" id="cpL">${tx("copy")}</button></div>
          <div class="row" style="margin-top:8px">${navigator.share ? `<button class="btn" id="shL">${tx("share")}</button>` : ""}
          <a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(tx("inviteMsg")(cur.name, link))}">${tx("whatsapp")} ↗</a></div>`
        : `<div class="row" style="margin-top:8px"><button class="btn pri" id="mkL">${tx("makeLink")}</button></div>`}</div>` : ""}
      ${cur.kind === "public" ? `<div class="blk"><div class="lbl">${tx("publicLink")}</div><div class="note">${tx("publicHelp")}</div>
        <div class="linkbox"><input readonly value="${esc(listUrl(cur.id))}" dir="ltr"><button class="btn" id="cpP">${tx("copy")}</button></div></div>` : ""}
      ${shareable ? `<div class="blk"><div class="lbl">${tx("members")} (${members.length})</div>${members.map(m => `<div class="member">
        <span class="av">${esc([...(names[m.user_id] || "?")][0].toUpperCase())}</span>
        <span class="nm">${esc(names[m.user_id] || tx("someone"))}${m.user_id === session.user.id ? " ✓" : ""}<div class="note">${m.role === "owner" ? tx("owner") : ""}</div></span>
        ${isOwner && m.role !== "owner" ? `<button class="btn danger" data-rm="${m.user_id}">${tx("remove")}</button>` : ""}</div>`).join("")}</div>` : ""}
      <div class="blk row">
        ${isOwner ? `<button class="btn danger" id="delL">${tx("deleteList")}</button>` : `<button class="btn danger" id="leaveL">${tx("leave")}</button>`}
        <button class="btn" id="cls">${tx("close")}</button></div>`, tx("settings"));
    const rn = $("#rnF"); if (rn) rn.onsubmit = async e => { e.preventDefault(); const name = $("#rnName").value.trim(); if (!name) return;
      const { error } = await sb.from("lists").update({ name }).eq("id", cur.id); if (error) return toast(tx("err"));
      cur.name = name; await loadMyLists(); renderMain(); toast(tx("saved")); };
    document.querySelectorAll("[data-kind]").forEach(b => b.onclick = async () => {
      const { error } = await sb.from("lists").update({ kind: b.dataset.kind }).eq("id", cur.id); if (error) return toast(tx("err"));
      cur.kind = b.dataset.kind; await loadMyLists(); renderMain(); draw(); });
    const mk = $("#mkL"); if (mk) mk.onclick = async () => {
      const { data, error } = await sb.from("invites").insert({ list_id: cur.id, created_by: session.user.id }).select().single();
      if (error) return toast(tx("err"));
      link = `${origin()}#/join/${data.token}`; draw(); };
    const cp = $("#cpL"); if (cp) cp.onclick = () => copyText(link);
    const sh = $("#shL"); if (sh) sh.onclick = () => navigator.share({ title: cur.name, text: tx("inviteMsg")(cur.name, ""), url: link }).catch(() => {});
    const cpp = $("#cpP"); if (cpp) cpp.onclick = () => copyText(listUrl(cur.id));
    document.querySelectorAll("[data-rm]").forEach(b => b.onclick = async () => {
      const { error } = await sb.from("list_members").delete().eq("list_id", cur.id).eq("user_id", b.dataset.rm);
      if (error) return toast(tx("err")); members = members.filter(m => m.user_id !== b.dataset.rm); draw(); });
    const dangerBtn = (sel, sure, run) => { const el = $(sel); if (!el) return; let armed = false;
      el.onclick = async () => { if (!armed) { armed = true; el.textContent = tx(sure); return; } await run(); }; };
    dangerBtn("#delL", "deleteSure", async () => {
      const { error } = await sb.from("lists").delete().eq("id", cur.id); if (error) return toast(tx("err"));
      try { localStorage.removeItem("tgl-last"); } catch (e) {} cur = null; await loadMyLists(); closeSheet(); go("#/"); });
    dangerBtn("#leaveL", "leaveSure", async () => {
      const { error } = await sb.from("list_members").delete().eq("list_id", cur.id).eq("user_id", session.user.id); if (error) return toast(tx("err"));
      try { localStorage.removeItem("tgl-last"); } catch (e) {} cur = null; await loadMyLists(); closeSheet(); go("#/"); });
  };
  draw();
}

/* ───────────── iPhone sharing (Shortcut) ───────────── */
async function openIphone() {
  let row = null;
  const load = async () => {
    const { data } = await sb.from("share_keys").select("*").eq("user_id", session.user.id).maybeSingle();
    row = data;
    if (!row) { const r = await sb.from("share_keys").insert({ user_id: session.user.id }).select().single(); row = r.data; }
  };
  try { await load(); } catch (e) {}
  const endpoint = origin() + "api/share";
  const draw = () => {
    sheet(`<h2>📱 ${tx("iphoneT")}</h2><div class="sub">${tx("iphoneB")}</div>
      ${!shortcutEnabled ? `<div class="invitecard" style="margin-top:12px">${tx("off")}</div>` : ""}
      ${row ? `<div class="blk"><div class="lbl">${tx("shareTo")}</div><select id="shL" class="search" style="margin-top:0">${myLists.map(l =>
          `<option value="${l.id}" ${(row.list_id || myLists.find(x => x.kind === "private" && x.role === "owner")?.id) === l.id ? "selected" : ""}>${tx("kindIcon")[l.kind]} ${esc(l.name)}</option>`).join("")}</select></div>
        <div class="blk"><div class="lbl">${tx("yourKey")}</div><div class="linkbox"><input readonly value="${esc(row.token)}" dir="ltr"><button class="btn" id="cpK">${tx("copy")}</button></div>
          <div class="note" style="margin-top:4px">${tx("keyNote")}</div></div>
        <div class="blk"><div class="lbl">${tx("address")}</div><div class="linkbox"><input readonly value="${esc(endpoint)}" dir="ltr"><button class="btn" id="cpU">${tx("copy")}</button></div></div>`
      : `<div class="err">${tx("err")} — run the latest SQL update in Supabase.</div>`}
      <div class="blk"><ol class="steps">${tx("steps").map(x => `<li>${x}</li>`).join("")}</ol></div>
      <div class="blk row">${row ? `<button class="btn danger" id="rk">${tx("newKey")}</button>` : ""}<button class="btn" id="cls">${tx("close")}</button></div>`, tx("iphoneT"));
    const cpK = $("#cpK"); if (cpK) cpK.onclick = () => copyText(row.token);
    const cpU = $("#cpU"); if (cpU) cpU.onclick = () => copyText(endpoint);
    const sel = $("#shL"); if (sel) sel.onchange = async () => {
      const { error } = await sb.from("share_keys").update({ list_id: sel.value }).eq("user_id", session.user.id);
      error ? toast(tx("err")) : toast(tx("saved")); };
    const rk = $("#rk"); if (rk) { let armed = false; rk.onclick = async () => {
      if (!armed) { armed = true; rk.textContent = tx("delSure"); return; }
      await sb.from("share_keys").delete().eq("user_id", session.user.id); row = null; await load(); draw(); toast(tx("saved")); }; }
  };
  draw();
}

/* ───────────── One-time import from the old Claude version ───────────── */
async function showImport() {
  await loadMyLists();
  let seed = [];
  const draw = () => {
    showScreen(`<div class="auth">${langToggle()}<h1>${tx("importT")}</h1><div class="tagline">${tx("importB")}</div>
      <div class="field"><label for="impF">JSON</label><input type="file" id="impF" accept=".json,application/json"></div>
      <div class="field"><label for="impL">${tx("myLists")}</label><select id="impL">${myLists.map(l => `<option value="${l.id}">${tx("kindIcon")[l.kind]} ${esc(l.name)}</option>`).join("")}</select></div>
      <div class="note" style="margin-top:8px" id="impN">${seed.length ? seed.length + " items" : ""}</div><div id="aMsg"></div>
      <div class="row" style="margin-top:16px"><button class="btn pri" id="impGo" ${seed.length ? "" : "disabled"}>${tx("importGo")}</button><button class="btn" id="impBack">${tx("close")}</button></div></div>`);
    wireLangToggle(draw);
    $("#impBack").onclick = () => go("#/");
    $("#impF").onchange = async e => {
      try { const d = JSON.parse(await e.target.files[0].text()); seed = Array.isArray(d) ? d.filter(x => x && x.id) : []; } catch (err) { seed = []; }
      $("#impN").textContent = seed.length + " items"; $("#impGo").disabled = !seed.length;
    };
    $("#impGo").onclick = async () => {
      const list_id = $("#impL").value, btn = $("#impGo"); btn.disabled = true;
      const { data: existing } = await sb.from("items").select("details").eq("list_id", list_id);
      const have = new Set((existing || []).map(r => r.details && r.details.legacy_id).filter(Boolean));
      const rows = seed.filter(s => !have.has(s.id)).map(s => {
        const { id, kind: k, type, status, name_en, name_ar, ...rest } = s;
        return { list_id, kind: KINDS[k] ? k : "place", type: type || "other", status: status === "visited" ? "visited" : "want",
          name: name_en || name_ar || "Untitled", details: { ...rest, name_en, name_ar, legacy_id: id }, added_by: session.user.id };
      });
      if (!rows.length) { $("#aMsg").innerHTML = `<div class="ok">${tx("importNone")}</div>`; return; }
      const { error } = await sb.from("items").insert(rows);
      if (error) { btn.disabled = false; $("#aMsg").innerHTML = `<div class="err">${esc(error.message)}</div>`; return; }
      toast(tx("importDone")(rows.length)); cur = null; go(`#/l/${list_id}`);
    };
  };
  draw();
}

/* ───────────── Start ───────────── */
(async function start() {
  if (!window.supabase || !CFG.supabaseUrl || !CFG.supabaseAnonKey) {
    showScreen(`<div class="auth"><h1>${esc(APP_NAME)}</h1><div class="err">Setup isn't finished: the Supabase URL and anon key are missing. Add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables, then redeploy.</div></div>`);
    return;
  }
  sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { detectSessionInUrl: true, persistSession: true } });
  applyLang();
  const { data } = await sb.auth.getSession();
  session = data.session;
  await loadMe();
  let booted = false;
  sb.auth.onAuthStateChange(async (event, s) => {
    if (event === "PASSWORD_RECOVERY") { recovering = true; session = s; return showNewPassword(); }
    if (!booted || event === "TOKEN_REFRESHED" || event === "USER_UPDATED" || event === "INITIAL_SESSION") { session = s; return; }
    const changed = (s && s.user.id) !== (session && session.user.id);
    session = s;
    if (!changed) return;
    cur = null; myLists = []; items = []; names = {};
    if (channel) { sb.removeChannel(channel); channel = null; }
    await loadMe();
    // after sign-in, continue an invite or a public list; otherwise go home
    const r = parseHash();
    if (event === "SIGNED_OUT") { history.replaceState(null, "", location.pathname); }
    if (event === "SIGNED_IN" && r.page === "join") return route();
    route();
  });
  booted = true;
  // email-confirmation and recovery links put tokens in the hash; clean them up
  if (/access_token=|error_description=/.test(location.hash)) history.replaceState(null, "", location.pathname);
  captureShare();
  fetch("/api/lookup", { cache: "no-store" }).then(r => r.json()).then(j => { aiEnabled = !!j.enabled; shortcutEnabled = !!j.shortcut; }).catch(() => {});
  route();
})();
