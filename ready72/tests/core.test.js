const R = require('../core.js'); const assert = require('assert');
let k = R.buildKit({country:'uk', adults:2, children:2});
const w = k.items.find(i=>i.id==='water_drink'); assert.strictEqual(w.qty, 36); // official example: family of 4 = 36 L
assert.ok(!k.items.find(i=>i.id==='formula'));
k = R.buildKit({adults:1, babies:1, dogs:1});
assert.ok(k.items.find(i=>i.id==='formula')); assert.ok(k.items.find(i=>i.id==='petfood_dog'));
assert.strictEqual(R.buildKit({}).household.adults, 1);
const h = {country:'es', adults:3, children:1, toddlers:0, babies:1, dogs:0, cats:2, phones:4, meds:true, medDevice:false, days:3, water:3};
assert.deepStrictEqual(R.decode(R.encode(h)), R.normalise(h));
assert.strictEqual(R.score(k, {}), 0);
const all = {}; k.items.forEach(i=>all[i.id]=1); assert.strictEqual(R.score(k, all), 100);
const ics = R.ics(new Date(Date.UTC(2026,9,29)), 'Check kit, now', 'x'); assert.ok(ics.includes('RRULE:FREQ=MONTHLY;INTERVAL=6')); assert.ok(ics.includes('Check kit\\, now'));
console.log('ok', JSON.stringify(R.buildKit({adults:2,children:2}).totals));
