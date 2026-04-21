# しゅうごうのLINE - Landing Page

お寺特化のLINEアプリ「しゅうごうのLINE」の紹介ランディングページです。
静的HTML/CSS/JSで構築されているため、GitHub Pagesにそのままデプロイ可能です。

## 📁 ファイル構成

```
tera-line-lp/
├── index.html    # メインHTML(全10セクション)
├── style.css     # デザイン・アニメーション
├── script.js     # スクロール/モーダル/FAQ等の制御
└── README.md     # 本ファイル
```

## ✨ 主な機能

| セクション | 内容 |
| --- | --- |
| 1. TOP | 大型タイポグラフィのヒーロー + 3つの実績数値 |
| 2. こんなことができます | 横スクロールカード(課題→解決) |
| 3. 動画 | YouTube埋め込み(`UIfKQRa8Yjk`) |
| 4. 実際にできること | 16機能のアイコングリッド + 詳細ポップアップ |
| 5. 利用者の声 | 6件のお客様の声カード |
| 6. 利用統計 | 100カ寺/67%/3週間のビジュアル表示 |
| 7. クリエイティブサポート | サポート項目リスト + 6ステップ図解 |
| 8. 新しい関係性 | クロージングメッセージ |
| 9. FAQ | 8項目のアコーディオン形式 |
| 10. Contact | CTA ボタン(https://syuu-go.com/contact/ へ遷移) |

## 🎨 デザインコンセプト

- 白を基調とした清潔・誠実なトーン
- アクセントカラー: ダークゴールド `#B8860B`
- 和紙色の生成り背景: `#F7F5F0`
- 見出しフォント: **Shippori Mincho**(和モダン)
- 本文フォント: **Noto Sans JP**

## 🚀 GitHub Pages へのデプロイ手順

### 1. リポジトリ作成
GitHub上で新しいリポジトリを作成します(例: `tera-line-lp`)。

### 2. ローカルでgit初期化 & プッシュ

```bash
cd tera-line-lp
git init
git add .
git commit -m "Initial commit: お寺特化LINEアプリ紹介LP"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/tera-line-lp.git
git push -u origin main
```

### 3. GitHub Pages を有効化

1. リポジトリの `Settings` → `Pages` を開く
2. `Source` を **Deploy from a branch** に設定
3. Branch を `main` / `/ (root)` に選択して `Save`
4. 数分後、`https://<YOUR_USERNAME>.github.io/tera-line-lp/` で公開されます

### 4. 独自ドメインを使う場合(任意)

`tera-line-lp` ディレクトリ直下に `CNAME` ファイルを作成し、ドメインを記載します。

```bash
echo "your-domain.com" > CNAME
git add CNAME && git commit -m "Add CNAME" && git push
```

## 🔧 カスタマイズポイント

### 差し替え・変更しやすい箇所

| 項目 | ファイル | 該当箇所 |
| --- | --- | --- |
| サービス名 | `index.html` | `navbar__logo-text` / `hero__title--accent` |
| CTAリンク先 | `index.html` | `https://syuu-go.com/contact/` を全置換 |
| YouTube動画ID | `index.html` | `video-wrap` 内 iframe の `src` |
| カラーテーマ | `style.css` | `:root` 内の CSS変数 |
| 機能ポップアップ内容 | `script.js` | `featureData` オブジェクト |
| お客様の声 | `index.html` | `voice-card` 各セクション |
| FAQ | `index.html` | `.faq__list` 内の `<details>` タグ |
| アイコン | `index.html` | ページ先頭の `<symbol id="i-xxx">` を編集(全アイコンはSVG) |

### 写真マルキー(横自動スクロール)の差し替え方

Hero直下の `<section class="marquee">` 内 `.marquee__item` にbackground-imageを指定してください。**8枚1セットを用意し、2回繰り返す**ことで無限ループします。

```html
<!-- 例: 実際の画像を指定する場合 -->
<div class="marquee__item" style="background-image: url('images/photo01.jpg')"></div>
```

ラベル(写真1〜写真8)を非表示にする場合:
```html
<div class="marquee__item" style="background-image: url('images/photo01.jpg')">
  <!-- <span class="marquee__label">...</span> は削除 -->
</div>
```

同じ画像を2セット並べて配置することで、シームレスなループが実現されます。スクロール速度は `style.css` の `@keyframes marqueeScroll` のアニメーション時間(`40s`)で調整可能です。

## 💡 技術仕様

- **フレームワーク不使用**: ピュア HTML/CSS/JS のみ。ビルド不要
- **外部依存**: Google Fonts のみ(CDN経由)
- **アクセシビリティ**: WCAG AAコントラスト基準を遵守
- **アニメーション**: `prefers-reduced-motion` 対応済み
- **レスポンシブ**: 640px / 768px / 900px / 1200px

## 📱 動作確認

ローカルで確認する場合:

```bash
# Python 3
python3 -m http.server 8000

# または Node.js
npx serve .
```

ブラウザで `http://localhost:8000` を開いて確認してください。

## 📮 問い合わせ

本LPに関するご連絡は、[寺子屋しゅうごう お問い合わせフォーム](https://syuu-go.com/contact/) からお願いいたします。

---

© 2026 寺子屋しゅうごう. All rights reserved.
