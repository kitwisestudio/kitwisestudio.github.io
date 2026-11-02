/* Ready72 core: turns a household into a 3-day emergency kit list.
   Pure functions only, so it can be tested in Node. */
(function (root) {
  'use strict';

  // Country presets. Water default follows the UK Be Ready checklist (3 L per person per day for drinking).
  var PRESETS = {
    uk: { currency: '£', water: 3, days: 3, cashPerAdult: 30, emergency: '999', radio: 'BBC local radio / Radio 4 (FM or LW)' },
    ie: { currency: '€', water: 3, days: 3, cashPerAdult: 35, emergency: '112 / 999', radio: 'RTÉ Radio 1 (FM or LW 252)' },
    es: { currency: '€', water: 3, days: 3, cashPerAdult: 35, emergency: '112', radio: 'RNE Radio 1 (FM/AM)' },
    fr: { currency: '€', water: 2, days: 3, cashPerAdult: 35, emergency: '112 / 18 / 15', radio: 'France Inter / ici (ex France Bleu) en FM' },
    be: { currency: '€', water: 3, days: 3, cashPerAdult: 35, emergency: '112', radio: 'RTBF La Première / VRT Radio 1 (FM)' },
    lu: { currency: '€', water: 3, days: 3, cashPerAdult: 35, emergency: '112', radio: 'RTL Radio / 100,7 (FM)' },
    eu: { currency: '€', water: 3, days: 3, cashPerAdult: 35, emergency: '112', radio: 'national public radio (FM)' }
  };

  // Rough shop prices per unit (budget supermarket / online, 2026). Shown as estimates only.
  var PRICE = {
    water2l: 0.6, tin: 1.0, crackers: 1.2, nuts: 2.0, cereal: 1.8, spread: 2.5, longlifeMilk: 1.2,
    torch: 6, batteries: 5, radio: 18, powerbank: 20, blanket: 12, firstaid: 12, sanitiser: 2,
    wipes: 1.5, toiletRoll: 0.4, binBags: 1.5, opener: 3, formula1l: 4, nappies10: 3, petTin: 1.2,
    petDry: 4
  };

  function int(v, min) { v = parseInt(v, 10); if (isNaN(v)) v = 0; return Math.max(min || 0, v); }

  function normalise(h) {
    h = h || {};
    var p = PRESETS[h.country] ? h.country : 'uk';
    var out = {
      country: p,
      adults: int(h.adults, 0),
      children: int(h.children, 0),   // 4–17
      toddlers: int(h.toddlers, 0),   // 1–3
      babies: int(h.babies, 0),       // under 1
      dogs: int(h.dogs, 0),
      cats: int(h.cats, 0),
      phones: h.phones === undefined || h.phones === '' ? null : int(h.phones, 0),
      meds: !!h.meds,
      medDevice: !!h.medDevice,
      days: int(h.days || PRESETS[p].days, 1),
      water: Number(h.water) > 0 ? Number(h.water) : PRESETS[p].water
    };
    if (out.adults + out.children + out.toddlers + out.babies === 0) out.adults = 1;
    if (out.days > 14) out.days = 14;
    if (out.phones === null) out.phones = out.adults + out.children;
    return out;
  }

  // Returns { items: [...], totals: {...} }. Every item: id, cat, qty, unit, cost, week, free, note keys.
  function buildKit(input) {
    var h = normalise(input);
    var d = h.days;
    var people = h.adults + h.children + h.toddlers + h.babies;
    var eaters = h.adults + h.children + h.toddlers; // eat solid food
    var items = [];
    function add(id, cat, qty, unit, unitPrice, week, extra) {
      if (qty <= 0) return;
      var it = { id: id, cat: cat, qty: qty, unit: unit, cost: Math.round(qty * unitPrice * 100) / 100, week: week, free: unitPrice === 0 };
      if (extra) for (var k in extra) it[k] = extra[k];
      items.push(it);
    }

    // Water: drinking for people (babies on formula still counted for ready water, at half)
    var drinkLitres = (h.adults + h.children + h.toddlers) * h.water * d + h.babies * 1 * d;
    var petLitres = (h.dogs * 1.5 + h.cats * 0.3) * d;
    var washLitres = people * 2 * d; // "more would be needed for washing and cooking"
    add('water_drink', 'water', Math.ceil(drinkLitres), 'L', PRICE.water2l / 2, 1, { bottles2l: Math.ceil(drinkLitres / 2) });
    add('water_wash', 'water', Math.ceil(washLitres), 'L', PRICE.water2l / 2, 3, { optional: true, bottles2l: Math.ceil(washLitres / 2) });

    // Food: no-cook, long shelf life. Per eater per day: 2 tins (protein + veg/soup/beans), plus a snack portion.
    var eaterDays = eaters * d;
    add('food_tins_protein', 'food', Math.ceil(eaterDays * 1), 'tins', PRICE.tin, 2);
    add('food_tins_veg', 'food', Math.ceil(eaterDays * 1), 'tins', PRICE.tin, 2);
    add('food_crackers', 'food', Math.ceil(eaterDays / 3), 'packs', PRICE.crackers, 2);
    add('food_nuts', 'food', Math.ceil(eaterDays / 3), 'bags', PRICE.nuts, 2);
    add('food_cereal', 'food', Math.ceil(eaterDays / 6), 'boxes', PRICE.cereal, 2);
    add('food_spread', 'food', Math.max(1, Math.ceil(eaterDays / 9)), 'jars', PRICE.spread, 2);
    if (h.children + h.toddlers > 0) add('food_milk', 'food', Math.ceil((h.children + h.toddlers) * d * 0.5), 'L', PRICE.longlifeMilk, 2);
    add('opener', 'food', 1, 'pcs', PRICE.opener, 1);

    // Hygiene
    add('sanitiser', 'hygiene', Math.max(1, Math.ceil(people / 3)), 'bottles', PRICE.sanitiser, 3);
    add('wipes', 'hygiene', Math.max(1, Math.ceil(people * d / 6)), 'packs', PRICE.wipes, 3);
    add('toilet', 'hygiene', Math.max(2, Math.ceil(people * d / 3)), 'rolls', PRICE.toiletRoll, 3);
    add('binbags', 'hygiene', 1, 'rolls', PRICE.binBags, 3);

    // Light and warmth
    add('torch', 'light', Math.max(1, Math.ceil(people / 2)), 'pcs', PRICE.torch, 1, { note: 'safer' });
    add('batteries', 'light', Math.max(1, Math.ceil(people / 2)) + 1, 'packs', PRICE.batteries, 1);
    add('blankets', 'light', people, 'pcs', 0, 1, { note: 'have' });

    // Communication
    add('radio', 'comms', 1, 'pcs', PRICE.radio, 4);
    var mah = Math.max(10000, Math.ceil(h.phones * d * 3000 / 5000) * 5000 + (h.medDevice ? 10000 : 0));
    add('powerbank', 'comms', Math.max(1, Math.ceil(mah / 20000)), 'pcs', PRICE.powerbank, 3, { mah: mah });

    // Money and documents (free actions)
    var cash = Math.ceil((h.adults * PRESETS[h.country].cashPerAdult + h.children * 10) / 10) * 10;
    add('cash', 'money', cash, PRESETS[h.country].currency, 0, 1, { savingNotSpending: true });
    add('docs', 'money', 1, 'set', 0, 1);
    add('numbers', 'money', 1, 'list', 0, 1);

    // Medical
    add('firstaid', 'medical', 1, 'kit', PRICE.firstaid, 4);
    if (h.meds) add('meds', 'medical', 1, 'list', 0, 1, { note: 'repeat' });
    if (h.medDevice) add('meddevice', 'medical', 1, 'plan', 0, 1);

    // Babies
    if (h.babies > 0) {
      add('formula', 'baby', Math.ceil(h.babies * d * 0.9), 'L', PRICE.formula1l, 1, { note: 'readytofeed' });
      add('nappies', 'baby', Math.ceil(h.babies * d * 8 / 10) * 10, 'pcs', PRICE.nappies10 / 10, 1);
    }

    // Pets
    if (h.dogs > 0) add('petfood_dog', 'pets', Math.ceil(h.dogs * d), 'days', PRICE.petTin, 2);
    if (h.cats > 0) add('petfood_cat', 'pets', Math.ceil(h.cats * d), 'days', PRICE.petTin * 0.7, 2);
    if (h.dogs + h.cats > 0) add('petwater', 'pets', Math.ceil(petLitres), 'L', PRICE.water2l / 2, 2);

    // Totals
    var total = 0, essential = 0, weeks = { 1: 0, 2: 0, 3: 0, 4: 0 };
    items.forEach(function (it) {
      total += it.cost;
      if (!it.optional) essential += it.cost;
      weeks[it.week] += it.optional ? 0 : it.cost;
    });
    function r(x) { return Math.round(x); }
    return {
      household: h,
      people: people,
      items: items,
      totals: {
        cost: r(essential), costWithOptional: r(total),
        week1: r(weeks[1]), week2: r(weeks[2]), week3: r(weeks[3]), week4: r(weeks[4]),
        waterLitres: Math.ceil(drinkLitres), currency: PRESETS[h.country].currency
      }
    };
  }

  // Readiness score 0-100 from the ids the user ticked as "have it". Free items count the same.
  function score(kit, have) {
    have = have || {};
    var need = kit.items.filter(function (i) { return !i.optional; });
    if (!need.length) return 0;
    var got = need.filter(function (i) { return have[i.id]; }).length;
    return Math.round(got / need.length * 100);
  }

  // iCalendar text with a check-your-kit reminder every 6 months, starting `start` (Date).
  function ics(start, title, desc) {
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    var d = new Date(start.getTime());
    var day = d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate());
    var stamp = day + 'T090000Z';
    function esc(s) { return String(s).replace(/\\/g, '\\\\').replace(/[,;]/g, function (c) { return '\\' + c; }).replace(/\n/g, '\\n'); }
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KitWise//Ready72//EN', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:ready72-' + day + '@kitwisestudio.github.io',
      'DTSTAMP:' + stamp,
      'DTSTART;VALUE=DATE:' + day,
      'RRULE:FREQ=MONTHLY;INTERVAL=6',
      'SUMMARY:' + esc(title),
      'DESCRIPTION:' + esc(desc),
      'BEGIN:VALARM', 'TRIGGER:-PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(title), 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR', ''
    ].join('\r\n');
  }

  // Household <-> short URL hash, so a plan can be shared without any server.
  var KEYS = ['country', 'adults', 'children', 'toddlers', 'babies', 'dogs', 'cats', 'phones', 'meds', 'medDevice', 'days', 'water'];
  function encode(h) {
    h = normalise(h);
    return KEYS.map(function (k) { var v = h[k]; return typeof v === 'boolean' ? (v ? 1 : 0) : v; }).join('.');
  }
  function decode(s) {
    var parts = String(s || '').replace(/^#?p=/, '').split('.');
    if (parts.length < 7) return null;
    var h = {};
    KEYS.forEach(function (k, i) { if (parts[i] !== undefined) h[k] = parts[i]; });
    h.meds = h.meds === '1'; h.medDevice = h.medDevice === '1';
    return normalise(h);
  }

  var api = { PRESETS: PRESETS, normalise: normalise, buildKit: buildKit, score: score, ics: ics, encode: encode, decode: decode };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Ready72 = api;
})(this);
