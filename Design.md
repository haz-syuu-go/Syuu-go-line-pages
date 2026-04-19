# イベント一覧ページ Design.md

LINEリッチメニューから遷移するお寺のイベント一覧ページの設計ガイドです。
Claude Design で他のお寺の同形式ページを再現するときに参照してください。

参考実装：[`myokyo-in/index.html`](myokyo-in/index.html)

---

## 目的とゴール

- LINEのWebViewで開かれる、**お寺の月例イベント一覧＋詳細＋アクセス** の1ページ完結サイト
- **高齢の方にも読みやすい** ことを最重要に設計（フォント大きめ・行間広め・色は強すぎない）
- **絵文字は使わずインラインSVGアイコンで**（LINE内・OS差による崩れ防止）
- 単一HTMLファイル＋`images/` フォルダのみで完結（サーバー不要・GitHub Pagesで公開）

---

## ファイル構成

```
{お寺スラッグ}/               ← 例: myokyo-in, shoraku-ji
├── index.html               ← 1ファイルで全機能完結（CSS・JS・SVG全部インライン）
└── images/
    ├── README.txt          ← 命名ルールの説明
    ├── (スライダー・カード画像)
```

お寺ごとにサブフォルダを切る。リポジトリルートには置かない。

---

## ページ全体の構造

```
wrap
├── site-header               … お寺名（大）+ サブタイトル
├── slider                    … 画像スライダー（横にゆっくり流れる）
├── lead (p)                  … 案内リード文
├── welcome-lead (p)          … 初心者マーク＋「はじめての方も大歓迎！」
├── event-list                … カード型イベント一覧（4件前後）
│   └── .card × N
├── .detail × N               … 各イベントの詳細セクション（JSで切替表示）
│   ├── back-btn（上）
│   ├── detail-head
│   ├── detail-photo
│   ├── detail-body
│   ├── info                  … 開催日/時間/会場/会費 ＋LINE予約ボタン
│   └── back-btn（下）
└── access                    … お寺へのアクセス（Googleマップ・住所・ボタン）
```

一覧ビューと詳細ビューは `body.view-list` / `body.view-detail` クラスで切り替え。
詳細表示時は slider, lead, welcome-lead, event-list, access は非表示。

---

## カラーパレット（五色）

浄土宗の五色幕に由来する5色をアクセントに使用。

| 色 | 値 | 薄色背景 | 用途 |
|---|---|---|---|
| 紫 | `#6B4BA8` | `#efeaf7` | 寺カフェ／サイト基調色／アクセスボタン |
| 赤 | `#D64C3B` | `#fceeec` | 坊主café |
| 黄 | `#D9A514` | `#fbf3d9` | テラ・フライデー（視認性のため濃いめの黄） |
| 緑 | `#4B8B3B` | `#eaf3e7` | サラナ親子サロン |
| 白 | `#FFFFFF` | - | ページ背景 |

**CSS変数で定義**：

```css
:root {
  --bg: #ffffff;
  --text: #1a1d22;
  --text-sub: #3f464d;
  --line: #dfe3e8;

  --c-purple: #6B4BA8;  --c-purple-bg: #efeaf7;
  --c-red:    #D64C3B;  --c-red-bg:    #fceeec;
  --c-yellow: #D9A514;  --c-yellow-bg: #fbf3d9;
  --c-green:  #4B8B3B;  --c-green-bg:  #eaf3e7;

  --accent: var(--c-purple);
  --accent-bg: var(--c-purple-bg);
}
```

**イベントごとに `--accent` を上書き** して各所（アイコン背景・上部帯・infoボックス背景・CTA文字色）に反映：

```css
.card[data-open="tcafe"],  #detail-tcafe  { --accent: var(--c-purple); --accent-bg: var(--c-purple-bg); }
.card[data-open="bzcf"],   #detail-bzcf   { --accent: var(--c-red);    --accent-bg: var(--c-red-bg); }
.card[data-open="tfday"],  #detail-tfday  { --accent: var(--c-yellow); --accent-bg: var(--c-yellow-bg); }
.card[data-open="sarana"], #detail-sarana { --accent: var(--c-green);  --accent-bg: var(--c-green-bg); }
```

info ボックスの背景は `color-mix(in srgb, var(--accent) 6%, #ffffff)` で極薄にする（濃い色だと圧迫感が出るため）。

---

## タイポグラフィ

- **フォント**：Noto Sans JP（Google Fonts）500 / 700 / 900 をロード
- **本文**：`font-size: 20px; font-weight: 500; line-height: 1.95;`
- **見出し**：`font-weight: 900;`（Black）
- **letter-spacing: 0.02em**（和文を少しゆったり）
- フォールバック：`-apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif`

**サイズ階層**：

| 要素 | size | weight |
|---|---|---|
| site-title | 30px | 900 |
| card-title / detail-title | 25-28px | 900 |
| info-val | 19px | 700 |
| lead / welcome-lead | 17-18px | 500-700 |
| card-meta（日時アイコン横） | 18px | 700 |
| card-summary / sub-text | 16-18px | 500 |
| footer注記・sub | 13-16px | 500 |

スマホ幅（~480px）で site-title 22px / card-title 20px 相当に縮小。

---

## アイコン（インラインSVGシンボル）

絵文字は一切使わず、`<symbol>` で定義して `<use href="#id"/>` で呼び出す。

### 使用中のシンボル

- `#i-brush` … 写経（寺カフェ）
- `#i-coffee` … 坊主café
- `#i-users` … テラ・フライデー
- `#i-heart` … サラナ親子サロン
- `#i-calendar` / `#i-clock` / `#i-pin` / `#i-yen` / `#i-mail` … infoボックス
- `#i-arrow-right` / `#i-arrow-left` … 詳細遷移・一覧もどる
- `#i-image` … 画像読み込み失敗時のフォールバック
- `#i-line` … LINE予約ボタン（LINEブランド公式のロゴ形状）
- `#i-wakaba` … 初心者マーク（緑＋黄の二色三角）

### 新しいイベント用アイコンの選定指針

- [Lucide Icons](https://lucide.dev/) のシンプルな線画をベースにする（stroke 2px）
- 意味が一目で分かるもの（例：夜のお勤め→月、写経→筆、ヨガ→体）
- SVG の `viewBox` は 24×24、`stroke="currentColor"` で色を継承

---

## コンポーネント

### 1. 画像スライダー

横にゆっくり流れるシームレスループ。

- アイテム数：6枚前後（お寺の実写真）
- アイテムサイズ：260×180px
- 隙間：14px
- 速度：`animation: slide 70s linear infinite;`
- **複製して2セット並べ**、`translateX(calc(-50% - 7px))` で1ループ終了時に先頭に戻る
- マウスホバーで一時停止
- `prefers-reduced-motion` 対応で停止可能
- 左右に `mask-image` でフェード

### 2. カード（一覧）

```
┌─ 上部に6pxの帯（accent色） ─┐
│ [アイコン(円背景)] タイトル  │
│                  サブタイトル│
│ [正方形画像]                 │
│ [カレンダー] 毎月 第○曜日   │
│ [時計] 開始〜終了             │
│ 短い紹介文                   │
│ ──────────────             │
│             詳細を見る →    │
└──────────────────────┘
```

- 背景：白、border 1px、border-radius 12px、上部6px帯で accent 色
- 画像：`aspect-ratio: 1/1`（正方形）
- クリックで対応する詳細ビューへ遷移

### 3. 詳細ビュー（イベントごと）

- 先頭に「← 一覧にもどる」（テキストリンク風）
- アイコン付きタイトル
- 正方形の大きい写真
- 2〜3段落の説明文
- **info ボックス**（極薄 accent 背景）
  - 開催日（毎月第○曜日の目安）
  - **LINE予約ボタン**（開催日の直下、緑 #06C755）
  - 「公式LINEに移動します」注記
  - 時間・会場・会費
- 末尾に「一覧にもどる」の大きめボタン（accent色ボーダー）

**重要**：具体日付は書かず「毎月第○曜日」の目安のみ。具体日程はLINEボタン先で確認する運用。

### 4. LINE予約ボタン（line-cta）

```css
background: #06C755;   /* LINE公式グリーン */
color: #ffffff;
font-weight: 900;
padding: 12px 14px;
border-radius: 10px;
box-shadow: 0 2px 0 #04a447;
white-space: nowrap;   /* テキストを折り返さない */
```

SVG の `#i-line` を左に添える。`href` はイベントごとのLIFF URL。

### 5. 歓迎メッセージ（welcome-lead）

薄い黄色背景（`#fffdf1` / border `#f0e4a3`）の注目ボックス。
先頭に `#i-wakaba` の初心者マーク。

文言例：「はじめての方も大歓迎！お知合をお誘いあわせの上ご参加ください。」

### 6. アクセスセクション

- 見出し「お寺へのアクセス」（中央揃え・900）
- Googleマップ iframe（`aspect-ratio: 4/3`）
  - URL：`https://www.google.com/maps?q={緯度},{経度}&hl=ja&z=17&output=embed`
  - API キー不要の embed形式
- 中央寄せの住所ブロック（寺名・郵便番号・住所）
- 「詳しいアクセスを見る」ボタン（紫、全幅）
  - 遷移先はお寺の公式アクセスページ

一覧ビューでのみ表示（詳細ビューでは非表示）。

---

## レスポンシブ

対象は主にスマホ（LINE WebView）。

```css
.wrap { max-width: 720px; margin: 0 auto; padding: 28px 20px 80px; }

@media (max-width: 480px) {
  .wrap { padding: 20px 16px 60px; }
  .site-title { font-size: 22px; }
  .card-title { font-size: 20px; }
  .detail-title { font-size: 22px; }
  .info-row { grid-template-columns: 24px 80px 1fr; gap: 8px; }
  .info-val { font-size: 16px; }
}
```

タップ領域は最低44px確保。ボタンは `padding: 12-18px` で十分大きく。

---

## JavaScript 動作

すべて素のJavaScript（ライブラリなし）。

```javascript
// カードクリック → 詳細表示（URLハッシュ #tcafe 等に変わる）
// 戻るボタン・ブラウザバック → 一覧に戻る
// URLハッシュ付きで開いた場合はその詳細から始まる
```

主な仕組み：

1. `body.view-list` / `body.view-detail` クラスで表示切替
2. `history.pushState` でハッシュを更新（ブラウザバック対応）
3. `popstate` で state に応じて表示復元
4. 詳細表示時は `window.scrollTo({ top: 0 })` でトップへ

---

## 新しいお寺ページを作る手順

### 1. フォルダ作成

```bash
cp -R myokyo-in/ {新しいお寺スラッグ}/
```

### 2. 差し替える箇所（index.html）

| 箇所 | 内容 |
|---|---|
| `<title>` | お寺名で書き換え |
| `.site-title` | お寺名 |
| `.site-sub` | キャッチコピー |
| スライダー画像 | `images/` の新しい写真に差し替え |
| welcome-lead | 文言は流用可 |
| `.event-list` 内の各 `.card` | イベント4〜5件に差し替え |
| `.detail` 各セクション | 対応する詳細情報に差し替え |
| `data-open` / `id="detail-xxx"` | 全イベントで一貫したスラッグに |
| イベントの accent 色割り当て | 五色から選ぶ（紫・赤・黄・緑） |
| LINE予約URL | 各イベントのLIFF URL |
| アクセスセクション | 寺名・住所・緯度経度・公式アクセスURL |

### 3. Googleマップの緯度経度

お寺の Google Maps ページを開く → URLの `@34.388,132.458,15z` 部分から取得。
iframe の `src` を `https://www.google.com/maps?q={lat},{lng}&hl=ja&z=17&output=embed` に差し替え。

### 4. 画像の準備

`images/` フォルダに配置。

- **カード写真＋スライダー写真**：正方形 600×600px 以上推奨（jpg / png）
- **ファイル名**：英小文字・数字・アンダースコアのみ（例：`tera_friday_1.jpg`）
- **容量**：1枚あたり 200KB以下が目安（合計 1〜2MB に抑えたい）

### 5. プッシュして公開

GitHub Pages（main ブランチ）は自動で反映されます。

```
https://haz-syuu-go.github.io/Syuu-go-line-pages/{お寺スラッグ}/
```

---

## やってはいけないこと

- ❌ 絵文字を文中に埋め込む（`🎉`・`✨` など → 環境差で崩れる・装飾として雑味）
- ❌ 日付を具体的に書き込む（古くなる／LINE予約リンクから最新を案内する運用）
- ❌ フォントウェイト 400 を本文に使う（細すぎて高齢者に読みにくい）
- ❌ 色のコントラストを下げる（accent色の文字を薄い背景に置くなど）
- ❌ 複雑なJSフレームワーク・外部CSS（LINE内で読み込み遅延・不安定）

---

## チェックリスト（公開前）

- [ ] スマホ実機（iPhone/Android）で崩れなく表示される
- [ ] LINE内WebViewでも画像が表示される（`images/` 配下の相対パス）
- [ ] タップ領域が十分大きい（ボタン・カード）
- [ ] 具体日付を書いていない（毎月第○曜日の表記のみ）
- [ ] LINE予約URLが全イベントで設定されている
- [ ] Googleマップに正しい位置でピンが立つ
- [ ] アクセスボタン・詳細ページリンクが全て動く
- [ ] ブラウザバックで一覧に戻れる
