const assert = require('assert');
const HC = require('../core.js');
let pass = 0; const t = (name, fn) => { fn(); pass++; console.log('ok -', name); };

t('shift hours incl. overnight', () => {
  assert.strictEqual(HC.shiftHours({start:'08:00', end:'15:00'}), 7);
  assert.strictEqual(HC.shiftHours({start:'22:00', end:'08:00'}), 10);
  assert.strictEqual(HC.shiftHours({start:'20:00', end:'08:00'}), 12);
  assert.strictEqual(HC.shiftHours({start:'bad', end:'08:00'}), 0);
});
t('empty year => balance = -target', () => {
  const s = HC.defaultState(2026); s.annualTarget = 1400;
  const r = HC.compute(s, '2026-12-31');
  assert.strictEqual(r.target, 1400); assert.strictEqual(r.balance, -1400);
});
t('mid-year change prorates target', () => {
  const s = HC.defaultState(2026); s.annualTarget = 1530; s.change = {enabled:true, date:'2026-07-02', target:1400};
  // 2026-07-02 is day index 182 -> 182 days at 1530, 183 at 1400
  const exp = Math.round(((1530*182 + 1400*183)/365)*10)/10;
  assert.strictEqual(HC.compute(s).target, exp);
});
t('pattern fill + totals + nights + reduction', () => {
  const s = HC.defaultState(2026); s.annualTarget = 1530; s.nightReduction = 1;
  const res = HC.applyPattern(s, 'M T N L L', '2026-01-01', '2026-01-10');
  assert.ok(res.ok); assert.strictEqual(res.days, 10);
  const r = HC.compute(s);
  assert.strictEqual(r.shifts, 6); assert.strictEqual(r.nights, 2);
  assert.strictEqual(r.worked, 2*(7+7+10));
  assert.strictEqual(r.target, 1528);
  assert.strictEqual(r.balance, 48 - 1528);
});
t('rest warning T then M (8h)', () => {
  const s = HC.defaultState(2026);
  s.days['2026-03-02'] = 'T'; s.days['2026-03-03'] = 'M';
  const r = HC.compute(s);
  assert.strictEqual(r.restWarnings.length, 1); assert.strictEqual(r.restWarnings[0].hours, 10);
  s.days['2026-03-03'] = 'N'; // ends 08:00 day 4, then M on day 4 08:00 -> 0h
  s.days['2026-03-04'] = 'M';
  const r2 = HC.compute(s);
  assert.ok(r2.restWarnings.some(w => w.hours === 0));
});
t('absences count only when configured', () => {
  const s = HC.defaultState(2026); s.absenceHours = 7;
  s.days['2026-02-02'] = 'V'; s.days['2026-02-03'] = 'LD'; s.days['2026-02-04'] = 'P';
  const r = HC.compute(s); assert.strictEqual(r.absence, 14);
});
t('holidays and sundays worked', () => {
  const s = HC.defaultState(2026);
  s.days['2026-01-01'] = 'M'; s.days['2026-01-04'] = 'M'; // Thu holiday, Sunday
  s.holidays['2026-01-02'] = true; s.days['2026-01-02'] = 'T';
  const r = HC.compute(s); assert.strictEqual(r.holidaysWorked, 2); assert.strictEqual(r.sundaysWorked, 1);
});
t('to-date balance', () => {
  const s = HC.defaultState(2026); s.annualTarget = 365;
  s.days['2026-01-01'] = 'M'; s.days['2026-12-31'] = 'M';
  const r = HC.compute(s, '2026-01-10');
  assert.strictEqual(r.toDate.target, 10); assert.strictEqual(r.toDate.computed, 7); assert.strictEqual(r.toDate.balance, -3);
});
t('sanitize rejects junk and XSS-ish input', () => {
  const s = HC.sanitizeState({ year: 99999, annualTarget: 'x', shifts: [{code:'<img>', name:'x'},{code:'M2', name:'<b>ok</b>', start:'07:00', end:'14:00', color:'red'}],
    days: {'2026-13-01':'M2', '2026-01-05':'M2', '2026-01-06':'ZZ'}, holidays: {'nope': true} });
  assert.strictEqual(s.year, 2035); assert.strictEqual(s.annualTarget, 1530);
  assert.strictEqual(s.shifts.length, 1); assert.strictEqual(s.shifts[0].color, '#888888');
  assert.deepStrictEqual(s.days, {'2026-01-05':'M2'}); assert.deepStrictEqual(s.holidays, {});
});
t('pattern errors', () => {
  const s = HC.defaultState(2026);
  assert.ok(!HC.applyPattern(s, 'M X', '2026-01-01', '2026-01-05').ok);
  assert.ok(!HC.applyPattern(s, 'M', '2026-01-05', '2026-01-01').ok);
  assert.ok(!HC.applyPattern(s, '', '2026-01-01', '2026-01-05').ok);
});
t('ICS export', () => {
  const s = HC.defaultState(2026); s.days['2026-01-01'] = 'N'; s.days['2026-01-02'] = 'V';
  const ics = HC.toICS(s);
  assert.ok(ics.includes('DTSTART:20260101T220000')); assert.ok(ics.includes('DTEND:20260102T080000'));
  assert.strictEqual((ics.match(/BEGIN:VEVENT/g)||[]).length, 1);
});
t('leap year', () => { assert.strictEqual(HC.daysInYear(2028), 366); assert.strictEqual(HC.daysInYear(2027), 365); });
console.log(pass + ' tests passed');
