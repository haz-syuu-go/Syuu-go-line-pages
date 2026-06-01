# 東林寺 LINEページ デザイン仕様書

LINEのリッチメニューから遷移する東林寺のWebページ群。LINE内ブラウザ（WebView）での表示を前提とする。

---

## 寺院情報

| 項目 | 内容 |
|---|---|
| 正式名称 | 浄土宗 紫金山 妙雲院 東林寺 |
| 住所 | 〒110-0004 東京都台東区下谷1-12-21 |
| 電話 | 03-3843-4034 |
| FAX | 03-3843-3442 |
| メール | zen0801key@gmail.com |
| LINE | https://lin.ee/5XPp6PB |
| LIFF（日程相談） | https://liff.line.me/2010126434-cKECWmxF?unique_key=RGS1oQ&ts=1779148721 |

---

## ファイル構成

```
tourin-ji/
├── DESIGN_SPEC.md          ← 本仕様書
├── event.html              ← 年間行事のご案内
├── news.html               ← 新着情報（カテゴリタブで絞り込み）
├── chat-introduction.html  ← LINEで相談する
├── houji/
│   ├── houji.html          ← ご法事のご案内（メニュー）
│   ├── list.html           ← ご法事前のチェックリスト
│   └── flow.html           ← 当日の流れ
└── images/
    ├── tourinji_hondo.jpg       ← ヒーロー画像（住職後ろ姿・法要）
    ├── tourinji_priest.jpg      ← 住職写真
    ├── tourinji_carousel_1.jpg  ← カルーセル1
    ├── tourinji_carousel_2.jpg  ← カルーセル2（= tourinji_hondo.jpg のソース）
    └── tourinji_carousel_3.jpg  ← カルーセル3
```

---

## カラーパレット

```css
:root {
  --accent:        #4a7c59;   /* メイン緑：ボタン・見出し・アイコン */
  --accent-light:  #eaf2eb;   /* 薄緑背景 */
  --accent-mid:    #c5d9c8;   /* 中間緑：区切り線・非強調ボーダー */
  --accent-subtle: #f2f7f3;   /* 極薄緑背景：フッター・次の行事背景 */
  --text-primary:  #1a1a1a;
  --text-secondary:#555555;
  --text-muted:    #888888;
  --border:        #e0e0e0;
  --bg:            #ffffff;
  --bg-surface:    #f5faf5;
}
```

### チェックリストタブ色（list.html 固有）

| タブ | 色 |
|---|---|
| 納骨 | `#4a7c59`（緑） |
| 年忌法要 | `#4a629e`（藍） |
| 新盆 | `#b5762c`（琥珀） |

---

## タイポグラフィ

- **フォント**：Noto Sans JP（Google Fonts、400 / 700）
- **基本サイズ**：`font-size: 18px`、`line-height: 1.9`
- **-webkit-text-size-adjust: 100%** を必ず指定

### サイズ階層

| 要素 | サイズ | weight |
|---|---|---|
| ページタイトル | 20〜22px | 700 |
| セクション見出し | 17px | 700 |
| カード・アイテムタイトル | 17〜18px | 700 |
| 本文・説明 | 15〜17px | 400 |
| バッジ・ラベル | 12〜14px | 700 |

---

## 共通レイアウト

```css
.wrap { max-width: 480px; margin: 0 auto; background: #fff; }
```

- ヒーロー画像：`height: 240px`、`object-fit: cover`
- ページヘッダー（accent背景・白文字）：`padding: 18px 16px 14px`
- フッター：`background: var(--accent); color: rgba(255,255,255,0.75); font-size: 14px; padding: 14px;`

---

## ページ別仕様

### houji.html（ご法事のご案内）

ご法事の4ステップをカード＋コネクターで表示するメニューページ。

**カード構成：**

| No. | タイトル | リンク先 | 状態 |
|---|---|---|---|
| 01 | 日程のご相談 | LIFF URL（日程相談フォーム） | active |
| 02 | ご法事前のチェックリスト | `./list.html` | active |
| 03 | お塔婆の申込み | — | 準備中 |
| 04 | 当日の流れ | `./flow.html` | active |

**コネクター（カード間の縦線＋矢印）：**

```html
<div class="menu-connector"><span class="menu-conn-arrow">↓</span></div>
```

```css
.menu-connector { display: flex; align-items: center; justify-content: center; height: 28px; position: relative; }
.menu-connector::before {
  content: ''; position: absolute;
  left: 27px; /* num-badge（26px）の中心 = 左パディング14px + 13px */
  top: 0; bottom: 0; width: 2px;
  background: var(--accent-mid);
}
.menu-conn-arrow { font-size: 15px; color: var(--accent); background: var(--bg); padding: 0 8px; position: relative; z-index: 1; font-weight: 700; }
```

**バッジ：**

```css
/* 準備中バッジ */
.prep-badge { display: inline-block; font-size: 12px; font-weight: 700; background: #eeeeee; color: #888888; border-radius: 4px; padding: 2px 8px; margin-left: 6px; vertical-align: middle; }
/* 無効カード */
.menu-card.disabled { opacity: 0.38; pointer-events: none; }
.num-badge.gray { background: #aaaaaa; }
```

**注意書きボックス（menu-note）：**
- 背景：`#fff1e0`、ボーダー：`#f0c896`、テキスト：`#a8501a`
- 強調したい語は `<strong>` で太字（例：「**3ヶ月前を目安に**」）

---

### list.html（ご法事前のチェックリスト）

3タブ（納骨・年忌法要・新盆）のチェックリスト。

**タブ：ボタン型**（背景なし → アクティブ時に塗りつぶし）

```css
.tab { flex: 1; font-size: 15px; text-align: center; padding: 13px 4px; border-radius: 10px; border: 2px solid; background: var(--bg); font-weight: 700; }
.tab[data-color="green"]        { border-color: #4a7c59; color: #4a7c59; }
.tab[data-color="green"].active { background: #4a7c59; color: #fff; }
.tab[data-color="blue"]         { border-color: #4a629e; color: #4a629e; }
.tab[data-color="blue"].active  { background: #4a629e; color: #fff; }
.tab[data-color="amber"]        { border-color: #b5762c; color: #b5762c; }
.tab[data-color="amber"].active { background: #b5762c; color: #fff; }
```

**チェックで斜線（CSS）：**

```css
.simple-item input[type="checkbox"]:checked ~ .simple-title {
  text-decoration: line-through;
  color: var(--text-muted);
}
.acc-header input[type="checkbox"]:checked ~ .acc-title-wrap .acc-title {
  text-decoration: line-through;
  color: var(--text-muted);
}
```

**任意バッジ：**

```css
.opt-tag { font-size: 12px; color: var(--text-muted); background: #f0f0f0; border-radius: 3px; padding: 1px 6px; font-weight: 400; margin-left: 6px; }
```

**タブ別お持ち物（任意バッジ付き）：**

| タブ | 任意バッジ対象 |
|---|---|
| 納骨 | 御写真 |
| 年忌法要 | 御位牌・御写真 |
| 新盆 | 御位牌・御写真 |

**削除済み項目：**
- 全タブ：住職の携帯・メールアドレス
- 納骨・年忌法要タブ：お位牌のサイズご連絡
- 年忌法要タブ：名義変更のご印鑑

**セクション見出しデザイン：**

中央揃え・下線スタイル。左ボーダーは使わない。

```css
/* 共通（お持ち物など） */
.section-title {
  font-size: 20px; font-weight: 700;
  color: var(--accent);
  text-align: center;
  border-bottom: 2px solid var(--accent);
  padding: 6px 0 10px;
  margin: 4px 0 16px;
  line-height: 1.4;
}

/* 強調（事前にご連絡いただきたいこと） */
.section-title.emph {
  background: var(--accent-light);
  border-radius: 8px 8px 0 0;
  border-bottom: 3px solid var(--accent);
  padding: 14px 16px 12px;
  font-size: 20px;
  text-align: center;
}

/* 見出し直下の案内文 */
.section-note {
  font-size: 15px;
  color: var(--text-secondary);
  text-align: center;
  margin: 0 0 14px;
  line-height: 1.8;
}
```

「事前にご連絡いただきたいこと」見出し直下に案内文を追加：「1週間前までにLINEかお電話にてお知らせください」

---

### flow.html（当日の流れ）

当日の6ステップ + 服装案内 + 施設情報 + アクセス（Googleマップ）。

**GoogleマップURL：**
```
https://maps.google.com/maps?q=東林寺+東京都台東区下谷1-12-21&output=embed
```

**Googleマップ共有リンク：** `https://share.google/mMsLqw9sCQi4Qrmm1`

---

### event.html（年間行事のご案内）

タイムライン形式で年間行事を表示。現在日以降の最初の行事に「次の行事」バッジを自動付与。

**次の行事カード：**
```css
.ev-card.next-event {
  border-color: var(--accent);   /* 強調：accent色 */
  border-width: 2px;
  background: var(--accent-subtle);
}
```

**カルーセル：** 3枚フェードスライド、6秒間隔

**年間行事一覧（2026年）：**

| 月 | 行事名 | ふりがな | 日程 |
|---|---|---|---|
| 3月 | 春彼岸会 | しゅんきひがんえ | 春分の日 前後3日間 |
| 5月 | お施餓鬼会 | おせがきえ | 5月24日 |
| 7月 | 新盆法要 | にいぼんほうよう | 7月中旬 |
| 9月 | 秋彼岸会 | しゅうきひがんえ | 秋分の日 前後3日間 |

---

### chat-introduction.html（LINEで相談する）

チャット風アニメーション + LINE送信ボタン + 住職情報カード。

**LINEボタン：** `href="https://lin.ee/5XPp6PB"`（`line://` は使わない）

**ヘッダー：** タイトルのみ。ボタンは表示しない。

**受付情報：**
- 受付時間：24時間いつでも
- 返信目安：2日以内
- 急ぎ・葬儀：電話にてご連絡

---

### news.html（新着情報）

寺報・お知らせを時系列で表示する1ページ完結のお知らせ一覧。上部にカテゴリタブ（4種）、下にカード形式の記事リストを並べ、素のJSで `display` を切り替えるだけのシンプルなクライアントサイドフィルタ。

**ヘッダー：**
- accent背景、白文字
- 文言：`{寺院名}｜新着情報`
- 右側に虫眼鏡SVGアイコン（装飾、機能なし）

**タブ（.tab-grid）：** 2列×2行のグリッド

| `data-filter` | ラベル | 初期状態 |
|---|---|---|
| `all` | すべて | `active`（必ず1つだけ） |
| `お知らせ` | お知らせ | |
| `行事・催し` | 行事・催し | |
| `その他` | その他 | |

アクティブ時のスタイル：
```css
.tab-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-light);
}
```

**ニュースカード（.news-card）：**

- `data-category` 属性で絞り込み対象に（`all` 以外と一致したら表示）
- `.news-img-placeholder`：高さ 160px、`var(--accent-subtle)` 背景＋書類アイコンSVG（画像未登録時のデフォルト表示。実画像があれば `<img>` に差し替え可）
- `.news-tag`：カテゴリ表示バッジ（`#f0ede8` 背景、グレー文字）
- `.news-date`：`更新日：YYYY.MM.DD` 形式
- `.news-title`：17px 太字、行間 1.6
- `.news-excerpt`：15px、行間 1.9
- `.news-btn`：枠線ボタン、`href` は詳細ページ or `#`

**空表示メッセージ（.empty-msg）：** タブで該当0件のとき表示
- 文言：「該当する記事がありません」
- JS が `display` を `block` / `none` で切替

**フッター（.footer-bar）：** accent背景、`© {寺院名}` を中央表示

**フィルタ JS：** 素のDOM操作のみ。タブクリックで全タブの `active` を外し、対象タブだけ付与。各カードを `data-category` で表示/非表示し、表示件数が0なら空表示メッセージを出す。

**禁則事項：**
- カードの `data-category` とタブの `data-filter` は必ず1対1で対応させる（ズレるとそのタブで0件表示になる）
- カテゴリを増減する場合は両方を同時に変更
- 記事の更新日以外に具体的な日付を埋め込まない（古くなる）
- カード本文に絵文字を含めない

---

## 禁則事項

- LINE内で `line://` スキームのリンクは使わない → `https://lin.ee/...` を使う
- 住職の携帯番号・個人メールアドレスはページに掲載しない
- 十字架を連想させるSVGパスは使わない（仏教寺院）
- 具体的な日付をページに書き込まない（古くなるため）

---

## 改訂履歴

| 日付 | 内容 |
|---|---|
| 2026-05-19 | 初版作成。これまでの実装内容をまとめ。 |
| 2026-05-19 | list.html：タブをボタン型に変更・チェックで斜線・任意バッジ・事前連絡見出し強調 |
| 2026-05-19 | houji.html：コネクター↓矢印・準備中バッジ・3ヶ月前を目安に太字 |
| 2026-05-19 | event.html：次の行事カードのボーダーを accent 色に強調 |
| 2026-05-19 | chat-introduction.html：フォント拡大・ヘッダーボタン削除 |
| 2026-06-01 | news.html（カテゴリタブ付き新着情報ページ）の仕様を追加。ファイル構成・ページ別仕様に反映。 |
<<<<<<< HEAD
| 2026-05-19 | list.html：見出しを中央揃え・下線・20px に変更（左ボーダー廃止） |
=======
>>>>>>> origin/main
