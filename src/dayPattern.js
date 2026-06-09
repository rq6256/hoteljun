//////////////////////////////////////////////////////
// 曜日区分(A〜D)の判定（依存: jpHolidays）
//
//  区分:
//   A 平日       : サービス=平日(長) / 宿泊=12時間保証
//   B 祝前平日   : サービス=平日(長) / 宿泊=10時間保証
//   C 土・祝前祝日: サービス=土日祝(短) / 宿泊=10時間保証
//   D 日・祝     : サービス=土日祝(短) / 宿泊=12時間保証
//
//  判定:
//   service = 平日(月〜金 かつ 非祝日) ? 'weekday' : 'holiday'
//   premium(10h保証) = 土曜 OR 翌日が祝日 OR (当日が祝日 かつ 翌日が休日)
//////////////////////////////////////////////////////
'use strict';

const jp = (typeof require !== 'undefined') ? require('./jpHolidays') : window.jpHolidays;

function addDays(date, n) { const x = new Date(date); x.setDate(x.getDate() + n); return x; }
function isDayOff(date) { const w = date.getDay(); return w === 0 || w === 6 || jp.isHolidayJP(date); }

// その営業日の暦日(date)から区分を返す
function getDayPattern(date) {
  const dow = date.getDay();
  const holiday = jp.isHolidayJP(date);
  const service = (dow >= 1 && dow <= 5 && !holiday) ? 'weekday' : 'holiday';

  const next = addDays(date, 1);
  const premium = (dow === 6) || jp.isHolidayJP(next) || (holiday && isDayOff(next));
  const stayGuarantee = premium ? 10 : 12;

  let code;
  if (service === 'weekday') code = (stayGuarantee === 12) ? 'A' : 'B';
  else code = (stayGuarantee === 10) ? 'C' : 'D';

  return { code, service, stayGuarantee };
}

const api = { getDayPattern };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.dayPattern = api;
