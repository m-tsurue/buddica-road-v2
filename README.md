# 🚗 BUDDICA ROAD

**思い出作りのドライブルート提案アプリ**

目的地を選ぶとAIがパーソナライズされたスポットを提案し、Tinderライクなスワイプで楽しく旅程を作成できるWebアプリケーションです。

## 🔐 環境変数の設定

### 開発環境
`.env.local`ファイルをプロジェクトルートに作成:
```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

### 本番環境（Vercel）
1. Vercelダッシュボードにログイン
2. プロジェクト設定 → Environment Variables
3. 以下を追加:
   - Key: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - Value: あなたのMapboxアクセストークン

## 🌟 主な機能

### 🎯 **3つの発見方法**
- **🔍 キーワード検索**: 「温泉」「絶景」「グルメ」等で検索
- **🗾 エリア選択**: 湘南・箱根・鎌倉・富士五湖から選択
- **🔥 人気スポット**: トレンドランキングから選択

### 🎴 **スワイプ選択**
- Tinderライクな直感的操作
- 右スワイプで「行きたい！」、左スワイプでスキップ
- 選んだ目的地に基づくパーソナライズ提案

### 🛣️ **ルート編集**
- ドラッグ&ドロップで順序変更
- リアルタイム時間・距離計算
- おすすめタイミング表示

## 🚀 クイックスタート

```bash
# プロジェクトをクローン
git clone https://github.com/m-tsurue/buddica-road-v2.git
cd buddica-road-v2

# 依存関係をインストール
npm install

# 環境変数を設定（.env.localファイルを作成）
echo "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here" > .env.local

# 開発サーバーを起動
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 🏗️ 技術スタック

- **フロントエンド**: Next.js 15, TypeScript, Tailwind CSS
- **アニメーション**: Framer Motion
- **アイコン**: Lucide React
- **デプロイ**: Vercel
- **状態管理**: React hooks + localStorage

## 📱 対応予定

### 🗺️ **地図機能**（次回リリース）
- Mapbox GL JS統合
- インタラクティブな地図選択
- リアルタイムナビゲーション

### 🗄️ **データベース統合**
- Supabase統合
- 1000+の実スポットデータ
- ユーザー認証・お気に入り

### 📱 **PWA対応**
- オフライン利用
- ホーム画面追加
- プッシュ通知

## 🎯 使い方

### 1. 目的地を選択
ホームページで3つの方法から目的地を選択します：
- キーワード検索で具体的に探す
- エリアから大まかな場所を選ぶ  
- 人気スポットから注目の場所を選ぶ

### 2. スポットをスワイプ選択
選んだ目的地に基づいて、AIが関連するスポットを提案します。
- 右にスワイプ：「行きたい！」
- 左にスワイプ：「スキップ」
- カードをタップ：詳細情報を確認

### 3. ルートを編集
選択したスポットの順序をドラッグ&ドロップで調整し、最適なルートを作成します。

## 🤖 レコメンドアルゴリズム

AIが以下の要素を考慮してパーソナライズ提案を生成：

- **距離（40%）**: 選択した目的地からの近さ
- **タグ類似度（25%）**: 興味カテゴリのマッチング
- **vibes類似度（20%）**: 体験タイプの類似性
- **評価（15%）**: スポットの品質スコア

## 📁 プロジェクト構造

```
app/
├── page.tsx              # ホームページ（目的地選択）
├── swipe/page.tsx        # スワイプ選択画面
├── route-editor/page.tsx # ルート編集画面
└── map/page.tsx          # 地図選択画面（予定）

components/
└── SwipeCard.tsx         # スワイプカード

lib/
├── mock-data.ts          # サンプルデータ
└── recommendation.ts     # レコメンドエンジン
```

## 🔧 開発

### ビルド
```bash
npm run build
```

### 型チェック
```bash
npm run type-check
```

### リント
```bash
npm run lint
```

## 📋 今後の開発計画

詳しくは [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) をご覧ください。

### 優先度の高いタスク
1. **地図機能実装** - Mapbox GL JS統合
2. **実データ統合** - Supabase + 実スポットデータ
3. **PWA対応** - モバイルアプリライクな体験
4. **ナビゲーション** - GPS連携リアルタイムナビ

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'Add amazing feature'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. Pull Requestを開く

## 📜 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🔗 リンク

- **本番環境**: https://buddica-road-v2.vercel.app/
- **リポジトリ**: https://github.com/m-tsurue/buddica-road-v2
- **引き継ぎガイド**: [HANDOVER_GUIDE.md](./HANDOVER_GUIDE.md)

## 📞 サポート

質問や提案がある場合は、[GitHub Issues](https://github.com/m-tsurue/buddica-road-v2/issues) にお気軽にお書きください。

---

**BUDDICA ROAD** - あなたの次のドライブを、忘れられない思い出に。