# アビリティチェックシステム

小学校1-3年生向けの認知能力測定システムです。

## 機能概要

- **問題1**: 線つなぎ問題（視覚的追跡）
- **問題2**: 数字欠け問題（5問連続）
- **結果表示**: レーダーチャートでアビリティを可視化
- **データ保存**: Google Sheets API でリアルタイム保存

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Chart.js** (レーダーチャート)
- **Google Sheets API** (データ保存)

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Google Sheets API 設定

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクト作成
2. Google Sheets API を有効化
3. 認証情報 > API キー を作成
4. Google Sheets でスプレッドシートを作成
5. スプレッドシートを「リンクを知っている全員が閲覧可能」に設定

### 3. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、実際の値を設定：

```bash
cp .env.local.example .env.local
```

```env
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SHEET_ID=your_google_sheet_id_here
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

`http://localhost:3000` でアクセスできます。

## スプレッドシート設定

Google Sheets に以下のヘッダーを設定してください：

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 名前 | 実施日 | 実施時刻 | 問題1得点 | 問題2得点 | 総得点 | 読解 | 集中・注意 | 記憶 | 認知 | 得意分野 | 苦手分野 |

## デプロイ

### Vercel でのデプロイ

1. GitHub にプッシュ
2. Vercel で GitHub リポジトリをインポート
3. 環境変数を設定：
   - `GOOGLE_API_KEY`
   - `GOOGLE_SHEET_ID`
4. デプロイ実行

## ファイル構成

```
src/
├── app/
│   ├── page.tsx           # 名前入力ページ
│   ├── problem1/page.tsx  # 問題1ページ
│   ├── problem2/page.tsx  # 問題2ページ
│   ├── result/page.tsx    # 結果ページ
│   └── api/
│       └── save-data/route.ts  # Google Sheets API
├── components/
│   └── RadarChart.tsx     # レーダーチャートコンポーネント
├── lib/
│   ├── constants.ts       # 定数定義
│   └── utils.ts          # ユーティリティ関数
├── types/
│   └── index.ts          # TypeScript型定義
└── public/
    └── docs/             # 問題画像
```

## 採点システム

### 問題1（線つなぎ）
- 3つ全て正解: 2.5点
- 2つ正解: 1点
- 1つ以下正解: 0点

### 問題2（数字欠け）
- 5問全て正解: 2.5点
- 3問正解: 1点
- 2問以下正解: 0点

### 総得点
- 最大5点（問題1: 2.5点 + 問題2: 2.5点）

## ライセンス

このプロジェクトは教育目的で作成されています。
