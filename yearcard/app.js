// YearCard UI: quiz flow, result cards, sharing.
(function () {
  const lang = document.documentElement.lang.slice(0, 2);
  const L = window.YC_I18N[lang] || window.YC_I18N.en, U = L.ui, Q = L.q;
  const CFG = window.YC_CONFIG || {};
  const $ = s => document.querySelector(s);
  const track = (e, d) => { try { window.umami && window.umami.track(e, d); } catch (x) {} };
  const store = {
    get() { try { return JSON.parse(localStorage.getItem("yc26") || "{}"); } catch (e) { return {}; } },
    set(v) { try { localStorage.setItem("yc26", JSON.stringify(v)); } catch (e) {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const STEPS = [
    { k: "name", type: "text" }, { k: "word", type: "text", chips: true }, { k: "mood", type: "mood" },
    { k: "focus", type: "multi" }, { k: "nums", type: "nums" }, { k: "song", type: "text" },
    { k: "moment", type: "text" }, { k: "hard", type: "single" }, { k: "learned", type: "text" },
    { k: "win", type: "text" }, { k: "era", type: "single" }, { k: "energy", type: "sliders" }
  ];
  let ans = store.get(), i = 0;

  function show(id) { ["#hero", "#quiz", "#result"].forEach(s => $(s).hidden = s !== id); window.scrollTo({ top: $(id).offsetTop - 10, behavior: "smooth" }); }

  function renderStep() {
    const st = STEPS[i], q = Q[st.k], box = $("#qbody");
    $("#qstep").textContent = U.step.replace("{n}", i + 1).replace("{t}", STEPS.length);
    $("#qbar").style.width = ((i + 1) / STEPS.length * 100) + "%";
    $("#qtitle").textContent = q.q;
    $("#qhint").textContent = q.hint || ""; $("#qhint").hidden = !q.hint;
    $("#qback").disabled = i === 0;
    $("#qnext").textContent = i === STEPS.length - 1 ? U.finish : U.next;
    let h = "";
    if (st.type === "text") {
      h = `<input id="qin" type="text" maxlength="${YC.LIMITS[st.k]}" placeholder="${esc(q.ph)}" value="${esc(ans[st.k] || "")}" autocomplete="off">`;
      if (st.chips) h += `<div class="chips">${q.chips.map(c => `<button type="button" class="chip" data-v="${esc(c)}">${esc(c)}</button>`).join("")}</div>`;
    } else if (st.type === "mood") {
      const em = ["😵‍💫", "😐", "🙂", "😄", "🤩"];
      h = `<div class="opts five">${q.opts.map((o, j) => `<button type="button" class="opt${ans.mood === j + 1 ? " on" : ""}" data-v="${j + 1}"><span class="em">${em[j]}</span>${esc(o)}</button>`).join("")}</div>`;
    } else if (st.type === "multi" || st.type === "single") {
      const cur = st.type === "multi" ? (ans.focus || []) : [ans[st.k]];
      h = `<div class="opts">${Object.entries(q.opts).map(([v, o]) => `<button type="button" class="opt${cur.includes(v) ? " on" : ""}" data-v="${v}">${esc(o)}</button>`).join("")}</div>`;
    } else if (st.type === "nums") {
      h = `<div class="nums">${["places", "books", "people", "events"].map(k => `<label><span>${esc(q[k])}</span><input type="number" inputmode="numeric" min="0" max="999" data-k="${k}" value="${ans[k] || ""}" placeholder="0"></label>`).join("")}</div>`;
    } else if (st.type === "sliders") {
      h = `<div class="sliders">${[["extro", q.intro, q.extro], ["spont", q.plan, q.spont]].map(([k, l, r]) => `<label class="sl"><input type="range" min="0" max="100" data-k="${k}" value="${ans[k] == null ? 50 : ans[k]}"><span><b>${esc(l)}</b><b>${esc(r)}</b></span></label>`).join("")}</div>`;
    }
    box.innerHTML = h;
    const inp = $("#qin"); if (inp) { inp.focus({ preventScroll: true }); inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); next(); } }); }
    box.querySelectorAll(".chip").forEach(b => b.onclick = () => { $("#qin").value = b.dataset.v; next(); });
    box.querySelectorAll(".opt").forEach(b => b.onclick = () => {
      const v = b.dataset.v;
      if (st.type === "multi") {
        let f = ans.focus || []; f = f.includes(v) ? f.filter(x => x !== v) : f.concat(v).slice(-2); ans.focus = f;
        box.querySelectorAll(".opt").forEach(x => x.classList.toggle("on", f.includes(x.dataset.v)));
      } else { ans[st.k === "mood" ? "mood" : st.k] = st.k === "mood" ? +v : v; setTimeout(next, 180); box.querySelectorAll(".opt").forEach(x => x.classList.toggle("on", x === b)); }
    });
  }
  function collect() {
    const st = STEPS[i];
    if (st.type === "text") ans[st.k] = $("#qin").value.trim();
    if (st.type === "nums" || st.type === "sliders") $("#qbody").querySelectorAll("input").forEach(x => ans[x.dataset.k] = x.value === "" ? undefined : +x.value);
    store.set(ans);
  }
  function next() { collect(); if (i < STEPS.length - 1) { i++; renderStep(); } else finish(); }
  function back() { collect(); if (i > 0) { i--; renderStep(); } }

  let canvases = [];
  async function buildCards(a, target) {
    await YCRender.ready();
    const arch = YC.archetype(a);
    const fns = YCRender.slides(a, L, arch);
    canvases = fns.map(f => ({ c: YCRender.draw(f), name: "yearcard-2026" }));
    canvases.push({ c: YCRender.draw(YCRender.feed(a, L, arch), 1350), name: "yearcard-2026-feed", feed: true });
    target.innerHTML = canvases.map((x, j) => `<figure><img alt="" src="${x.c.toDataURL("image/png")}" data-j="${j}">${x.feed ? `<figcaption>${esc(U.feed)}</figcaption>` : ""}</figure>`).join("");
    target.querySelectorAll("img").forEach(im => im.onclick = () => dl(+im.dataset.j));
    return arch;
  }
  function blob(j) { return new Promise(r => canvases[j].c.toBlob(r, "image/png")); }
  async function dl(j) {
    const b = await blob(j), a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = `${canvases[j].name}-${j + 1}.png`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  async function dlAll() { for (let j = 0; j < canvases.length; j++) { await dl(j); await new Promise(r => setTimeout(r, 350)); } track("download"); }
  async function share() {
    track("share");
    try {
      const files = await Promise.all(canvases.map(async (x, j) => new File([await blob(j)], `${x.name}-${j + 1}.png`, { type: "image/png" })));
      if (navigator.canShare && navigator.canShare({ files })) { await navigator.share({ files, title: "YearCard 2026" }); return; }
    } catch (e) { if (e && e.name === "AbortError") return; }
    alert(U.shareFail); dlAll();
  }
  function link() { return location.origin + location.pathname + "#r=" + YC.encode(ans); }

  async function finish() {
    collect(); show("#result");
    $("#cards").innerHTML = '<p class="muted">…</p>';
    const arch = await buildCards(YC.clean(ans), $("#cards"));
    track("finish", { arch, lang });
  }

  function friend(a) {
    $("#hero").hidden = true; $("#friend").hidden = false;
    $("#ftitle").textContent = a.name ? U.friendTitle.replace("{name}", a.name) : U.friendAnon;
    buildCards(a, $("#fcards")); track("friend_view");
  }

  function init() {
    // Static labels
    document.querySelectorAll("[data-t]").forEach(el => el.textContent = U[el.dataset.t]);
    if (CFG.buyUrl && CFG.buyUrl[lang]) { $("#shop").hidden = false; $("#shopbtn").href = CFG.buyUrl[lang]; $("#shopbtn").onclick = () => track("shop_click", { lang }); }
    $("#start").onclick = () => { i = 0; show("#quiz"); renderStep(); track("start", { lang }); };
    $("#qnext").onclick = next; $("#qback").onclick = back;
    $("#qskip").onclick = () => { const st = STEPS[i]; if (st.type === "text") $("#qin").value = ""; next(); };
    $("#share").onclick = share; $("#dlall").onclick = dlAll;
    $("#again").onclick = () => { ans = {}; store.set(ans); i = 0; show("#quiz"); renderStep(); };
    $("#copy").onclick = async () => {
      try { await navigator.clipboard.writeText(link()); } catch (e) { prompt("", link()); }
      $("#copy").textContent = U.copied; setTimeout(() => $("#copy").textContent = U.copyLink, 2000); track("copy_link");
    };
    $("#fmake").onclick = () => { history.replaceState(null, "", location.pathname); $("#friend").hidden = true; ans = {}; i = 0; show("#quiz"); renderStep(); track("start_from_friend", { lang }); };
    const fromHash = () => { const m = location.hash.match(/^#r=([\w-]+)/); if (m) { const a = YC.decode(m[1]); if (a) { ["#quiz", "#result"].forEach(s => $(s).hidden = true); friend(a); } } };
    fromHash(); window.addEventListener("hashchange", fromHash);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
