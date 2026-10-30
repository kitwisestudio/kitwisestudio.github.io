/* Ready72 interface. Everything stays in the browser (localStorage). */
(function () {
  'use strict';
  var R = window.Ready72, LANG = ({ es: 'es', fr: 'fr' })[document.documentElement.lang] || 'en';
  var T = window.R72_TEXT[LANG], CFG = window.R72_CONFIG || {};
  var KEY = 'ready72.v1';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var state = load();

  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    s = s || { h: { country: ({ es: 'es', fr: 'fr' })[LANG] || 'uk', adults: 2, children: 0, toddlers: 0, babies: 0, dogs: 0, cats: 0, meds: false, medDevice: false }, have: {} };
    var fromHash = R.decode(location.hash);
    if (fromHash) { s.h = fromHash; track('shared_plan_open'); }
    return s;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function track(name, data) { try { if (window.umami) window.umami.track(name, data || {}); } catch (e) {} }
  function fmt(n, cur) { return LANG !== 'en' ? n + ' ' + cur : cur + n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Form <-> state
  function readForm() {
    var f = $('#hh');
    var h = {};
    ['country'].forEach(function (k) { h[k] = f[k].value; });
    ['adults', 'children', 'toddlers', 'babies', 'dogs', 'cats'].forEach(function (k) { h[k] = f[k].value; });
    h.meds = f.meds.checked; h.medDevice = f.medDevice.checked;
    state.h = R.normalise(h);
  }
  function fillForm() {
    var f = $('#hh'), h = R.normalise(state.h);
    f.country.value = h.country;
    ['adults', 'children', 'toddlers', 'babies', 'dogs', 'cats'].forEach(function (k) { f[k].value = h[k]; });
    f.meds.checked = h.meds; f.medDevice.checked = h.medDevice;
  }

  function itemText(it, kit) {
    var t = T.items[it.id] || [it.id, ''];
    var tip = t[1].replace('{b}', it.bottles2l || '').replace('{mah}', (it.mah || 0).toLocaleString()).replace('{radio}', R.PRESETS[kit.household.country].radio);
    var unit = T.units[it.unit];
    var qty;
    if (it.id === 'cash') qty = fmt(it.qty, it.unit);
    else if (it.unit === 'set' || it.unit === 'list' || it.unit === 'kit' || it.unit === 'plan') qty = '';
    else qty = it.qty + (unit ? ' ' + unit : '');
    return { name: t[0], tip: tip, qty: qty };
  }

  function render() {
    var kit = R.buildKit(state.h);
    var cur = kit.totals.currency;
    var byWeek = { 1: [], 2: [], 3: [], 4: [] };
    kit.items.forEach(function (it) { byWeek[it.week].push(it); });
    var html = '';
    [1, 2, 3, 4].forEach(function (w) {
      if (!byWeek[w].length) return;
      var sum = byWeek[w].reduce(function (a, i) { return a + (i.optional ? 0 : i.cost); }, 0);
      html += '<section class="week"><h3>' + esc(T.weekTitles[w - 1]) + '<span class="wsum">' + (sum ? '≈ ' + fmt(Math.round(sum), cur) : T.free) + '</span></h3><ul>';
      byWeek[w].forEach(function (it) {
        var x = itemText(it, kit), on = !!state.have[it.id];
        html += '<li class="item' + (on ? ' done' : '') + '"><label><input type="checkbox" data-id="' + it.id + '"' + (on ? ' checked' : '') + '>' +
          '<span class="body"><span class="nm">' + esc(x.name) + (x.qty ? ' <b class="qty">' + esc(x.qty) + '</b>' : '') +
          (it.note === 'have' ? ' <span class="tag">' + T.atHome + '</span>' : it.free && it.id !== 'cash' ? ' <span class="tag free">' + T.free + '</span>' : '') +
          (it.optional ? ' <span class="tag">' + T.optional + '</span>' : '') +
          '</span>' + (x.tip ? '<span class="tip">' + esc(x.tip) + '</span>' : '') +
          '<span class="cat">' + esc(T.cats[it.cat]) + '</span></span></label></li>';
      });
      html += '</ul></section>';
    });
    $('#plan').innerHTML = html;

    var s = R.score(kit, state.have);
    $('#score-num').textContent = s + '%';
    $('#score-ring').style.setProperty('--p', s);
    $('#score-label').textContent = T.scoreLabel.replace('{s}', s);
    $('#score-hint').textContent = T.scoreHint[s >= 100 ? 3 : s >= 60 ? 2 : s > 0 ? 1 : 0];
    var left = kit.items.reduce(function (a, i) { return a + (!i.optional && !state.have[i.id] ? i.cost : 0); }, 0);
    $('#total').textContent = T.totals.replace('{c}', fmt(Math.round(left), cur));
    $('#total-note').textContent = T.totalsNote;
    $('#water-big').textContent = kit.totals.waterLitres + ' L';
    $('#people-n').textContent = kit.people;
    $$('.only-uk').forEach(function (el) { el.hidden = kit.household.country !== 'uk'; });
    $('#emergency-n').textContent = R.PRESETS[kit.household.country].emergency;
    save();
    return kit;
  }

  function download(name, text, type) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type }));
    a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function shareUrl() { return location.origin + location.pathname + '#p=' + R.encode(state.h); }

  function init() {
    fillForm();
    render();
    $('#hh').addEventListener('input', function () { readForm(); render(); });
    $('#plan').addEventListener('change', function (e) {
      var id = e.target.getAttribute('data-id'); if (!id) return;
      if (e.target.checked) state.have[id] = 1; else delete state.have[id];
      render();
      track('item_check', { id: id });
    });
    $('#btn-print').addEventListener('click', function () { track('print'); window.print(); });
    $('#btn-ics').addEventListener('click', function () {
      var d = new Date(); d.setUTCMonth(d.getUTCMonth() + 6);
      download('ready72-reminder.ics', R.ics(d, T.icsTitle, T.icsDesc + ' ' + shareUrl()), 'text/calendar');
      track('ics');
    });
    $('#btn-share').addEventListener('click', function () {
      var kit = R.buildKit(state.h), url = shareUrl(), text = T.shareText.replace('{n}', kit.people);
      track('share');
      if (navigator.share) { navigator.share({ title: document.title, text: text, url: url }).catch(function () {}); return; }
      (navigator.clipboard ? navigator.clipboard.writeText(text + ' ' + url) : Promise.reject()).then(function () {
        var b = $('#btn-share'), o = b.textContent; b.textContent = T.copied; setTimeout(function () { b.textContent = o; }, 1800);
      }).catch(function () { prompt('', url); });
    });
    $('#btn-reset').addEventListener('click', function () { state.have = {}; render(); });
    $$('[data-buy]').forEach(function (a) {
      if (CFG.buyUrl) { a.href = CFG.buyUrl; a.hidden = false; a.addEventListener('click', function () { track('buy_click', { where: a.getAttribute('data-buy') }); }); }
    });
    track('planner_view', { lang: LANG });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
