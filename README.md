# ホテルジュン 料金シミュレーション

ラブホテル「HOTEL JUN」の複雑な料金体系を計算するシミュレーターです。
ランク（部屋グレード A〜I）と曜日区分（A〜D）を考慮し、料金とプラン内訳を返します。

## ディレクトリ構成

```
料金シミュレーター.html    ★ブラウザで開くだけで動く確認用画面（エンジン内蔵）
priceSimulator_typeA.js   既存のランクA計算ロジック（2164行・参照用。変更しない）
src/simulator.js          ★日付対応の最安シミュレーター simulate(rank, Date, hours)。これが本命
src/dayPattern.js         営業日(5:55境界)→曜日区分A〜D の判定
src/jpHolidays.js         日本の祝日判定（依存なし・ブラウザ可）
src/priceEngineMin.js     最安エンジン中核（単一区分版・分析/実験用）
src/priceEngine.js        方針X: 既存ロジックを料金パラメータ化（検算/参考用）
test/oracle.js            既存ファイルを無改変でオラクルとして読み込む
test/regression.js        priceEngine(X) vs 既存 の回帰テスト
test/demo_simulate.js     simulator の動作デモ（5:55切替の確認込み）
docs/                     仕様書・許可される組み合わせ・差分CSV
時間帯パターン.jpg          曜日区分A〜Dの元資料
```

## 使い方（本命: 最安シミュレーター）

```js
const { simulate } = require('./src/simulator');
const r = simulate('A', new Date(2026, 5, 7, 18, 0), 23); // 2026/6/7(日)18:00, 23時間
// r.price=21600, r.plan='宿泊1部 + 休憩', r.breakdown=[...各明細...]
```

- 実日時を渡すと、祝日・営業日(5:55切替)を自動判定し、**各部屋・各曜日区分で最も安い**組み合わせを返す。
- 日をまたぐ場合、宿泊は入室日区分、5:55以降の延長・休憩は翌日区分で計算（breakdownにモード表示）。

## 設計の要点

- **料金 = ランク(A〜I) × プラン種別**。曜日では変わらない（料金は計算分岐に影響しない）。
- **曜日区分(A〜D) = 使える時間の長さ**だけを変える（サービスの長短／宿泊の12h・10h保証）。
- 方針: **既存 `calculatePrice_A` を完全再現**。制御フローは変えず料金だけ外出ししたので、
  ランクAは既存と100%一致し、料金表の差し替えだけで全ランクに展開できる。

詳細は `docs/料金シミュレーション仕様書.md` を参照。

## 動かし方

```bash
node test/demo_simulate.js   # 最安シミュレーターのデモ（5:55区分切替の確認）
node test/regression.js      # 方針Xエンジン vs 既存 の一致検証（参考）
```

## 引数規約（既存コール規約）

`calculatePriceByRank(rank, date, hours, checkInTime, checkOutTime, calculateCheckInTime, isSaturdayOrDaysOff, isWeekendOrHoliday)`

- `checkInTime` … チェックイン時刻（時。深夜は 0〜2）
- `calculateCheckInTime` … チェックイン時刻（分）= `checkInTime * 60`
- `checkOutTime` … チェックアウト時刻（分・mod24）= `((checkInTime + hours) % 24) * 60`
- `isWeekendOrHoliday` / `isSaturdayOrDaysOff` … 曜日区分フラグ（A〜Dの判定）

## 今後の残作業

1. 「休憩＋休憩」連続の可否などの細則をオーナー確認し、最終調整（差分CSV参照）
2. 祝日判定の実運用前検証（2020/2021の五輪特例は未対応）
3. UI（Web画面）への組み込み
