//////////////////////////////////////////////////////
// ホテルジュン 最安エンジン（方針Y）
//
//  docs/許可される組み合わせ.md の文法に沿って成立する全構成を列挙し、
//  対象ランクの料金で合計が最小になる構成を返す（真の最安）。
//
//  文法: 予約 = [前延長] ( 基本ブロック [延長] )+
//   基本ブロック: ショート / 深夜休憩 / 休憩(プレーン) / サービスタイム1-3部 / 宿泊1-2部
//
//  実装: チェックイン〜チェックアウトを30分スロットに分割し、
//   2状態DP（基本ブロック1枚以上を強制）で最小コスト被覆を解く。
//////////////////////////////////////////////////////
'use strict';

const RANK_PRICES = {
  A: { short: 6000, rest: 7800, midnight_rest: 8800, stay: 13800, ext: 1400 },
  B: { short: 5800, rest: 7200, midnight_rest: 8200, stay: 12800, ext: 1300 },
  C: { short: 5800, rest: 6980, midnight_rest: 7980, stay: 12800, ext: 1300 },
  D: { short: 5700, rest: 6980, midnight_rest: 7980, stay: 11800, ext: 1300 },
  E: { short: 5600, rest: 6980, midnight_rest: 7980, stay: 12800, ext: 1300 },
  F: { short: 5600, rest: 6700, midnight_rest: 7800, stay: 11200, ext: 1100 },
  G: { short: 4980, rest: 5980, midnight_rest: 6980, stay: 10800, ext: 1100 },
  H: { short: 4980, rest: 5980, midnight_rest: 6980, stay: 9980,  ext: 1100 },
  I: { short: 4980, rest: 5680, midnight_rest: 6800, stay: 8980,  ext: 1000 },
};

const H = 60;
const SLOT = 30;
const REST_END = (24 + 2) * H; // 休憩終了 午前2:00

const DAY_PATTERNS = {
  A: { service: 'weekday', stayGuarantee: 12 },
  B: { service: 'weekday', stayGuarantee: 10 },
  C: { service: 'holiday', stayGuarantee: 10 },
  D: { service: 'holiday', stayGuarantee: 12 },
};

const SERVICE_PARTS = {
  weekday: [
    { part: 1, start: 6 * H, end: 18 * H },
    { part: 2, start: 10 * H, end: 20 * H },
    { part: 3, start: 14 * H, end: 23 * H },
  ],
  holiday: [
    { part: 1, start: 6 * H, end: 16 * H },
    { part: 2, start: 10 * H, end: 19 * H },
    { part: 3, start: 14 * H, end: 22 * H },
  ],
};

const STAY_PARTS = {
  12: [
    { part: 1, start: 18 * H, end: (24 + 12) * H },
    { part: 2, start: 22 * H, end: (24 + 14) * H },
  ],
  10: [
    { part: 1, start: 19 * H, end: (24 + 10) * H },
    { part: 2, start: 22 * H, end: (24 + 12) * H },
  ],
};

const REST_PLAIN_HOURS = { weekday: 5, holiday: 4 };
const STAY_CHECKIN_LATEST = (24 + 6) * H; // AM6:00までの入室
const DAILY_SHIFTS = [0, 24 * H, 48 * H]; // 日次プランは翌日以降にも複製（24h滞在が跨ぐため）

// type: 'short'|'midnight_rest'|'rest'|'service'|'stay'
// firstOnly: 予約の先頭ブロックとしてのみ使用可（前延長で前に詰めない）
function buildPlans(p, pattern) {
  const dp = DAY_PATTERNS[pattern];
  const plans = [];
  for (const sh of DAILY_SHIFTS) {
    // ショート: 翌2:00まで（coverCap）、先頭ブロックのみ
    plans.push({ type: 'short', label: 'ショート', winStart: 6 * H + sh, winEnd: (24 + 2) * H + sh, price: p.short, coverFromIn: 90, coverCap: REST_END + sh, firstOnly: true });
    // 深夜休憩: 最大3h、先頭かつ滞在全体を覆う時のみ
    plans.push({ type: 'midnight_rest', label: '深夜休憩', winStart: 23 * H + sh, winEnd: (24 + 6) * H + sh, price: p.midnight_rest, coverFromIn: 180, firstOnly: true, wholeStayOnly: true });
    // プレーン休憩: 平日5h/土日祝4h、翌2:00打ち切り
    for (const sp of SERVICE_PARTS[dp.service]) {
      plans.push({ type: 'service', label: `休憩(サービスタイム${sp.part}部)`, winStart: sp.start + sh, winEnd: sp.end + sh, price: p.rest, coverTo: sp.end + sh });
    }
    plans.push({ type: 'rest', label: '休憩(M時間)', winStart: 6 * H + sh, winEnd: (24 + 2) * H + sh, price: p.rest, coverFromIn: REST_PLAIN_HOURS[dp.service] * H, coverCap: REST_END + sh });
    for (const st of STAY_PARTS[dp.stayGuarantee]) {
      plans.push({ type: 'stay', label: `宿泊${st.part}部`, winStart: st.start + sh, winEnd: STAY_CHECKIN_LATEST + sh, price: p.stay, coverTo: st.end + sh });
    }
  }
  return plans;
}

function calc(rank, checkInClock, hours, pattern) {
  const p = RANK_PRICES[rank];
  const plans = buildPlans(p, pattern);
  const inAbs = (checkInClock < 6 ? checkInClock + 24 : checkInClock) * H;
  const outAbs = inAbs + hours * H;
  const N = Math.round((outAbs - inAbs) / SLOT);
  const INF = Infinity;

  // dp0: プラン任意 / dp1: この区間で必ず1枚以上ブロックを使う
  const dp0 = new Array(N + 1).fill(INF);
  const dp1 = new Array(N + 1).fill(INF);
  const ch0 = new Array(N + 1).fill(null);
  const ch1 = new Array(N + 1).fill(null);
  dp0[N] = 0; dp1[N] = INF;

  for (let i = N - 1; i >= 0; i--) {
    const t = inAbs + i * SLOT;
    if (dp0[i + 1] + p.ext < dp0[i]) { dp0[i] = dp0[i + 1] + p.ext; ch0[i] = { kind: 'ext', from: i + 1, fs: 0 }; }
    if (dp1[i + 1] + p.ext < dp1[i]) { dp1[i] = dp1[i + 1] + p.ext; ch1[i] = { kind: 'ext', from: i + 1, fs: 1 }; }
    for (const pl of plans) {
      if (pl.firstOnly && i !== 0) continue; // 先頭ブロック限定（前延長で前に詰めない）
      if (t < pl.winStart || t >= pl.winEnd) continue;
      let coverEnd = pl.coverTo != null ? pl.coverTo : (t + pl.coverFromIn);
      if (pl.coverCap != null) coverEnd = Math.min(coverEnd, pl.coverCap);
      if (coverEnd <= t) continue;
      let j = i;
      while (j < N && (inAbs + j * SLOT) < coverEnd) j++;
      if (j === i) continue;
      if (pl.wholeStayOnly && j !== N) continue;
      const cost = pl.price + dp0[j];
      if (cost < dp0[i]) { dp0[i] = cost; ch0[i] = { kind: 'plan', pl, from: j, fs: 0 }; }
      if (cost < dp1[i]) { dp1[i] = cost; ch1[i] = { kind: 'plan', pl, from: j, fs: 0 }; }
    }
  }

  if (!isFinite(dp1[0])) return { price: null, plan: '(該当なし)', canon: '', segments: [] };

  // 経路復元
  const segments = [];
  let i = 0, state = 1, seenBlock = false;
  while (i < N) {
    const step = state === 1 ? ch1[i] : ch0[i];
    if (step.kind === 'ext') segments.push({ type: 'ext', pre: !seenBlock });
    else { segments.push({ type: pl_type(step.pl), label: step.pl.label }); seenBlock = true; }
    state = step.fs; i = step.from;
  }

  // ラベル & 正規トークン化（連続延長は1本化、件数はNで表現）
  const labelParts = []; const tokens = [];
  let k = 0;
  while (k < segments.length) {
    const s = segments[k];
    if (s.type === 'ext') {
      let units = 0; const pre = s.pre;
      while (k < segments.length && segments[k].type === 'ext') { units++; k++; }
      labelParts.push(`${pre ? '前延長' : '延長'}${units}本`);
      tokens.push(pre ? 'PE' : 'E');
    } else {
      labelParts.push(s.label);
      tokens.push(canonToken(s.type));
      k++;
    }
  }
  return { price: dp1[0], plan: labelParts.join(' + '), canon: tokens.join('+'), segments };
}

function pl_type(pl) { return pl.type; }
function canonToken(type) {
  return { short: 'SH', midnight_rest: 'MR', rest: 'R', service: 'S', stay: 'O' }[type];
}

module.exports = { calc, RANK_PRICES, DAY_PATTERNS };
