// YearCard core: pure logic (archetype, encoding). Works in the browser and in Node tests.
(function (root) {
  const ARCH = ["explorer", "builder", "main", "glow", "heart", "soft", "phoenix", "wildcard"];
  const HARD_HEAVY = ["breakup", "job", "loss", "health", "money"];
  const LIMITS = { name: 20, word: 16, song: 40, moment: 70, learned: 70, win: 60 };

  function n(v) { v = parseInt(v, 10); return isFinite(v) && v > 0 ? Math.min(v, 999) : 0; }

  function archetype(a) {
    const s = {}; ARCH.forEach(k => s[k] = 0);
    const add = (k, v) => { s[k] += v; };
    const focusMap = { travel: [["explorer", 3]], work: [["builder", 3]], create: [["builder", 2], ["wildcard", 1]],
      party: [["main", 3]], health: [["glow", 3]], family: [["heart", 3]], love: [["heart", 2], ["main", 1]], rest: [["soft", 3]] };
    (a.focus || []).forEach(f => (focusMap[f] || []).forEach(([k, v]) => add(k, v)));
    if (n(a.places) >= 5) add("explorer", 2);
    if (n(a.books) >= 10) { add("glow", 1); add("builder", 1); }
    if (n(a.events) >= 5) add("main", 2);
    if (n(a.people) >= 10) add("main", 1);
    const ex = a.extro == null ? 50 : +a.extro, sp = a.spont == null ? 50 : +a.spont;
    if (ex > 60) add("main", 1); if (ex < 40) { add("glow", 1); add("soft", 1); }
    if (sp > 60) { add("wildcard", 2); add("explorer", 1); } if (sp < 40) add("builder", 1);
    const mood = a.mood == null ? 3 : +a.mood; // 1..5
    if (HARD_HEAVY.includes(a.hard)) add("phoenix", 2);
    if (mood <= 2) add("phoenix", 2);
    if (mood >= 4) { add("main", 1); add("soft", 1); }
    let best = ARCH[0];
    ARCH.forEach(k => { if (s[k] > s[best]) best = k; });
    if (s[best] === 0) best = "wildcard";
    return best;
  }

  function clean(a) {
    const out = {};
    Object.keys(LIMITS).forEach(k => { if (a[k]) out[k] = String(a[k]).replace(/\s+/g, " ").trim().slice(0, LIMITS[k]); });
    ["places", "books", "people", "events"].forEach(k => { if (n(a[k])) out[k] = n(a[k]); });
    if (a.mood >= 1 && a.mood <= 5) out.mood = +a.mood;
    if (Array.isArray(a.focus)) out.focus = a.focus.filter(f => typeof f === "string").slice(0, 2);
    ["hard", "era"].forEach(k => { if (typeof a[k] === "string" && /^[a-z]{2,12}$/.test(a[k])) out[k] = a[k]; });
    ["extro", "spont"].forEach(k => { if (a[k] != null && isFinite(+a[k])) out[k] = Math.max(0, Math.min(100, Math.round(+a[k]))); });
    return out;
  }

  const KEYS = { name: "n", word: "w", mood: "m", focus: "f", places: "p", books: "b", people: "o", events: "e", song: "s", moment: "t", hard: "h", learned: "l", win: "v", era: "r", extro: "x", spont: "y" };
  function b64e(str) {
    const bytes = new TextEncoder().encode(str); let bin = "";
    bytes.forEach(b => bin += String.fromCharCode(b));
    return (typeof btoa === "function" ? btoa(bin) : Buffer.from(bin, "binary").toString("base64")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64d(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
    const bin = typeof atob === "function" ? atob(s) : Buffer.from(s, "base64").toString("binary");
    return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
  }
  function encode(a) {
    const c = clean(a), o = {};
    Object.keys(c).forEach(k => o[KEYS[k]] = c[k]);
    return b64e(JSON.stringify(o));
  }
  function decode(str) {
    try {
      const o = JSON.parse(b64d(str)), a = {};
      Object.keys(KEYS).forEach(k => { if (o[KEYS[k]] != null) a[k] = o[KEYS[k]]; });
      return clean(a);
    } catch (e) { return null; }
  }

  const api = { ARCH, archetype, clean, encode, decode, LIMITS };
  if (typeof module !== "undefined") module.exports = api; else root.YC = api;
})(this);
