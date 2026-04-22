# 西岸寺 LINEページ デザイン設計書

真宗大谷派 西岸寺のLINE内ブラウザ向けページ群の共通デザイン仕様。
新規ページ（ご法事チェックリスト・お塔婆申込フォーム等）も本設計書に準拠して作成すること。

---

## 1. 基本方針

### コンセプト
- LINE内ブラウザで開かれることを前提としたモバイルファースト
- 仏事という重みを感じさせず、初めての方でも安心して読める柔らかい印象
- お寺らしい落ち着き × 視認性の高さ

### 対象ページ
| ファイル名 | 用途 | 状態 |
|---|---|---|
| `houji.html` | ご法事の準備ガイド | 公開中 |
| `ofuse.html` | お布施について | 公開中 |
| `ohaka.html` | お墓の選び方ガイド | 制作済 |
| `houji-form.html`（新規） | ご法事チェックリスト・お塔婆申込フォーム | 制作予定 |

### 公開URL
`https://haz-syuu-go.github.io/Syuu-go-line-pages/kokyuzan-saiganji/{ファイル名}`

---

## 2. カラーパレット

CSS変数として`:root`に定義する。**全ページで統一すること。**

```css
:root {
  --green: #2e7d32;          /* メインカラー：見出し・ボタン枠 */
  --green-light: #4caf50;    /* アクセント：装飾・サブアイコン */
  --green-pale: #e8f5e9;     /* 背景：イントロ・ハイライト */
  --green-dark: #1b5e20;     /* 強調：見出し・重要テキスト */
  --gray: #666;              /* サブテキスト */
  --gray-light: #f5f5f5;     /* 表の縞模様等 */
  --border: #e0e0e0;         /* 境界線 */
  --radius: 14px;            /* カード・ボックスの角丸 */
  --shadow: 0 2px 12px rgba(0,0,0,0.07);
}
```

### 使い分けルール
- 見出し（h2/h3）の色：`--green-dark`
- ボタン背景：`--green`
- ハイライトボックス背景：`--green-pale`
- LINE公式緑：`#06c755`（CTAボタン用、上記とは別管理）

### 禁則事項
- **十字架を連想させる図案は使用しない**（仏教寺院のため）
  - SVGアイコンに「+」型のクロスパスを含めない
  - 過去に`ic-money`、`ic-grave`で問題発生→修正済み

---

## 3. タイポグラフィ

### フォント
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;900&display=swap" rel="stylesheet">
```

```css
body {
  font-family: "Noto Sans JP", sans-serif;
  line-height: 1.9;
  font-size: 17px;
  -webkit-text-size-adjust: 100%;
}
```

### サイズ階層
| 要素 | サイズ | weight |
|---|---|---|
| ヘッダーh1 | 26〜28px | 900 |
| section-title (h2) | 24px | 900 |
| カードh3 | 17〜20px | 900 |
| 本文 | 16〜17px | 400 |
| サブテキスト | 13〜15px | 400 |

### 強調ルール
- `<strong>`は**緑（`--green-dark`）にしない**（黒の太字でOK）
- ただしハイライトボックス内・特殊カード内では`color: var(--green-dark)`を使う

---

## 4. レイアウト

### 共通構造
```
<header class="header">           ← グラデーション緑、白文字
<section>                          ← 白背景セクション
<section class="bg-warm">          ← 緑pale背景セクション（交互配置）
<section class="contact-section">  ← グラデーション緑のお問い合わせ
<footer class="footer">
```

### コンテンツ最大幅
- セクション内のコンテンツ：`max-width: 520px; margin: 0 auto;`
- セクション自体のpadding：`44px 20px`
- 写真等の大きな要素もモバイルでは`width:100%`、PCでは`max-width:520px`

---

## 5. 共通コンポーネント

### 5-1. ヘッダー
```html
<header class="header">
  <div class="temple-name">真宗大谷派 西岸寺</div>
  <h1>ページタイトル</h1>
  <div class="header-icon"><svg width="48" height="48"><use href="#ic-beads" stroke="#fff"/></svg></div>
  <p class="sub">サブコピー<br>2行程度</p>
</header>
```

### 5-2. セクション見出し
```html
<h2 class="section-title">セクション名</h2>
<div class="divider"></div>
```
※`.divider`は緑の短い横線（44px × 3px）

### 5-3. イントロボックス
```html
<div class="intro-box">
  <div class="intro-icon"><svg width="48" height="48"><use href="#ic-pray" stroke="#2e7d32"/></svg></div>
  <p>説明テキスト</p>
</div>
```
緑pale背景、中央寄せ。ページの導入部に使う。

### 5-4. 情報カード（info-card）
```html
<div class="info-cards">
  <div class="info-card">
    <div class="card-icon"><svg width="36" height="36"><use href="#ic-clock"/></svg></div>
    <div><h3>タイトル</h3><p>説明</p></div>
  </div>
</div>
```

### 5-5. 強調カード（緑枠の囲み）
```html
<div class="info-card" style="background:#fff; border:2px solid var(--green);">
  ...
</div>
```
お布施・特典情報など、一段引き上げて見せたい要素に使用。

### 5-6. ハイライトボックス
```html
<div class="highlight-box">
  <p>強調したいメッセージ<br><strong>太字部分</strong></p>
</div>
```
緑pale背景、中央寄せ、太字緑色。

### 5-7. フロー（手順）
```html
<div class="flow-section">
  <div class="flow-item">
    <div class="flow-num">1</div>
    <div class="flow-content">
      <h3>ステップ名</h3>
      <p>説明</p>
    </div>
  </div>
</div>
```
- ナンバーは緑丸＋白数字
- ステップ間は緑のラインで縦に繋ぐ
- **flow-item内のh3にSVGアイコンは入れない**（過去に十字架問題で全削除）

### 5-8. FAQ（アコーディオン）
```html
<div class="faq-item">
  <button class="faq-q" onclick="toggleFaq(this)">
    <span class="q-badge">Q</span>質問<span class="chevron">▼</span>
  </button>
  <div class="faq-a"><div class="faq-a-inner">回答</div></div>
</div>
```

### 5-9. お問い合わせセクション
```html
<section class="contact-section">
  <h2 class="section-title">お問い合わせ</h2>
  <div class="divider"></div>
  <div class="contact-inner">
    <p class="contact-lead">リード文</p>
    <div class="contact-box">
      <h3>真宗大谷派 西岸寺</h3>
      <ul>
        <li>〒826-0042 福岡県田川市川宮1513-7</li>
        <li>0947-42-2769</li>
        <li>muryo-n@poppy.ocn.ne.jp</li>
      </ul>
    </div>
    <div class="map-wrap">
      <iframe src="https://www.google.com/maps?q=福岡県田川市川宮1513-7+西岸寺&output=embed"></iframe>
    </div>
    <div class="contact-btns">
      <a href="https://lin.ee/WqZAuqu" class="contact-btn line">LINEで問い合わせる</a>
      <a href="tel:0947-42-2769" class="contact-btn tel">電話で相談する</a>
    </div>
  </div>
</section>
```

### 5-10. CTAボタン

**LINEボタン（最優先CTA）**
```html
<a href="https://lin.ee/WqZAuqu" style="display:inline-flex; align-items:center; gap:8px; background:#06c755; color:#fff; padding:14px 28px; border-radius:30px; font-size:16px; font-weight:700; text-decoration:none;">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><!-- LINE icon path --></svg>
  LINEで相談する
</a>
```

**LIFFリンク（日程相談用）**
```
https://liff.line.me/2009625756-QSxV60j5?unique_key=pCJQFu&ts=1776092971
```

---

## 6. SVGアイコン

### 定義方法
ページ冒頭に`<svg style="display:none">`ブロックを置き、`<symbol>`で定義。
本文では`<use href="#ic-xxx" stroke="#2e7d32"/>`で参照。

### 命名規則
`ic-{名前}` 例：`ic-pray`, `ic-beads`, `ic-temple`

### 共通アイコン一覧
| ID | 用途 |
|---|---|
| `ic-pray` | 合掌・祈り |
| `ic-beads` | 数珠 |
| `ic-temple` | 寺院 |
| `ic-grave` | お墓（十字架なし版） |
| `ic-tree` | 樹木葬 |
| `ic-home` | 自宅・納骨堂 |
| `ic-people` | 家族・人 |
| `ic-clock` | 時間 |
| `ic-car` | 駐車場 |
| `ic-phone` | 電話 |
| `ic-pin` | 住所 |
| `ic-mail` | メール |
| `ic-money` | お金（封筒のみ・中の図案なし） |
| `ic-envelope` | 封筒 |
| `ic-check` | チェック |
| `ic-clipboard` | チェックリスト |
| `ic-chat` | 会話 |
| `ic-flower` | お花 |
| `ic-candle` | ろうそく |
| `ic-lantern` | 提灯 |
| `ic-dining` | お食事 |
| `ic-photo` | 写真 |
| `ic-tablet` | 位牌 |
| `ic-heart` | 心・思い |

### アイコン制作ルール
- viewBox：`0 0 48 48`
- `fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`
- 線画スタイル（塗りつぶしなし）
- **十字パターン禁止**（仏教寺院のため）

---

## 7. フォームページの設計（新規ページ向け）

### 7-1. 構成案

```
┌─ ヘッダー ────────────────────────────────┐
│ 真宗大谷派 西岸寺                          │
│ ご法事のお申し込み                         │
│ 数珠アイコン                                │
│ 必要事項をご記入ください                   │
└────────────────────────────────────────┘

┌─ イントロ（緑pale）────────────────────┐
│ ご記入いただいた内容を確認のうえ          │
│ 住職よりご連絡いたします。                │
│ ※お電話・LINEでのお申し込みも可能です    │
└────────────────────────────────────────┘

┌─ STEP 1：ご法事の種類 ───────────────────┐
│ ◯ 四十九日（納骨法要）                   │
│ ◯ 一周忌                                 │
│ ◯ 三回忌                                 │
│ ◯ その他（ ___ 回忌）                    │
│ ◯ お塔婆のみ                              │
└────────────────────────────────────────┘

┌─ STEP 2：ご希望日時 ─────────────────────┐
│ 第一希望：[日付ピッカー] [時刻]            │
│ 第二希望：[日付ピッカー] [時刻]            │
│ 第三希望：[日付ピッカー] [時刻]            │
│ ※ご希望の3ヶ月前、遅くとも1ヶ月前に       │
└────────────────────────────────────────┘

┌─ STEP 3：お塔婆のお申し込み ─────────────┐
│ □ お塔婆を申し込む                        │
│   本数：[セレクト 1〜10本]                │
│   施主名（複数可）：[テキストエリア]      │
└────────────────────────────────────────┘

┌─ STEP 4：施主・連絡先 ───────────────────┐
│ 施主名（必須）：[テキスト]                │
│ ふりがな（必須）：[テキスト]              │
│ 電話番号（必須）：[テキスト]              │
│ メール：[テキスト]                        │
│ LINE名：[テキスト]                        │
└────────────────────────────────────────┘

┌─ STEP 5：故人について ───────────────────┐
│ 故人のお名前：[テキスト]                  │
│ ご命日：[日付ピッカー]                    │
│ 続柄：[セレクト]                          │
└────────────────────────────────────────┘

┌─ STEP 6：オプション・ご要望 ─────────────┐
│ □ お食事を希望する                        │
│   人数：[数値]                            │
│ □ お墓参りを希望する                      │
│ ご質問・ご要望：[テキストエリア]          │
└────────────────────────────────────────┘

┌─ チェックリスト確認（任意） ──────────────┐
│ □ 法名軸／過去帳／繰り出し位牌            │
│ □ ご遺骨（納骨法要の場合）                │
│ □ 故人のお写真                            │
│ □ お布施                                  │
│   → お布施について詳しくはこちら          │
└────────────────────────────────────────┘

┌─ 送信ボタン ─────────────────────────────┐
│ [LINEで送信する]（緑大ボタン）           │
│ または                                    │
│ [フォーム送信する]                       │
└────────────────────────────────────────┘

┌─ お問い合わせ（緑グラデ）──────────────────┐
│ ご不明点はお気軽にご連絡ください          │
│ [LINE] [電話]                             │
└────────────────────────────────────────┘
```

### 7-2. フォームの基本スタイル

```css
.form-section {
  background: #fff;
  border-radius: var(--radius);
  padding: 24px 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}
.form-section h3 {
  font-size: 18px;
  font-weight: 900;
  color: var(--green-dark);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.form-step-num {
  background: var(--green);
  color: #fff;
  width: 28px; height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
  flex-shrink: 0;
}

.form-row { margin-bottom: 18px; }
.form-label {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}
.form-label .required {
  background: #d32f2f;
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
  margin-left: 6px;
  font-weight: 700;
}
.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 16px;        /* iOS自動ズーム防止のため16px以上 */
  font-family: inherit;
  background: #fff;
  -webkit-appearance: none;
}
.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--green);
}
.form-textarea { resize: vertical; min-height: 100px; }
.form-help {
  font-size: 13px;
  color: var(--gray);
  margin-top: 6px;
  line-height: 1.7;
}

/* ラジオ・チェックボックス */
.form-radio-group,
.form-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.form-radio-label,
.form-checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: border-color .2s, background .2s;
}
.form-radio-label:has(input:checked),
.form-checkbox-label:has(input:checked) {
  border-color: var(--green);
  background: var(--green-pale);
}
.form-radio-label input,
.form-checkbox-label input {
  width: 20px; height: 20px;
  accent-color: var(--green);
  flex-shrink: 0;
}

/* 送信ボタン */
.form-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 360px;
  margin: 24px auto;
  padding: 18px 28px;
  background: #06c755;
  color: #fff;
  border: none;
  border-radius: 30px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(6, 199, 85, 0.3);
}
.form-submit-secondary {
  background: #fff;
  color: var(--green);
  border: 2px solid var(--green);
  box-shadow: none;
}
```

### 7-3. iOS/Android対応の必須事項

- `<input>`の`font-size`は**16px以上**（iOS Safariで自動ズームされるのを防ぐ）
- `<input type="tel">` で電話番号入力時に数字キーボード起動
- `<input type="email">` でメール入力時に@キー起動
- `<input type="date">` で日付ピッカー
- `<input type="number" inputmode="numeric">` で人数等の数値入力
- `<textarea>`は`resize: vertical`のみ許可
- `accent-color: var(--green)`でラジオ・チェックを緑に
- ボタンに`-webkit-tap-highlight-color: rgba(46,125,50,.1);`

### 7-4. 送信方法の選択肢

LINE内ブラウザでの利用が前提のため、以下の方式から選ぶ：

**A. Googleフォーム埋め込み方式**（推奨）
- iframeで埋め込み or リンク誘導
- 受付通知が自動でメール送信される
- 集計が楽

**B. LINEへのテンプレート投稿方式**
- 入力内容をテンプレ化して`https://lin.ee/...`にリダイレクト
- ユーザーがLINEに貼り付けて送信
- 西岸寺側はLINEで全管理可能

**C. mailto方式**
- フォーム内容を本文化して`mailto:`で起動
- 簡単だが既読管理が難しい

**推奨はA→Bのハイブリッド**：Googleフォーム送信後、LINE公式で受付完了メッセージを自動送信。

---

## 8. ファイル構成

```
kokyuzan-saiganji/
├── houji.html           （ご法事の準備ガイド）
├── ofuse.html           （お布施について）
├── ohaka.html           （お墓の選び方）
├── houji-form.html      （新規：ご法事申込フォーム）← 本設計書の対象
├── books.JPG            （houji.html用）
├── ohuse.jpg            （ofuse.html用）
├── list.png             （法名軸チェック項目用）
└── DESIGN_SPEC.md       （本ファイル）
```

### 命名規則
- HTML：すべて小文字、ハイフン区切り（`houji-form.html`）
- 画像：JPG/PNG混在可、わかりやすい名前
- 画像はページと同階層に配置（相対パスで参照）

---

## 9. ページ間リンク

各ページの末尾やCTA箇所で他ページへ自然に誘導する。

| 元ページ | 誘導先 | 文言例 |
|---|---|---|
| houji.html | houji-form.html | ご法事のお申し込みはこちら |
| houji.html | ofuse.html | お布施について詳しくはこちら |
| houji.html | ohaka.html | お墓の選び方はこちら |
| ofuse.html | houji.html | ご法事の準備ガイドに戻る |
| ohaka.html | houji.html | ご法事のご相談はこちら |

---

## 10. 開発・運用ルール

### コードスタイル
- **ビルドツール不要**：単一HTMLにCSSとJSをインライン
- セレクタはBEMライク（`.card-icon`, `.flow-num`等）
- インラインstyleは「強調カード」など例外的な装飾のみ許可

### Git運用
- ブランチ：`main`に直接コミット可
- コミットメッセージ：日本語/英語どちらでも可。具体的に。
- プッシュ後、GitHub Pagesで自動公開（数十秒）

### 画像
- ファイルサイズはモバイル前提で1枚あたり200KB以下を目安
- 横長写真は`max-width: 520px; display:block; margin:0 auto;`でPC時の巨大表示を防ぐ

### コピー（文言）作成時のチェックリスト
- [ ] 「初めての方でも分かる」言葉になっているか
- [ ] 強い指示・断定を避け、お寺らしい柔らかな語り口か
- [ ] 「ご相談」「お気軽に」など、ハードルを下げる表現を入れたか
- [ ] お布施金額など、明示しないほうが良い情報を書いていないか
- [ ] 真宗大谷派として正しい教義表現か（不安なときは住職へ確認）

### テスト
- iPhoneのLINE内ブラウザで実機確認（Safari WebView）
- AndroidのLINE内ブラウザで実機確認（Chrome WebView）
- フォントが効いているか、ボタンが押しやすいかを必ず確認

---

## 11. 参考実装

### 既存の優れたパターン
- **チェックリスト＋詳しく見る**：houji.html L363〜（タブ＋アコーディオン展開）
- **クイズ診断**：ohaka.html L500〜（3問で結果分岐）
- **写真＋イントロ**：houji.html L327〜（books.JPG + intro-box）
- **緑枠強調カード**：houji.html L655〜（お布施について）
- **囲みボックス**：houji.html L582〜（日程相談の注意書き）

これらを部品として再利用する。

---

## 12. 改訂履歴

| 日付 | 改訂内容 |
|---|---|
| 2026-04-22 | 初版作成。houji/ofuse/ohakaの3ページから抽出。 |

---

このドキュメントは生きた仕様書です。新しいパターンを追加した際、不要になったルールが出た際は更新してください。
