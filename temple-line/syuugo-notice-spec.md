# しゅうごうLINE 特設ページ 仕様書 ／ Claude Code 引き継ぎドキュメント

クライアント向けお知らせLP `syuugo-notice.html` の最新仕様と、引き継いで改修・量産するための手順書。
このファイルをリポジトリ直下に **`CLAUDE.md`** としてコピーすると、Claude Code が自動で文脈に読み込みます。

---

## 0. Claude Code 引き継ぎサマリ（最初に読む）

- **成果物**：`syuugo-notice.html` 単一ファイルのみ。CSS・JS・画像（Base64）すべて内包。ビルド工程なし・依存パッケージなし。
- **動かし方**：ブラウザでファイルを開くだけ。サーバー設置やLINEリンク共有でもそのまま動く。
- **技術**：素のHTML + CSS + バニラJS（フレームワーク・npm不使用）。Webフォント(Noto Sans JP)とLIFF SDKのみ外部参照。
- **編集方針**：このHTML1枚を直接編集する。新規ファイルやビルド導入はしない。
- **絶対に壊してはいけない不変条件（GOLDEN RULES）**：
  1. 中央寄せは `.slide` ではなく **`.inner`** に `min-height:100%` + `justify-content:center` で行う（`.slide`に付けるとスクロール時に上端が見切れる）。
  2. 顔写真Base64は **ファイル内に1回だけ**。`.avatar, .avatar-sm` でまとめて指定済み。複製しない。
  3. 進捗ドット・reveal・「次へ」出現制御はすべて `slides.length` 基準で自動化。スライド数を直書きした箇所は作らない。
  4. `transform` を使う要素（`.key` の傾き）は reveal の `translateY` と併用するため、`.key.reveal` / `.key.reveal.in` で `rotate(-1deg)` を明示している。崩さない。
- **代表的な改修は §9 の手順に従う。**

---

## 1. 目的・全体方針

- 用途：寺院クライアントへ「大切なお知らせ（3点）」を順番に読ませ、最後に「確認しました」で完了させる縦型カルーセル。
- 方針：シンプル／大きめ文字／ゴシック体（Noto Sans JP）。ホワイトグレー背景＋朱色アクセント＋LINEグリーン（操作系）。
- 表示前提：スマホ縦が主。最大幅560pxで中央寄せ（PC可）。

---

## 2. ファイル構成・プレビュー

```
syuugo-notice.html        # 本体（唯一の成果物）
syuugo-notice-spec.md     # 本書（= CLAUDE.md として配置可）
```

- プレビュー：`open syuugo-notice.html`（mac）／ブラウザにドラッグ。
- 静的ホスティング：Cloudflare Pages / GitHub Pages 等にそのまま置ける。

---

## 3. アーキテクチャ（DOM構造）

```
.stage（max-width560 / height100dvh / flex column）
├─ .progress              … 進捗ドット（JSで枚数分生成・上部固定）
├─ .track（flex:1 / overflow:hidden）
│   └─ .slide × 5（position:absolute / inset:0 / overflow-y:auto）
│        └─ .inner（min-height:100% / padding:24px 26px 32px / flex column / justify-content:center）
├─ .foot                  … フッター（下部固定）
│   ├─ .next-label#nextLabel … 「＼3点、確認をお願いします／」※1ページ目のみ
│   └─ .btn-row（flex）       … [もどる(控えめ)] [次へ(緑・伸縮)]
└─ .done#done             … 確認後の完了オーバーレイ
```

スライド5枚：①イントロ ②大切なお知らせ① ③大切なお知らせ② ④大切なお知らせ③ ⑤最後に。

---

## 4. デザイントークン

### カラー（`:root`）

| 変数 | 値 | 用途 |
|---|---|---|
| `--ink` | `#2a2724` | 本文・濃い枠線・Aバッジ地 |
| `--sub` | `#6b6560` | 補足(muted)・矢印・もどる文字 |
| `--paper` | `#f4f5f6` | 背景（ホワイトグレー） |
| `--card` | `#ffffff` | カード地 |
| `--shu` | `#c0392b` | 朱色アクセント（バッジ/タブ/ラベル/進捗/署名） |
| `--shu-deep` | `#9c2b20` | 朱色強調文字（`.em`） |
| `--line` | `#e7e0d4` | 区切り線・枠 |
| `--green` | `#06c755` | LINEグリーン（ボタン/✓） |

その他リテラル色：マーカー黄 `#ffec99`／Q&AのA行地 `#fffbe0`／付箋地 `#fffdf5`。

### タイポグラフィ

- `font-family: "Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif`（400/500/700/900）
- 基本 `line-height:1.9`。主要サイズ：h1=30/h2=25/p=19/lead=21/muted=17/署名=16/コピー=12（px、太さは§6参照）

---

## 5. アニメーション・インタラクション

### 5.1 reveal（スクロール連動のふわっと表示）
- 対象：各 `.inner` 直下要素。`<ul>` は `<li>` を個別対象に。
- 初期 `.reveal{opacity:0; transform:translateY(20px)}` → 表示 `.reveal.in{opacity:1; transform:translateY(0); transition:opacity .6s ease, transform .65s cubic-bezier(.2,.75,.3,1)}`
- 付箋の傾き維持：`.key.reveal{transform:translateY(20px) rotate(-1deg)}` / `.key.reveal.in{transform:translateY(0) rotate(-1deg)}`
- 実装：`IntersectionObserver`（`root`=該当slide / `threshold:0.12` / `rootMargin:'0px 0px -6% 0px'`）。同時表示分は index×0.08s でカスケード。表示後 `unobserve`。`render()` ごとにリセット再生。

### 5.2 「次へ」の出現（最後までスクロールで表示）
- `updateNextVisibility()`：`収まる(scrollHeight<=clientHeight+4)` か `最下部(scrollTop+clientHeight>=scrollHeight-24)` で表示。
- 真のとき `#nextBtn` に `.show`（opacityフェード）。`.next-label` は **`show && idx===0`** で1ページ目のみ。
- 発火：slideの`scroll`、`window`の`resize`、`render()`内（rAF）。`render()`で `scrollTop=0`。

### 5.3 遷移・操作
- スライド遷移：`opacity .4s / transform .4s`。`.active`(0,X0) / 非表示(0→opacity0,X40) / `.exit-left`(X-40)。
- 次へ：`idx<最終`→`idx++`→`render()`／最終→`confirmDone()`。もどる：`idx--`→`render()`（`idx>0`時のみ表示）。
- スワイプ：`.track` のtouch横移動 ±50px超で前後移動。

---

## 6. コンポーネント仕様（最新）

- **進捗ドット** `.progress .dot`：9px円、非activeは`--line`、activeは`--shu`+`scale(1.25)`。
- **バッジ** `.badge`：「🔴 大切なお知らせ ①」等。`--shu`地+白、19px/900、radius10、padding 8/16。
- **付箋タブ** `.key`：地`#fffdf5`、radius4、padding 30/22/22、margin42、影、`rotate(-1deg)`。`::before`がタブ「重要」(`--shu`+白,15px/900, top-15 left20, radius 9 9 0 0)。強調は`.em`(`--shu-deep`)。
- **マーカー** `.marker`：`linear-gradient(transparent 58%, #ffec99 58%)`+900。文字色はそのまま。
- **吹き出し** `.bubble`：白地・`border:2px var(--ink)`・radius18・padding **56**/26/22（上はアイコン用）・中央・影。しっぽ`::after`=20px正方形を45°回転（`border-right/bottom:2px`）`bottom:-11px`中央。
  - **アイコンあり**：`.bubble`先頭に `<span class="avatar">`。丸80px、`border:3px #fff`、`top:-44px`中央、`background-position:center 30%`。
  - **アイコンなし**：`<div class="bubble no-avatar">`。`.bubble.no-avatar{padding-top:24px; margin-top:28px}` で上余白を詰める。
- **小アイコン** `.avatar-sm`：丸34px、`border:2px`、`display:inline-block`、`margin-right:9px`。署名の左に。`.avatar`と画像共有（Base64は1回だけ）。
- **チェックリスト** `.checks li`：白カード・`border:1px var(--line)`・radius10・padding 14/14/14/44・18px/500。`::before`に✓(`--green`,20px)。`<b>`で部分強調。
- **Q&A** `.qa`：行`.qa-row`(flex/gap14/padding16-18/radius14/左寄せ)。`.qa-q`=白+`border:1px var(--line)`／`.qa-a`=`#fffbe0`+margin-top10。バッジ40px円21px/900 `Georgia,serif`：`.q`=白+`2.5px var(--ink)`枠／`.a`=`--ink`地+白。間に矢印`.qa-arrow`「↓」(中央/26px/`--sub`)。本文`.qa-row p`=18px/700/lh1.75/padding-top5。
- **ラベル** `.label`：中央・21px/900・`--shu`・letter-spacing.08・margin24/0/14（例「＼ 打合せの内容例 ／」）。
- **箇条書き** `.bullets li`：padding 10/0/10/26・18px/500・下破線`--line`。`::before`に8px`--shu`ドット。
- **フッター** `.foot`：padding 16/26/28。
  - `.next-label`（1ページ目のみ）：中央16px/900`--ink`、`opacity`フェード、`.big3`=26pxで「3」拡大。
  - `.btn-row`：`display:flex; align-items:center; gap:10px`。
  - `.btn-back`（もどる・控えめ）：`border:none; background:transparent; color:var(--sub); font-size:14px; opacity:.65; flex:0 0 auto`。外枠なし・テキストのみ。
  - `#nextBtn`（次へ/確認しました）：`flex:1`、`.btn`基底(radius14/padding20/21px/900)、`--green`+白。既定`opacity:0`→`.show`で表示。最終画面は`.btn-confirm`へ差し替え。
- **完了** `.done`：背景`rgba(244,245,246,.97)`、96px緑円+✓52px(`pop`)、見出し「ご確認ありがとうございました」+補足。
- **コピーライト** `.copy`：12px/500/`--sub`/margin-top28。最終画面の署名下に1行。

---

## 7. 画面別コンテンツ（最新文言）

1. **イントロ**：署名（小アイコン＋「お寺特化LINEチーム統括・内藤」）／h1「いつもご対応くださり、ありがとうございます。」／lead 共有予告。
2. **大切なお知らせ①**：バッジ／「改めてのアナウンスです。」／付箋key（「**お寺専属サポートチーム**の対応窓口を…“このLINEグループに正式移行”＝マーカー」）／吹き出し**（アイコンあり）**「さらにきめ細やかな…」／チェック3点（担当メンバー在籍／関係者ご招待OK／配信リマインド等）／Q&A（Q:しゅうごう公式LINEはどうなるのですか？ → A:寺子屋しゅうごう（勉強会）・各種イベント・大切なご案内をお届けします）／muted 移行期間の注意。
3. **大切なお知らせ②**：バッジ／h2「お寺特化LINE「しゅうごうのLINE」、絶賛 大きめ開発中です」／吹き出し**（アイコンなし）**「全国100箇所以上の事例…」／付箋key（“6月末〜7月初旬”＝マーカー＋発表会）／本文（前半太字：しゅうごうLINE利用寺院さま限定…／後半：活用アイデアを仕入れたり自坊LINEのブラッシュアップに…）。
4. **大切なお知らせ③**：バッジ／h2「定期レビューを兼ねた お打合せを是非お願いしております」／吹き出し**（アイコンなし）**（“できるだけ1〜3ヶ月に一度”＝マーカー）／ラベル「＼ 打合せの内容例 ／」／箇条書き7点（受付導線つくり／寺報でのご案内、郵送費削減への実行策／お友だち登録／チラシデザイン提供／活用アイデア共有／機能・リッチメニュー改修／配信スケジュール）。
5. **最後に**：h1 締め／lead 結び／署名（小アイコン＋「寺子屋しゅうごう／お寺特化LINEチーム」）／コピーライト「©syuu-go.com お寺特化LINE「しゅうごうLINE」サポート」。ボタンは「確認しました」。

---

## 8. LINEグループ送信（任意・LIFF）

- `<script>` 内 `LIFF_ID` に実IDを入れると「確認しました」で `liff.sendMessages()` がグループへ投稿（押した本人名義）。空なら送信せず完了表示のみ。
- 前提：LIFFアプリ作成＋scope `chat_message.write`、エンドポイントに本URL登録、グループ内でLIFFリンクを開く。
- Bot名義で「ご確認ありがとうございました」を出すなら、ボタン→GAS/Cloudflare Workers→Messaging APIのpushに切替（別途グループID取得・Bot参加が必要）。

---

## 9. よくある改修の手順（Claude Code向け・actionable）

- **文言変更**：本文を直接編集。検索キーで該当行を特定して置換。
- **画面を増減**：`<section class="slide">…</section>` を追加/削除するだけ。ドット・reveal・次へ制御は自動追従。
- **アイコン画像の差し替え**：正方形にクロップ→Base64化し、`.avatar, .avatar-sm` の `background-image:url(data:image/jpeg;base64,...)` を置換。顔位置は `background-position` で微調整。**Base64は1箇所のみ**なのでそこだけ直す。
- **吹き出しのアイコン有無**：付けたい→`<div class="bubble"><span class="avatar" aria-hidden="true"></span>…`／外したい→`<div class="bubble no-avatar">…`（spanを削除しclass追加）。
- **マーカーを引く**：対象語句を `<span class="marker">…</span>` で囲む。
- **配色変更**：`:root` の変数のみ変更で全体反映。
- **「次へ」を常時表示に戻す**：`updateNextVisibility()` を常に `show=true` にするか `#nextBtn{opacity:1;pointer-events:auto}` 固定。
- **確認ラベルの表示範囲**：`nextLabel.classList.toggle('show', show && idx===0)` の `idx===0` を調整。

---

## 10. 注意点（gotchas）

- 中央寄せは `.inner` 側で行う（§0 GOLDEN RULE 1）。`.slide` に付けない。
- `.key` は `transform` を使うため reveal と二重指定（§5.1）。新たに `transform` する要素を reveal対象にする場合は同様の併記が必要。
- 顔写真Base64の重複禁止（§0 RULE 2）。容量肥大の原因になる。
- 反映されない時はブラウザキャッシュをクリアして再読込。

---

## 11. 変更履歴（このバージョンで反映済み）

- サポートチーム → **お寺専属サポートチーム**
- Q&AのA回答を「寺子屋しゅうごう（勉強会）・各種イベント・大切なご案内をお届けします」に
- 確認ラベル「＼3点、確認をお願いします／」を **1ページ目のみ表示**
- ラベル「＼打合せでは／」→「**＼ 打合せの内容例 ／**」、箇条書き7点に更新（郵送費削減→**郵送費削減への実行策**）
- もどるを次へと**横並び・控えめ・外枠なし**に
- 3ページ目以降（お知らせ②③）の吹き出し**アイコン削除**（`.bubble.no-avatar`）
- 最終画面に**コピーライト**追加、署名横に**小アイコン**追加
