/* HorasClaras — cálculo puro (sin DOM). Funciona en navegador y en Node para tests. */
(function (root) {
  'use strict';

  var DEFAULT_SHIFTS = [
    { code: 'M', name: 'Mañana', start: '08:00', end: '15:00', night: false, color: '#f2b53a' },
    { code: 'T', name: 'Tarde', start: '15:00', end: '22:00', night: false, color: '#e07a3f' },
    { code: 'N', name: 'Noche', start: '22:00', end: '08:00', night: true, color: '#3b4f8f' },
    { code: 'D', name: 'Día 12 h', start: '08:00', end: '20:00', night: false, color: '#2f8f74' },
    { code: 'N12', name: 'Noche 12 h', start: '20:00', end: '08:00', night: true, color: '#5b3b8f' }
  ];
  // Ausencias: "computa" = el día suma horas a tu jornada (permiso, baja, libre disposición).
  // Las vacaciones normalmente ya están descontadas de la jornada anual, por eso suman 0 por defecto.
  var DEFAULT_ABSENCES = [
    { code: 'V', name: 'Vacaciones', counts: false, color: '#9ec5e8' },
    { code: 'LD', name: 'Libre disposición', counts: true, color: '#b7d99a' },
    { code: 'P', name: 'Permiso / baja', counts: true, color: '#d9a5b3' }
  ];

  // Presets SOLO con fuente pública verificada (28-oct-2026). Siempre editables.
  var PRESETS = [
    { id: 'custom', label: 'Personalizado (escribe tu jornada)', hours: null },
    { id: 'aragon-rot-2026', label: 'Aragón (Salud) 2026 · rotatorio · 1.400 h', hours: 1400,
      src: 'https://www.redaccionmedica.com/autonomias/20251226/sanidad-consolida-la-jornada-de-horas-quien-no-trabajara-por-noche/255229_0.html' },
    { id: 'aragon-dia-2026', label: 'Aragón (Salud) 2026 · diurno · 1.519 h', hours: 1519,
      src: 'https://www.redaccionmedica.com/autonomias/20251226/sanidad-consolida-la-jornada-de-horas-quien-no-trabajara-por-noche/255229_0.html' },
    { id: 'aragon-noc-2026', label: 'Aragón (Salud) 2026 · noches fijas · 1.350 h', hours: 1350,
      src: 'https://www.redaccionmedica.com/autonomias/20251226/sanidad-consolida-la-jornada-de-horas-quien-no-trabajara-por-noche/255229_0.html' },
    { id: 'ingesa-2026', label: 'INGESA 2026 · jornada general 35 h · 1.533 h', hours: 1533,
      src: 'https://ingesa.sanidad.gob.es/ingesa/dam/jcr:bb63c5c7-6dae-49bf-a6c6-a0b1c02dcc84/report_CALENDARIO%20LABORAL%202026%20INGESA%20SSCC%20Y%20DDTT.pdf' }
  ];

  // Festivos nacionales comunes (sin los autonómicos/locales, que el usuario puede marcar).
  var NATIONAL_HOLIDAYS = {
    2026: ['2026-01-01', '2026-01-06', '2026-04-03', '2026-05-01', '2026-08-15', '2026-10-12', '2026-11-01', '2026-12-06', '2026-12-08', '2026-12-25'],
    2027: ['2027-01-01', '2027-01-06', '2027-03-26', '2027-05-01', '2027-08-15', '2027-10-12', '2027-11-01', '2027-12-06', '2027-12-08', '2027-12-25']
  };

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  function parseISO(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    var p = s.split('-').map(Number);
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return iso(d) === s ? d : null;
  }
  function addDays(d, n) { return new Date(d.getTime() + n * 86400000); }
  function daysInYear(y) { return ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) ? 366 : 365; }
  function dayOfYear(d) { return Math.round((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86400000); } // 0-based

  function parseTime(t) {
    if (typeof t !== 'string' || !/^\d{1,2}:\d{2}$/.test(t)) return null;
    var p = t.split(':').map(Number);
    if (p[0] > 24 || p[1] > 59) return null;
    return p[0] * 60 + p[1];
  }
  // Duración en horas; si fin <= inicio, el turno cruza la medianoche.
  function shiftHours(s) {
    var a = parseTime(s.start), b = parseTime(s.end);
    if (a === null || b === null) return 0;
    var mins = b > a ? b - a : b + 1440 - a;
    return Math.round(mins / 6) / 10;
  }

  function clampNum(v, min, max, def) {
    var n = Number(v);
    if (!isFinite(n)) return def;
    return Math.min(max, Math.max(min, n));
  }

  function defaultState(year) {
    return {
      v: 1,
      year: year || new Date().getFullYear(),
      annualTarget: 1530,
      preset: 'custom',
      change: { enabled: false, date: '', target: 1400 },
      nightReduction: 0,
      absenceHours: 7,
      shifts: JSON.parse(JSON.stringify(DEFAULT_SHIFTS)),
      absences: JSON.parse(JSON.stringify(DEFAULT_ABSENCES)),
      days: {},       // 'YYYY-MM-DD' -> code
      holidays: {}    // 'YYYY-MM-DD' -> true (festivos extra marcados por el usuario)
    };
  }

  // Limpia un estado importado/guardado: nunca confiamos en datos externos.
  function sanitizeState(raw) {
    var s = defaultState();
    if (!raw || typeof raw !== 'object') return s;
    s.year = Math.round(clampNum(raw.year, 2020, 2035, s.year));
    s.annualTarget = clampNum(raw.annualTarget, 0, 3000, s.annualTarget);
    s.preset = typeof raw.preset === 'string' ? raw.preset.slice(0, 40) : 'custom';
    s.nightReduction = clampNum(raw.nightReduction, 0, 12, 0);
    s.absenceHours = clampNum(raw.absenceHours, 0, 24, 7);
    if (raw.change && typeof raw.change === 'object') {
      s.change.enabled = !!raw.change.enabled;
      s.change.date = parseISO(raw.change.date) ? raw.change.date : '';
      s.change.target = clampNum(raw.change.target, 0, 3000, 1400);
    }
    var codeRe = /^[A-Za-z0-9]{1,4}$/;
    if (Array.isArray(raw.shifts) && raw.shifts.length) {
      s.shifts = raw.shifts.slice(0, 12).filter(function (x) { return x && codeRe.test(x.code); }).map(function (x) {
        return { code: String(x.code).toUpperCase(), name: String(x.name || x.code).slice(0, 24),
          start: parseTime(x.start) !== null ? x.start : '08:00', end: parseTime(x.end) !== null ? x.end : '15:00',
          night: !!x.night, color: /^#[0-9a-fA-F]{6}$/.test(x.color) ? x.color : '#888888' };
      });
    }
    if (Array.isArray(raw.absences) && raw.absences.length) {
      s.absences = raw.absences.slice(0, 8).filter(function (x) { return x && codeRe.test(x.code); }).map(function (x) {
        return { code: String(x.code).toUpperCase(), name: String(x.name || x.code).slice(0, 24), counts: !!x.counts,
          color: /^#[0-9a-fA-F]{6}$/.test(x.color) ? x.color : '#cccccc' };
      });
    }
    var valid = {};
    s.shifts.concat(s.absences).forEach(function (x) { valid[x.code] = true; });
    if (raw.days && typeof raw.days === 'object') {
      Object.keys(raw.days).slice(0, 4000).forEach(function (k) {
        if (parseISO(k) && valid[raw.days[k]]) s.days[k] = raw.days[k];
      });
    }
    if (raw.holidays && typeof raw.holidays === 'object') {
      Object.keys(raw.holidays).slice(0, 400).forEach(function (k) { if (parseISO(k) && raw.holidays[k]) s.holidays[k] = true; });
    }
    return s;
  }

  // Jornada objetivo prorrateada por días naturales, con cambio opcional a mitad de año.
  function targetForRange(state, fromIdx, toIdxExcl) {
    var y = state.year, n = daysInYear(y);
    var changeIdx = n;
    if (state.change && state.change.enabled) {
      var cd = parseISO(state.change.date);
      if (cd && cd.getUTCFullYear() === y) changeIdx = dayOfYear(cd);
    }
    var before = Math.max(0, Math.min(toIdxExcl, changeIdx) - fromIdx);
    var after = Math.max(0, toIdxExcl - Math.max(fromIdx, changeIdx));
    var t1 = state.annualTarget, t2 = (state.change && state.change.enabled) ? state.change.target : t1;
    return (t1 * before + t2 * after) / n;
  }

  function isHoliday(state, key) {
    var list = NATIONAL_HOLIDAYS[state.year] || [];
    return list.indexOf(key) >= 0 || !!state.holidays[key];
  }

  // Cálculo principal. todayISO opcional para "saldo a hoy".
  function compute(state, todayISO) {
    var y = state.year, n = daysInYear(y);
    var shiftBy = {}, absBy = {};
    state.shifts.forEach(function (s) { shiftBy[s.code] = s; });
    state.absences.forEach(function (a) { absBy[a.code] = a; });

    var months = [];
    for (var m = 0; m < 12; m++) months.push({ worked: 0, absence: 0, shifts: 0, target: 0 });

    var tot = { worked: 0, absence: 0, shifts: 0, nights: 0, holidaysWorked: 0, sundaysWorked: 0, byCode: {} };
    var toDate = { worked: 0, absence: 0, nights: 0 };
    var today = parseISO(todayISO || '');
    var todayIdx = (today && today.getUTCFullYear() === y) ? dayOfYear(today) + 1 : (today && today.getUTCFullYear() > y ? n : 0);
    var intervals = [];

    var start = new Date(Date.UTC(y, 0, 1));
    for (var i = 0; i < n; i++) {
      var d = addDays(start, i), key = iso(d), code = state.days[key];
      if (!code) continue;
      var mo = d.getUTCMonth();
      if (shiftBy[code]) {
        var sh = shiftBy[code], h = shiftHours(sh);
        tot.worked += h; tot.shifts++; months[mo].worked += h; months[mo].shifts++;
        tot.byCode[code] = (tot.byCode[code] || 0) + 1;
        if (sh.night) tot.nights++;
        if (isHoliday(state, key)) tot.holidaysWorked++;
        if (d.getUTCDay() === 0) tot.sundaysWorked++;
        if (i < todayIdx) { toDate.worked += h; if (sh.night) toDate.nights++; }
        var st = d.getTime() + parseTime(sh.start) * 60000;
        intervals.push({ key: key, code: code, start: st, end: st + h * 3600000 });
      } else if (absBy[code]) {
        var ah = absBy[code].counts ? state.absenceHours : 0;
        tot.absence += ah; months[mo].absence += ah;
        tot.byCode[code] = (tot.byCode[code] || 0) + 1;
        if (i < todayIdx) toDate.absence += ah;
      }
    }

    // Objetivo por mes
    for (var mm = 0; mm < 12; mm++) {
      var a = dayOfYear(new Date(Date.UTC(y, mm, 1)));
      var b = mm === 11 ? n : dayOfYear(new Date(Date.UTC(y, mm + 1, 1)));
      months[mm].target = targetForRange(state, a, b);
    }

    var reduction = tot.nights * state.nightReduction;
    var target = targetForRange(state, 0, n) - reduction;
    var computed = tot.worked + tot.absence;
    var targetToDate = targetForRange(state, 0, todayIdx) - toDate.nights * state.nightReduction;

    // Descansos < 12 h entre el fin de un turno y el inicio del siguiente
    var restWarnings = [];
    for (var k = 1; k < intervals.length; k++) {
      var gap = (intervals[k].start - intervals[k - 1].end) / 3600000;
      if (gap < 12) restWarnings.push({ from: intervals[k - 1].key, to: intervals[k].key, hours: Math.round(gap * 10) / 10,
        fromCode: intervals[k - 1].code, toCode: intervals[k].code });
    }

    function r1(x) { return Math.round(x * 10) / 10; }
    return {
      year: y,
      target: r1(target),
      nightReduction: r1(reduction),
      worked: r1(tot.worked),
      absence: r1(tot.absence),
      computed: r1(computed),
      balance: r1(computed - target),
      shifts: tot.shifts,
      nights: tot.nights,
      holidaysWorked: tot.holidaysWorked,
      sundaysWorked: tot.sundaysWorked,
      byCode: tot.byCode,
      toDate: todayIdx > 0 ? { computed: r1(toDate.worked + toDate.absence), target: r1(targetToDate),
        balance: r1(toDate.worked + toDate.absence - targetToDate) } : null,
      months: months.map(function (x) { return { worked: r1(x.worked), absence: r1(x.absence), shifts: x.shifts, target: r1(x.target) }; }),
      restWarnings: restWarnings
    };
  }

  // Rellena días repitiendo un patrón ("M M T T N N L L L L"). L o - = libre (borra el día).
  function applyPattern(state, patternStr, fromISO, toISO) {
    var from = parseISO(fromISO), to = parseISO(toISO);
    if (!from || !to || to < from) return { ok: false, error: 'Fechas no válidas' };
    var tokens = String(patternStr || '').toUpperCase().split(/[\s,;]+/).filter(Boolean);
    if (!tokens.length) return { ok: false, error: 'Escribe un patrón, por ejemplo: M M T T N N L L L L' };
    if (tokens.length > 60) return { ok: false, error: 'Patrón demasiado largo (máx. 60 días)' };
    var valid = {};
    state.shifts.concat(state.absences).forEach(function (x) { valid[x.code] = true; });
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i] !== 'L' && tokens[i] !== '-' && !valid[tokens[i]]) return { ok: false, error: 'Código desconocido: ' + tokens[i] };
    }
    var count = 0, idx = 0;
    for (var d = from; d <= to && count < 800; d = addDays(d, 1), idx++) {
      var t = tokens[idx % tokens.length], key = iso(d);
      if (t === 'L' || t === '-') delete state.days[key]; else state.days[key] = t;
      count++;
    }
    return { ok: true, days: count };
  }

  // Exporta turnos a iCalendar (RFC 5545), hora local flotante.
  function toICS(state) {
    var shiftBy = {};
    state.shifts.forEach(function (s) { shiftBy[s.code] = s; });
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HorasClaras//ES', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Mis turnos (HorasClaras)'];
    var stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    Object.keys(state.days).sort().forEach(function (key) {
      var sh = shiftBy[state.days[key]];
      if (!sh) return;
      var d = parseISO(key), st = d.getTime() + parseTime(sh.start) * 60000, en = st + shiftHours(sh) * 3600000;
      function fmt(ms) { var x = new Date(ms); return x.getUTCFullYear() + pad(x.getUTCMonth() + 1) + pad(x.getUTCDate()) + 'T' + pad(x.getUTCHours()) + pad(x.getUTCMinutes()) + '00'; }
      lines.push('BEGIN:VEVENT', 'UID:' + key + '-' + sh.code + '@horasclaras', 'DTSTAMP:' + stamp,
        'DTSTART:' + fmt(st), 'DTEND:' + fmt(en), 'SUMMARY:' + sh.name.replace(/[,;\\]/g, ' ') + ' (' + sh.code + ')', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  var api = { DEFAULT_SHIFTS: DEFAULT_SHIFTS, DEFAULT_ABSENCES: DEFAULT_ABSENCES, PRESETS: PRESETS, NATIONAL_HOLIDAYS: NATIONAL_HOLIDAYS,
    defaultState: defaultState, sanitizeState: sanitizeState, compute: compute, applyPattern: applyPattern, toICS: toICS,
    shiftHours: shiftHours, parseISO: parseISO, iso: iso, daysInYear: daysInYear, isHoliday: isHoliday, targetForRange: targetForRange };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.HC = api;
})(this);
