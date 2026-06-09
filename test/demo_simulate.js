// 日付対応シミュレーターのデモ＆基本検証。
//   実行: node test/demo_simulate.js
// 2026/6/7=日曜, 6/8=月曜(平日), 6/6=土曜
const { simulate } = require('../src/simulator');
const { getDayPattern } = require('../src/dayPattern');

const cases = [
  ['日曜18:00 18h（=翌12:00ちょうど）', 'A', [2026, 6, 7, 18, 0], 18, 13800],
  ['日曜18:00 20h（跨ぎ後は延長）',     'A', [2026, 6, 7, 18, 0], 20, 19400],
  ['日曜18:00 23h（跨ぎ後は平日休憩5h）','A', [2026, 6, 7, 18, 0], 23, 21600],
  ['月曜10:00 5h（平日サービス）',       'A', [2026, 6, 8, 10, 0], 5, 7800],
  ['土曜22:00 14h（10時間保証）',        'A', [2026, 6, 6, 22, 0], 14, 13800],
  ['月曜3:00 2h（=日曜営業日・深夜休憩）','A', [2026, 6, 8, 3, 0], 2, 8800],
];

let pass = 0, fail = 0;
for (const [label, rank, [y, mo, d, hh, mm], hours, expect] of cases) {
  const dt = new Date(y, mo - 1, d, hh, mm);
  const r = simulate(rank, dt, hours);
  const ok = r.price === expect;
  ok ? pass++ : fail++;
  console.log(`${ok ? '○' : '×'} ${label}: ${r.price}円 (期待${expect}) | ${r.plan}`);
  r.breakdown.forEach(b => console.log(`      - ${b.item} ${b.unit}×${b.qty}=${b.subtotal}${b.mode ? ` [${b.mode}モード]` : ''}`));
}
console.log(`\n結果: ${pass}/${pass + fail} 一致`);
if (fail) process.exitCode = 1;
