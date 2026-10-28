/* HorasClaras — interfaz. Todo el texto de usuario se pinta con textContent. */
(function () {
  'use strict';
  var HC = window.HC, track = window.hcTrack || function () {};
  var KEY = 'hc_state_v1';
  var $ = function (id) { return document.getElementById(id); };
  var MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var PRO = [
    { id: 'pdf_report', t: 'Informe PDF para reclamar horas', d: 'Un informe claro de tu saldo, mes a mes, listo para enseñar a supervisión o a tu sindicato.' },
    { id: 'pay_calc', t: 'Pluses de noches y festivos', d: 'Estima cuánto deberías cobrar este mes por nocturnidad, festivos y domingos.' },
    { id: 'official_presets', t: 'Jornada oficial de tu servicio de salud', d: 'Elige tu comunidad y categoría y te ponemos la jornada vigente, actualizada.' },
    { id: 'team_roster', t: 'Cuadrante compartido con tu unidad', d: 'Comparte el cuadrante con tus compañeros y apunta los cambios de turno.' },
    { id: 'cloud_sync', t: 'Copia en la nube y varios dispositivos', d: 'Tu cuadrante en el móvil y en el ordenador, sin perder nada.' },
    { id: 'calendar_sync', t: 'Sincronización automática con el calendario', d: 'Tus turnos aparecen solos en Google o Apple Calendar y se actualizan.' },
    { id: 'alerts', t: 'Avisos de saldo y descansos', d: 'Te avisamos si te estás pasando de horas o si un cambio te deja sin 12 h de descanso.' },
    { id: 'photo_import', t: 'Importar el cuadrante desde una foto', d: 'Haz una foto al cuadrante de la unidad y lo pasamos a tu calendario.' }
  ];

  var state, brush = 'M', activated = false, today = HC.iso(new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())));

  function load() {
    try { var raw = JSON.parse(localStorage.getItem(KEY) || 'null'); state = raw ? HC.sanitizeState(raw) : HC.defaultState(new Date().getFullYear()); }
    catch (e) { state = HC.defaultState(new Date().getFullYear()); }
    try { activated = localStorage.getItem('hc_act') === '1'; } catch (e) {}
  }
  var saveT;
  function save() { clearTimeout(saveT); saveT = setTimeout(function () { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { toast('No se pudo guardar en este navegador'); } }, 200); }

  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2600); }
  function fmtH(x) { return (Math.round(x * 10) / 10).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' h'; }
  function el(tag, attrs, text) { var e = document.createElement(tag); if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (text != null) e.textContent = text; return e; }
  function allCodes() { return state.shifts.concat(state.absences); }
  function codeInfo(c) { var f = allCodes().filter(function (x) { return x.code === c; }); return f[0]; }

  // ---------- Paso 1 ----------
  function initSettings() {
    var y0 = new Date().getFullYear();
    [y0 - 1, y0, y0 + 1].forEach(function (y) { $('year').appendChild(el('option', { value: y }, y)); });
    HC.PRESETS.forEach(function (p) { $('preset').appendChild(el('option', { value: p.id }, p.label)); });
    $('year').addEventListener('change', function () { state.year = +this.value; refreshDates(); renderAll(); save(); });
    $('preset').addEventListener('change', function () {
      var p = HC.PRESETS.filter(function (x) { return x.id === $('preset').value; })[0];
      state.preset = p.id; if (p.hours) state.annualTarget = p.hours;
      track('feature_used', { feature: 'preset', id: p.id }); syncInputs(); renderAll(); save();
    });
    bindNum('target', function (v) { state.annualTarget = v; state.preset = 'custom'; $('preset').value = 'custom'; showPresetSrc(); }, 0, 3000);
    bindNum('chgTarget', function (v) { state.change.target = v; }, 0, 3000);
    bindNum('nightRed', function (v) { state.nightReduction = v; }, 0, 12);
    bindNum('absH', function (v) { state.absenceHours = v; }, 0, 24);
    $('chg').addEventListener('change', function () { state.change.enabled = this.checked; $('chgRow').hidden = !this.checked; if (this.checked) track('feature_used', { feature: 'mid_year_change' }); renderAll(); save(); });
    $('chgDate').addEventListener('change', function () { state.change.date = HC.parseISO(this.value) ? this.value : ''; renderAll(); save(); });
  }
  function bindNum(id, setter, min, max) {
    $(id).addEventListener('input', function () {
      var v = parseFloat(String(this.value).replace(',', '.'));
      if (!isFinite(v) || v < min || v > max) { this.setAttribute('aria-invalid', 'true'); return; }
      this.removeAttribute('aria-invalid'); setter(v); renderResults(); save();
    });
  }
  function showPresetSrc() {
    var p = HC.PRESETS.filter(function (x) { return x.id === state.preset; })[0], box = $('presetSrc');
    box.textContent = '';
    if (p && p.src) { box.appendChild(document.createTextNode('Fuente pública: ')); var a = el('a', { href: p.src, target: '_blank', rel: 'noopener' }, 'ver documento'); box.appendChild(a); box.appendChild(document.createTextNode('. Comprueba que es tu caso.')); }
    else box.textContent = 'Escribe la jornada anual de tu acuerdo. Si no la sabes, pregunta en supervisión o en tu sindicato.';
  }
  function syncInputs() {
    $('year').value = state.year; $('preset').value = state.preset; $('target').value = state.annualTarget;
    $('chg').checked = state.change.enabled; $('chgRow').hidden = !state.change.enabled;
    $('chgDate').value = state.change.date; $('chgTarget').value = state.change.target;
    $('nightRed').value = state.nightReduction; $('absH').value = state.absenceHours; showPresetSrc();
  }
  function renderShiftRows() {
    var tb = $('shiftRows'); tb.textContent = '';
    state.shifts.forEach(function (s, i) {
      var tr = el('tr');
      var c = el('td'); var chip = el('span', { class: 'chip', style: 'background:' + s.color + ';cursor:default;display:inline-block;min-height:0;padding:2px 6px' }, s.code); c.appendChild(chip); tr.appendChild(c);
      [['name', 'text'], ['start', 'time'], ['end', 'time']].forEach(function (f) {
        var td = el('td'), inp = el('input', { type: f[1], value: s[f[0]], 'aria-label': f[0] + ' ' + s.code });
        if (f[1] === 'text') inp.maxLength = 24;
        inp.addEventListener('change', function () { if (f[1] === 'time' && !/^\d{2}:\d{2}$/.test(inp.value)) return; s[f[0]] = inp.value; renderShiftRows(); renderAll(); save(); });
        td.appendChild(inp); tr.appendChild(td);
      });
      var tdN = el('td'), cb = el('input', { type: 'checkbox', 'aria-label': 'Es noche ' + s.code }); cb.checked = s.night;
      cb.addEventListener('change', function () { s.night = cb.checked; renderAll(); save(); }); tdN.appendChild(cb); tr.appendChild(tdN);
      tr.appendChild(el('td', null, String(HC.shiftHours(s))));
      tb.appendChild(tr);
    });
  }

  // ---------- Paso 2 ----------
  function renderPalette() {
    var p = $('palette'); p.textContent = '';
    allCodes().forEach(function (x) {
      var b = el('button', { type: 'button', class: 'chip' + (brush === x.code ? ' sel' : ''), style: 'background:' + x.color, role: 'radio', 'aria-checked': brush === x.code ? 'true' : 'false', title: x.name }, x.code);
      b.addEventListener('click', function () { brush = x.code; renderPalette(); });
      p.appendChild(b);
    });
    var er = el('button', { type: 'button', class: 'chip erase' + (brush === '' ? ' sel' : ''), role: 'radio', 'aria-checked': brush === '' ? 'true' : 'false', title: 'Libre / borrar' }, 'Libre');
    er.addEventListener('click', function () { brush = ''; renderPalette(); }); p.appendChild(er);
  }
  function renderMonths() {
    var box = $('months'); box.textContent = '';
    var r = HC.compute(state, today);
    for (var m = 0; m < 12; m++) {
      var mon = el('div', { class: 'month' }), h = el('h4');
      h.appendChild(document.createTextNode(MONTHS[m] + ' '));
      h.appendChild(el('span', null, fmtH(r.months[m].worked + r.months[m].absence) + ' / ' + fmtH(r.months[m].target)));
      mon.appendChild(h);
      var g = el('div', { class: 'dgrid' });
      ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach(function (d) { g.appendChild(el('div', { class: 'dow' }, d)); });
      var first = new Date(Date.UTC(state.year, m, 1)), off = (first.getUTCDay() + 6) % 7;
      for (var k = 0; k < off; k++) g.appendChild(el('div'));
      var nd = new Date(Date.UTC(state.year, m + 1, 0)).getUTCDate();
      for (var d = 1; d <= nd; d++) {
        var key = state.year + '-' + (m < 9 ? '0' : '') + (m + 1) + '-' + (d < 10 ? '0' : '') + d;
        var code = state.days[key], info = code && codeInfo(code);
        var cls = 'day' + (info ? ' filled' : '') + (HC.isHoliday(state, key) ? ' hol' : '') + (key === today ? ' today' : '');
        var b = el('button', { type: 'button', class: cls, 'data-k': key, 'aria-label': key + (info ? ' ' + info.name : ' libre') });
        if (info) b.style.background = info.color;
        b.appendChild(el('span', null, String(d)));
        if (code) b.appendChild(el('b', null, code));
        g.appendChild(b);
      }
      mon.appendChild(g); box.appendChild(mon);
    }
  }
  function paint(key) {
    if (brush === '' || state.days[key] === brush) delete state.days[key]; else state.days[key] = brush;
    track('feature_used', { feature: 'day_edit' });
    renderAll(); save();
  }
  function toggleHoliday(key) {
    var nat = (HC.NATIONAL_HOLIDAYS[state.year] || []).indexOf(key) >= 0;
    if (nat) { toast('Es festivo nacional'); return; }
    if (state.holidays[key]) delete state.holidays[key]; else state.holidays[key] = true;
    toast(state.holidays[key] ? 'Marcado como festivo' : 'Festivo quitado');
    renderAll(); save();
  }
  function initCalendar() {
    var box = $('months'), pressT = null, longFired = false, down = false, lastTog = { k: '', t: 0 };
    function togOnce(k) { var now = Date.now(); if (lastTog.k === k && now - lastTog.t < 1000) return; lastTog = { k: k, t: now }; toggleHoliday(k); }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.day'); if (!b) return;
      if (longFired) { longFired = false; return; }
      paint(b.getAttribute('data-k'));
    });
    box.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('.day'); if (!b || e.button !== 0) return;
      down = true; longFired = false;
      pressT = setTimeout(function () { longFired = true; togOnce(b.getAttribute('data-k')); }, 550);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { box.addEventListener(ev, function () { clearTimeout(pressT); down = false; }); });
    box.addEventListener('contextmenu', function (e) {
      var b = e.target.closest('.day'); if (!b) return;
      e.preventDefault(); if (down) longFired = true; togOnce(b.getAttribute('data-k'));
    });
  }
  function refreshDates() {
    var y = state.year;
    $('pFrom').value = y + '-01-01'; $('pTo').value = y + '-12-31';
    $('pFrom').min = $('pTo').min = $('chgDate').min = y + '-01-01';
    $('pFrom').max = $('pTo').max = $('chgDate').max = y + '-12-31';
  }
  function initPattern() {
    document.querySelectorAll('[data-pat]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); $('pattern').value = a.getAttribute('data-pat'); }); });
    $('applyPat').addEventListener('click', function () {
      var res = HC.applyPattern(state, $('pattern').value, $('pFrom').value, $('pTo').value);
      if (!res.ok) { toast(res.error); return; }
      track('feature_used', { feature: 'pattern_fill', days: res.days });
      toast('Cuadrante rellenado: ' + res.days + ' días'); renderAll(); save();
      if (window.innerWidth < 900) $('results').scrollIntoView({ behavior: 'smooth' });
    });
    $('clearAll').addEventListener('click', function () {
      if (!confirm('¿Borrar todos los turnos del cuadrante?')) return;
      state.days = {}; renderAll(); save();
    });
  }

  // ---------- Paso 3 ----------
  var lastR;
  function renderResults() {
    var r = lastR = HC.compute(state, today);
    var bal = $('bal');
    bal.textContent = (r.balance > 0 ? '+' : '') + fmtH(r.balance);
    bal.className = 'big ' + (r.balance < -0.05 ? 'neg' : 'pos');
    $('balTxt').textContent = r.shifts === 0 ? 'Rellena tu cuadrante para ver el saldo' : (r.balance < -0.05 ? 'Debes ' + fmtH(-r.balance) + ' a final de año' : (r.balance > 0.05 ? 'Te deben ' + fmtH(r.balance) : 'Cuadra exacto'));
    $('kTarget').textContent = fmtH(r.target) + (r.nightReduction ? ' (−' + fmtH(r.nightReduction) + ' por noches)' : '');
    $('kWorked').textContent = fmtH(r.worked);
    $('kAbs').textContent = fmtH(r.absence);
    $('kToday').textContent = r.toDate ? ((r.toDate.balance > 0 ? '+' : '') + fmtH(r.toDate.balance)) : '—';
    $('kToday').className = r.toDate ? (r.toDate.balance < -0.05 ? 'neg' : 'pos') : '';
    $('kShifts').textContent = r.shifts + ' · ' + r.nights;
    $('kHol').textContent = r.holidaysWorked + ' · ' + r.sundaysWorked;
    var bars = $('bars'); bars.textContent = '';
    var mx = Math.max.apply(null, r.months.map(function (m) { return Math.max(m.worked + m.absence, m.target); }).concat([1]));
    r.months.forEach(function (m, i) {
      var v = m.worked + m.absence, b = el('div', { class: 'bar' + (v > m.target + 0.05 ? ' over' : ''), title: MONTHS[i] + ': ' + fmtH(v) + ' de ' + fmtH(m.target) });
      b.style.height = Math.max(1, Math.round(v / mx * 90)) + 'px'; bars.appendChild(b);
    });
    var w = $('warns'); w.textContent = '';
    $('warnBox').hidden = !r.restWarnings.length;
    r.restWarnings.slice(0, 30).forEach(function (x) { w.appendChild(el('li', null, x.from.slice(8) + '/' + x.from.slice(5, 7) + ' ' + x.fromCode + ' → ' + x.to.slice(8) + '/' + x.to.slice(5, 7) + ' ' + x.toCode + ': ' + fmtH(x.hours) + ' de descanso')); });
    if (!activated && r.shifts >= 20) { activated = true; try { localStorage.setItem('hc_act', '1'); } catch (e) {} track('activation', { shifts: r.shifts, balance_sign: r.balance < 0 ? 'neg' : 'pos' }); }
  }
  function renderAll() { renderMonths(); renderResults(); }

  // ---------- Exportar ----------
  function download(name, mime, data) {
    var blob = data instanceof Blob ? data : new Blob([data], { type: mime });
    var a = el('a', { href: URL.createObjectURL(blob), download: name }); document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function shareImage() {
    var r = lastR || HC.compute(state, today), W = 1080, H = 1440, c = document.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d');
    x.fillStyle = '#f7f8f6'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#1f7a63'; x.fillRect(0, 0, W, 150);
    x.fillStyle = '#fff'; x.font = 'bold 54px system-ui,sans-serif'; x.fillText('Mis turnos ' + state.year, 60, 95);
    x.font = '28px system-ui,sans-serif'; x.fillText('HorasClaras', W - 250, 92);
    var cw = 300, ch = 262, ox = 60, oy = 180;
    for (var m = 0; m < 12; m++) {
      var gx = ox + (m % 3) * (cw + 30), gy = oy + Math.floor(m / 3) * (ch + 12);
      x.fillStyle = '#17201d'; x.font = 'bold 24px system-ui,sans-serif'; x.fillText(MONTHS[m], gx, gy + 22);
      var first = new Date(Date.UTC(state.year, m, 1)), off = (first.getUTCDay() + 6) % 7, nd = new Date(Date.UTC(state.year, m + 1, 0)).getUTCDate(), s = 36;
      for (var d = 1; d <= nd; d++) {
        var p = off + d - 1, cx = gx + (p % 7) * (s + 2), cy = gy + 34 + Math.floor(p / 7) * (s + 2);
        var key = state.year + '-' + (m < 9 ? '0' : '') + (m + 1) + '-' + (d < 10 ? '0' : '') + d, info = state.days[key] && codeInfo(state.days[key]);
        x.fillStyle = info ? info.color : '#e6ebe8'; x.fillRect(cx, cy, s, s);
        if (info) { x.fillStyle = '#fff'; x.font = 'bold 15px system-ui,sans-serif'; x.fillText(info.code, cx + 4, cy + 24); }
      }
    }
    x.fillStyle = '#17201d'; x.font = 'bold 38px system-ui,sans-serif';
    x.fillText(r.shifts + ' turnos · ' + r.nights + ' noches · ' + r.holidaysWorked + ' festivos', 60, H - 70);
    x.fillStyle = '#5a6863'; x.font = '26px system-ui,sans-serif'; x.fillText('Calcula tu saldo gratis: kitwisestudio.github.io/horas-claras', 60, H - 28);
    c.toBlob(function (blob) {
      var file = new File([blob], 'mis-turnos-' + state.year + '.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: 'Mis turnos ' + state.year }).catch(function () {}); }
      else download(file.name, 'image/png', blob);
    }, 'image/png');
    track('feature_used', { feature: 'image_export' });
  }
  function initExports() {
    $('exImg').addEventListener('click', shareImage);
    $('exIcs').addEventListener('click', function () { download('turnos-' + state.year + '.ics', 'text/calendar', HC.toICS(state)); track('feature_used', { feature: 'ics_export' }); toast('Abre el archivo para añadir tus turnos al calendario'); });
    $('exPrint').addEventListener('click', function () { track('feature_used', { feature: 'print' }); window.print(); });
    $('exBak').addEventListener('click', function () { download('horasclaras-' + state.year + '.json', 'application/json', JSON.stringify(state)); track('feature_used', { feature: 'backup' }); });
    $('imBak').addEventListener('change', function () {
      var f = this.files && this.files[0]; if (!f) return;
      if (f.size > 500000) { toast('Archivo demasiado grande'); return; }
      var rd = new FileReader();
      rd.onload = function () { try { state = HC.sanitizeState(JSON.parse(rd.result)); syncInputs(); renderShiftRows(); renderPalette(); renderAll(); save(); toast('Copia restaurada'); track('feature_used', { feature: 'restore' }); } catch (e) { toast('Ese archivo no es una copia válida'); } };
      rd.readAsText(f);
    });
  }

  // ---------- Pro (pruebas de interés honestas) ----------
  var currentFeature = null, wtpVal = null;
  function openPro(id) {
    var f = PRO.filter(function (p) { return p.id === id; })[0] || { t: 'HorasClaras Pro', d: 'Funciones extra para quien trabaja a turnos.' };
    currentFeature = id; wtpVal = null;
    $('dlgTitle').textContent = f.t + ': en desarrollo';
    $('dlgText').textContent = 'Todavía no existe. Gracias por tu interés: nos ayuda a decidir qué construir primero. Si quieres, te avisamos cuando esté lista.';
    document.querySelectorAll('#wtp button').forEach(function (b) { b.classList.remove('sel'); });
    $('wlEmail').value = '';
    track('pro_feature_interest', { feature: id });
    if (typeof $('dlg').showModal === 'function') $('dlg').showModal(); else alert($('dlgText').textContent);
  }
  function initPro() {
    var g = $('featGrid');
    PRO.forEach(function (p) {
      var c = el('div', { class: 'card' }); c.appendChild(el('span', { class: 'badge' }, 'Próximamente'));
      c.appendChild(el('h3', { style: 'margin:4px 0' }, p.t)); c.appendChild(el('p', { style: 'margin:0;color:var(--mut)' }, p.d));
      var b = el('button', { class: 'btn ghost small', type: 'button', 'data-pro': p.id, style: 'margin-top:auto' }, 'Me interesa'); c.appendChild(b); g.appendChild(c);
    });
    document.addEventListener('click', function (e) { var b = e.target.closest('[data-pro]'); if (b) { e.preventDefault(); openPro(b.getAttribute('data-pro')); } });
    document.querySelectorAll('#wtp button').forEach(function (b) {
      b.addEventListener('click', function () { document.querySelectorAll('#wtp button').forEach(function (o) { o.classList.remove('sel'); }); b.classList.add('sel'); wtpVal = b.getAttribute('data-v'); track('wtp_choice', { feature: currentFeature, value: wtpVal }); });
    });
    $('dlgForm').addEventListener('submit', function (e) {
      if (e.submitter && e.submitter.value !== 'send') return;
      var email = $('wlEmail').value.trim();
      if (!email) { toast('¡Gracias! Hemos apuntado tu interés.'); return; }
      if (!/^[^\s@]{1,64}@[^\s@]{1,100}\.[^\s@]{2,20}$/.test(email)) { e.preventDefault(); toast('Revisa el email'); return; }
      track('signup_started', { feature: currentFeature });
      var cfg = window.HC_CONFIG || {};
      if (cfg.waitlistEndpoint) {
        fetch(cfg.waitlistEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email: email, feature: currentFeature, wtp: wtpVal || '', _subject: 'HorasClaras lista de espera', _template: 'table', _captcha: 'false' }) })
          .then(function (r) { if (!r.ok) throw 0; track('signup_completed', { feature: currentFeature }); toast('¡Apuntado! Te avisaremos.'); })
          .catch(function () { toast('No se pudo enviar. Prueba más tarde.'); });
      } else {
        location.href = 'mailto:' + cfg.contactEmail + '?subject=' + encodeURIComponent('HorasClaras: avisadme (' + currentFeature + ')') + '&body=' + encodeURIComponent('Quiero que me aviséis cuando salga: ' + currentFeature + (wtpVal ? '\nPagaría: ' + wtpVal : ''));
        track('signup_completed', { feature: currentFeature, via: 'mailto' });
      }
    });
    // pricing_view al ver la sección de precios
    if ('IntersectionObserver' in window) {
      var seen = false, io = new IntersectionObserver(function (en) { if (!seen && en[0].isIntersecting) { seen = true; track('pricing_view'); io.disconnect(); } }, { threshold: .4 });
      io.observe($('precios'));
    }
    document.querySelectorAll('[data-cta]').forEach(function (a) { a.addEventListener('click', function () { track('cta_click', { where: a.getAttribute('data-cta') }); }); });
  }

  // ---------- Arranque ----------
  load();
  initSettings(); syncInputs(); refreshDates(); renderShiftRows(); renderPalette(); initCalendar(); initPattern(); initExports(); initPro(); renderAll();
  var qs = new URLSearchParams(location.search);
  track('landing_view', { src: qs.get('utm_source') || qs.get('ref') || 'direct', returning: Object.keys(state.days).length ? 1 : 0 });
})();
