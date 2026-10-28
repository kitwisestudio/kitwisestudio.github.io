/* Analítica sin datos personales. Umami solo se carga si hay umamiId en config.js. */
(function () {
  'use strict';
  var cfg = window.HC_CONFIG || {};
  var queue = [];
  function ready() { return window.umami && typeof window.umami.track === 'function'; }
  function flush() { while (queue.length && ready()) { var e = queue.shift(); try { window.umami.track(e[0], e[1]); } catch (x) {} } }
  if (cfg.umamiId && !/^(localhost|127\.)/.test(location.hostname)) {
    var s = document.createElement('script');
    s.defer = true; s.src = cfg.umamiSrc; s.setAttribute('data-website-id', cfg.umamiId);
    s.onload = function () { setTimeout(flush, 300); };
    document.head.appendChild(s);
  }
  // Solo letras, números y guiones en los valores: nunca emails ni texto libre.
  function clean(data) {
    if (!data) return undefined;
    var out = {};
    Object.keys(data).slice(0, 8).forEach(function (k) {
      var v = data[k];
      out[k] = typeof v === 'number' ? v : String(v).replace(/[^\w\-.]/g, '').slice(0, 40);
    });
    return out;
  }
  window.hcTrack = function (name, data) {
    var d = clean(data);
    try { var c = JSON.parse(localStorage.getItem('hc_ev') || '{}'); c[name] = (c[name] || 0) + 1; localStorage.setItem('hc_ev', JSON.stringify(c)); } catch (x) {}
    if (ready()) { try { window.umami.track(name, d); } catch (x) {} } else { queue.push([name, d]); setTimeout(flush, 1500); }
    if (window.HC_DEBUG) console.log('[track]', name, d || '');
  };
})();
