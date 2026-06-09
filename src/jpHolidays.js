//////////////////////////////////////////////////////
// 日本の祝日判定（依存なし・ブラウザ/Node両対応）
//
//  - 固定祝日 / ハッピーマンデー / 春分・秋分（近似式・1980〜2099有効）
//  - 振替休日（祝日が日曜→翌平日）/ 国民の休日（祝日に挟まれた平日）
//
//  ※ 実運用前に主要年の祝日を必ず突き合わせて検証すること。
//    （海の日・スポーツ・山の日は2020/2021の五輪特例は未対応）
//////////////////////////////////////////////////////
'use strict';

function ymd(date) { return { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate(), dow: date.getDay() }; }
function nthMonday(year, month, nth) {
  const first = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const offset = (1 - first + 7) % 7; // 最初の月曜
  return 1 + offset + (nth - 1) * 7;
}
function shunbun(y) { return Math.floor(20.8431 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4)); }
function shubun(y) { return Math.floor(23.2488 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4)); }

// 基本祝日（振替・国民の休日を含まない）
function primaryHolidayName(date) {
  const { y, m, d } = ymd(date);
  if (m === 1 && d === 1) return '元日';
  if (m === 1 && d === nthMonday(y, 1, 2)) return '成人の日';
  if (m === 2 && d === 11) return '建国記念の日';
  if (m === 2 && d === 23 && y >= 2020) return '天皇誕生日';
  if (m === 3 && d === shunbun(y)) return '春分の日';
  if (m === 4 && d === 29) return '昭和の日';
  if (m === 5 && d === 3) return '憲法記念日';
  if (m === 5 && d === 4) return 'みどりの日';
  if (m === 5 && d === 5) return 'こどもの日';
  if (m === 7 && d === nthMonday(y, 7, 3) && y >= 2003) return '海の日';
  if (m === 8 && d === 11 && y >= 2016) return '山の日';
  if (m === 9 && d === nthMonday(y, 9, 3)) return '敬老の日';
  if (m === 9 && d === shubun(y)) return '秋分の日';
  if (m === 10 && d === nthMonday(y, 10, 2)) return 'スポーツの日';
  if (m === 11 && d === 3) return '文化の日';
  if (m === 11 && d === 23) return '勤労感謝の日';
  return null;
}

function addDays(date, n) { const x = new Date(date); x.setDate(x.getDate() + n); return x; }
function isPrimary(date) { return primaryHolidayName(date) !== null; }

// 振替休日: 当日が祝日でなく、遡って連続する祝日の起点が日曜なら振替
function isSubstitute(date) {
  if (isPrimary(date)) return false;
  let p = addDays(date, -1);
  while (isPrimary(p)) {
    if (p.getDay() === 0) return true; // 起点が日曜
    p = addDays(p, -1);
  }
  return false;
}

// 国民の休日: 前後が共に祝日（基本祝日）で、当日が祝日でない日
function isCitizensHoliday(date) {
  if (isPrimary(date)) return false;
  return isPrimary(addDays(date, -1)) && isPrimary(addDays(date, 1));
}

function isHolidayJP(date) {
  return isPrimary(date) || isSubstitute(date) || isCitizensHoliday(date);
}

function holidayName(date) {
  const n = primaryHolidayName(date);
  if (n) return n;
  if (isSubstitute(date)) return '振替休日';
  if (isCitizensHoliday(date)) return '国民の休日';
  return null;
}

const api = { isHolidayJP, holidayName };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.jpHolidays = api;
