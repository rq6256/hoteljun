//////////////////////////////////////////////////////
// ホテルジュン 料金シミュレーター（日付対応・最安・5:55区分切替）
//
//  simulate(rank, checkInDate, hours) で、実際の日時から最安料金を計算する。
//   - 営業日は毎日5:55切り替え。各営業日にその区分(A〜D)のプランを用意。
//   - よって「日をまたぐ宿泊=入室日区分、5:55以降の延長・休憩=翌日区分」が自然に実現。
//   - 30分スロットの2状態DPで、許可文法に沿う最小コスト被覆（最安）を解く。
//   - 出力に breakdown(明細) を含む。料金は室料のみ（3%奉仕料・人員割増・会員割引は対象外）。
//
//  依存: dayPattern (→ jpHolidays)
//////////////////////////////////////////////////////
'use strict';

const dayPattern = (typeof require !== 'undefined') ? require('./dayPattern') : window.dayPattern;

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

const H = 60, DAY = 24 * H, SLOT = 30;
const BIZ_START = 5 * H + 55;        // 営業日切替 5:55
const REST_END_BASE = (24 + 2) * H;  // 休憩終了 翌2:00（当日基準）

const SERVICE_PARTS = {
  weekday: [[1, 6 * H, 18 * H], [2, 10 * H, 20 * H], [3, 14 * H, 23 * H]],
  holiday: [[1, 6 * H, 16 * H], [2, 10 * H, 19 * H], [3, 14 * H, 22 * H]],
};
const STAY_PARTS = {
  12: [[1, 18 * H, (24 + 12) * H], [2, 22 * H, (24 + 14) * H]],
  10: [[1, 19 * H, (24 + 10) * H], [2, 22 * H, (24 + 12) * H]],
};
const REST_PLAIN_HOURS = { weekday: 5, holiday: 4 };
const STAY_CHECKIN_LATEST = (24 + 6) * H;

// 営業日index i（基準日からの日数）の区分のプランを、abs時間(基準日0:00=0)で生成
function buildDayPlans(p, pat, i) {
  const sh = i * DAY;
  const out = [];
  out.push({ type: 'short', label: 'ショート', winStart: 6 * H + sh, winEnd: (24 + 2) * H + sh, price: p.short, coverFromIn: 90, coverCap: REST_END_BASE + sh, firstOnly: true, code: pat.code });
  out.push({ type: 'midnight_rest', label: '深夜休憩', winStart: 23 * H + sh, winEnd: (24 + 6) * H + sh, price: p.midnight_rest, coverFromIn: 180, firstOnly: true, wholeStayOnly: true, code: pat.code });
  // サービスタイムを先に（同額の引き分け時はサービスタイム名を優先）、その後プレーン休憩
  for (const [n, s, e] of SERVICE_PARTS[pat.service]) out.push({ type: 'service', label: `サービスタイム${n}部`, winStart: s + sh, winEnd: e + sh, price: p.rest, coverTo: e + sh, code: pat.code });
  out.push({ type: 'rest', label: '休憩', winStart: 6 * H + sh, winEnd: (24 + 2) * H + sh, price: p.rest, coverFromIn: REST_PLAIN_HOURS[pat.service] * H, coverCap: REST_END_BASE + sh, code: pat.code });
  for (const [n, s, e] of STAY_PARTS[pat.stayGuarantee]) out.push({ type: 'stay', label: `宿泊${n}部`, winStart: s + sh, winEnd: STAY_CHECKIN_LATEST + sh, price: p.stay, coverTo: e + sh, code: pat.code });
  return out;
}

function addDays(date, n) { const x = new Date(date); x.setDate(x.getDate() + n); return x; }

/**
 * @param {'A'|..|'I'} rank
 * @param {Date} checkInDate 実日時
 * @param {number} hours 利用時間(30分刻み、≤24)
 */
function simulate(rank, checkInDate, hours) {
  const p = RANK_PRICES[rank];
  if (!p) throw new Error('unknown rank: ' + rank);

  const inAbs = checkInDate.getHours() * H + checkInDate.getMinutes(); // 基準日(入室暦日)0:00からの分
  const outAbs = inAbs + hours * H;
  const N = Math.round((outAbs - inAbs) / SLOT);

  // 触れる営業日index範囲（5:55境界）。i = floor((t - 5:55)/DAY)
  const bizIdx = (t) => Math.floor((t - BIZ_START) / DAY);
  const minI = bizIdx(inAbs);
  const maxI = bizIdx(outAbs - 1);

  // 各営業日の区分でプランを生成（暦日 = 入室暦日 + i 日）
  let plans = [];
  for (let i = minI; i <= maxI; i++) {
    const pat = dayPattern.getDayPattern(addDays(checkInDate, i));
    plans = plans.concat(buildDayPlans(p, pat, i));
  }

  // 2状態DP（基本ブロック1枚以上を強制）
  const INF = Infinity;
  const dp0 = new Array(N + 1).fill(INF), dp1 = new Array(N + 1).fill(INF);
  const ch0 = new Array(N + 1).fill(null), ch1 = new Array(N + 1).fill(null);
  dp0[N] = 0; dp1[N] = INF;
  for (let k = N - 1; k >= 0; k--) {
    const t = inAbs + k * SLOT;
    if (dp0[k + 1] + p.ext < dp0[k]) { dp0[k] = dp0[k + 1] + p.ext; ch0[k] = { kind: 'ext', from: k + 1, fs: 0 }; }
    if (dp1[k + 1] + p.ext < dp1[k]) { dp1[k] = dp1[k + 1] + p.ext; ch1[k] = { kind: 'ext', from: k + 1, fs: 1 }; }
    for (const pl of plans) {
      if (pl.firstOnly && k !== 0) continue;
      if (t < pl.winStart || t >= pl.winEnd) continue;
      let coverEnd = pl.coverTo != null ? pl.coverTo : (t + pl.coverFromIn);
      if (pl.coverCap != null) coverEnd = Math.min(coverEnd, pl.coverCap);
      if (coverEnd <= t) continue;
      let j = k; while (j < N && (inAbs + j * SLOT) < coverEnd) j++;
      if (j === k) continue;
      if (pl.wholeStayOnly && j !== N) continue;
      const cost = pl.price + dp0[j];
      if (cost < dp0[k]) { dp0[k] = cost; ch0[k] = { kind: 'plan', pl, from: j, fs: 0 }; }
      if (cost < dp1[k]) { dp1[k] = cost; ch1[k] = { kind: 'plan', pl, from: j, fs: 0 }; }
    }
  }
  if (!isFinite(dp1[0])) return { price: null, plan: '(該当プランなし)', breakdown: [] };

  // 経路復元
  const segs = [];
  let k = 0, state = 1, seenBlock = false;
  while (k < N) {
    const step = state === 1 ? ch1[k] : ch0[k];
    if (step.kind === 'ext') segs.push({ ext: true, pre: !seenBlock });
    else { segs.push({ label: step.pl.label, type: step.pl.type, code: step.pl.code }); seenBlock = true; }
    state = step.fs; k = step.from;
  }

  // ラベル & 明細（連続延長は1本化）
  const labels = [], breakdown = [];
  let m = 0;
  while (m < segs.length) {
    if (segs[m].ext) {
      let units = 0; const pre = segs[m].pre;
      while (m < segs.length && segs[m].ext) { units++; m++; }
      labels.push(`${pre ? '前延長' : '延長'}${units}本`);
      breakdown.push({ item: `${pre ? '前延長' : '延長'}(30分)`, unit: p.ext, qty: units, subtotal: p.ext * units });
    } else {
      const s = segs[m];
      const unit = s.type === 'short' ? p.short : s.type === 'midnight_rest' ? p.midnight_rest : s.type === 'stay' ? p.stay : p.rest;
      labels.push(s.label);
      breakdown.push({ item: s.label, unit, qty: 1, subtotal: unit, mode: s.code });
      m++;
    }
  }
  return { price: dp1[0], plan: labels.join(' + '), breakdown };
}

/**
 * 営業日＋24時間超え表記の時刻で計算する（推奨入力）。
 *  - businessDate: その営業日の暦日（年月日。時刻は無視）
 *  - startClock: 入室時刻(時)。6:00〜29.916(翌5:55) の24時間超え表記。例 24=翌0:00, 26=翌2:00
 *  - hours: 利用時間
 * 例) 日曜営業日 + 24:00 → 月曜0:00(=日曜の夜) として日曜区分(D)で計算。
 */
function simulateByBusinessDay(rank, businessDate, startClock, hours) {
  const base = new Date(businessDate.getFullYear(), businessDate.getMonth(), businessDate.getDate(), 0, 0, 0, 0);
  const actual = new Date(base.getTime() + Math.round(startClock * 60) * 60000);
  return simulate(rank, actual, hours);
}

const api = { simulate, simulateByBusinessDay, RANK_PRICES };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.hoteljunSimulator = api;
