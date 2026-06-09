// 回帰テスト: 新エンジン calculatePriceByRank('A', ...) が
// 既存 calculatePrice_A と全グリッドで完全一致することを検証する。
//
//   実行:  node test/regression.js
//
// 引数の意味（既存コール規約）:
//   checkInTime = チェックイン時刻(時, 深夜は0〜2)
//   calculateCheckInTime = チェックイン時刻(分) = checkInTime*60
//   checkOutTime = チェックアウト時刻(分, mod24) = ((checkInTime+hours)%24)*60
//   isWeekendOrHoliday / isSaturdayOrDaysOff = 曜日区分フラグ（テストではスタブ）
const oracle = require('./oracle');
const { calculatePriceByRank } = require('../src/priceEngine');

// 曜日区分 → (isSaturdayOrDaysOff, isWeekendOrHoliday) スタブ
function stubs(pattern) {
  switch (pattern) {
    case 'A': return [() => false, () => false]; // 平日
    case 'D': return [() => false, () => true];  // 日・祝（12時間保証）
    case 'C': return [() => true, () => true];   // 土・祝前祝日（10時間保証）
    case 'B': return [() => true, () => false];  // 祝前平日（平日サービス・10時間保証）
    default: throw new Error('unknown pattern ' + pattern);
  }
}

function grid() {
  const checkIns = [0, 0.5, 1, 1.5];
  for (let x = 6; x < 24; x += 0.5) checkIns.push(x);
  const hours = [];
  for (let h = 0.5; h <= 24; h += 0.5) hours.push(h);
  return { checkIns, hours };
}

function run() {
  const { checkIns, hours } = grid();
  const date = new Date(2026, 0, 1);
  let total = 0, match = 0;
  const mismatches = [];

  for (const pattern of ['A', 'D', 'C', 'B']) {
    const [s, w] = stubs(pattern);
    for (const ci of checkIns) {
      for (const h of hours) {
        const out = ((ci + h) % 24) * 60;
        const o = oracle(date, h, ci, out, ci * 60, s, w);
        const e = calculatePriceByRank('A', date, h, ci, out, ci * 60, s, w);
        total++;
        if (o && e && o.price === e.price && o.plan === e.plan) match++;
        else if (mismatches.length < 20) mismatches.push({ pattern, ci, h, oracle: o, engine: e });
      }
    }
  }

  console.log(`総数:${total}  一致:${match}  不一致:${total - match}  一致率:${(100 * match / total).toFixed(2)}%`);
  if (mismatches.length) {
    console.log('--- 不一致サンプル ---');
    for (const m of mismatches) console.log(`${m.pattern} IN${m.ci} ${m.h}h | 既存=${JSON.stringify(m.oracle)} | 新=${JSON.stringify(m.engine)}`);
    process.exitCode = 1;
  } else {
    console.log('✅ 全ケース一致（ランクA）。');
  }
}

run();
