// 既存 priceSimulator_typeA.js を「一切改変せず」オラクル（正解器）として読み込む。
// 元ファイルはブラウザ向けで末尾が window.calculatePrice_A = ... のため、
// window シムを与えて関数を取り出す（ファイルへの書き込みは行わない）。
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'priceSimulator_typeA.js'), 'utf8');
// eslint-disable-next-line no-new-func
const oracle = new Function('var window = {};\n' + src + '\nreturn window.calculatePrice_A;')();

module.exports = oracle; // calculatePrice_A(date, hours, checkInTime, checkOutTime, calculateCheckInTime, isSaturdayOrDaysOff, isWeekendOrHoliday)
