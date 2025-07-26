# BUDDICA ROAD - 開発ロードマップ

## 📋 プロジェクト概要
**BUDDICA ROAD**は「思い出作り」をテーマにしたドライブルート提案アプリです。ユーザーが目的地を選択すると、AIがパーソナライズされたスポットをレコメンドし、Tinderライクなスワイプ操作で楽しく旅程を作成できます。

---

## 🎯 現在の実装状況（v2.0）

### ✅ 完成済み機能

#### 🏠 **ホームページ（目的地選択）**
- 3つの発見方法：検索・エリア・人気スポット
- リアルタイムキーワード検索（300ms debounce）
- カテゴリボタンによるクイック検索
- おすすめエリアクリック機能
- 人気スポットランキング表示

#### 🧠 **レコメンドエンジン**
- 距離ベース重み付け（40%）
- タグ類似度マッチング（25%）
- vibes類似度マッチング（20%）
- 評価スコア考慮（15%）
- 最大10件のパーソナライズ提案

#### 🎴 **スワイプ選択画面**
- Tinderライクなカード操作
- アニメーション付きドラッグ&ドロップ
- 選択済みスポットリアルタイム表示
- 状態管理（localStorage使用）

#### 🛣️ **ルート編集機能**
- ドラッグ&ドロップによる順序変更
- ルート統計自動計算（時間・距離）
- アクションボタン（ナビ・保存・共有）
- おすすめタイミング表示

#### 🔄 **共通機能**
- 完全なリセット機能
- ページ間の状態保持
- レスポンシブデザイン
- エラーハンドリング

---

## 🚀 開発フェーズ計画

### 📅 **フェーズ3: 地図・ナビゲーション（優先度：高）**

#### 3.1 地図機能実装
- [ ] **Mapbox GL JS統合**
  - ファイル: `/lib/map.ts`, `/components/Map.tsx`
  - 必要ライブラリ: `mapbox-gl`, `@types/mapbox-gl`
  - 実装内容：
    - インタラクティブ地図表示
    - スポットピン表示・クリック
    - 現在地取得・表示
    - ルート線描画

- [ ] **地図からのスポット選択**
  - ファイル: `/app/map/page.tsx`
  - 実装内容：
    - ピンクリックで詳細ポップアップ
    - カテゴリ別ピンカラー分け
    - 地図移動に応じたスポット密度調整
    - 選択したスポットをレコメンドエンジンに連携

#### 3.2 ナビゲーション機能
- [ ] **リアルタイムナビ**
  - ファイル: `/app/navigation/page.tsx`
  - 実装内容：
    - GPS追跡による現在位置更新
    - 次の目的地への方向指示
    - 到着通知・次スポット案内
    - オフライン地図対応（PWA）

**推定工数**: 3-4週間  
**必要API**: Mapbox API, Geolocation API

### 📅 **フェーズ4: データ・認証（優先度：中）**

#### 4.1 データベース統合
- [ ] **Supabase統合**
  - ファイル: `/lib/supabase.ts`, `/lib/database.ts`
  - 実装内容：
    - 実スポットデータ（1000+件）
    - 画像・口コミ管理
    - カテゴリ・タグ管理
    - 検索インデックス最適化

- [ ] **ユーザー認証**
  - ファイル: `/app/auth/`, `/components/AuthProvider.tsx`
  - 実装内容：
    - SNSログイン（Google, Apple）
    - ゲストモード継続利用
    - プロフィール管理

#### 4.2 外部API統合
- [ ] **Google Places API**
  - ファイル: `/lib/places.ts`
  - 実装内容：
    - リアルタイム営業時間
    - 最新口コミ・写真
    - 周辺施設情報

**推定工数**: 2-3週間  
**必要API**: Supabase, Google Places API

### 📅 **フェーズ5: ソーシャル・思い出（優先度：中）**

#### 5.1 思い出記録機能
- [ ] **ドライブ記録**
  - ファイル: `/app/memories/`, `/components/MemoryCard.tsx`
  - 実装内容：
    - 写真アップロード・位置情報付き
    - 訪問日時・感想記録
    - ルート軌跡保存
    - プライベート・公開設定

- [ ] **共有機能**
  - ファイル: `/lib/sharing.ts`
  - 実装内容：
    - SNS投稿（Twitter, Instagram）
    - ルートURL生成・共有
    - QRコード生成
    - 友達招待システム

**推定工数**: 2-3週間

### 📅 **フェーズ6: AI・パーソナライゼーション（優先度：低）**

#### 6.1 高度なレコメンド
- [ ] **機械学習モデル**
  - ファイル: `/lib/ml-recommendations.ts`
  - 実装内容：
    - ユーザー行動学習
    - 季節・天気考慮
    - 混雑状況予測
    - 協調フィルタリング

#### 6.2 チャットボット
- [ ] **AI旅行アシスタント**
  - ファイル: `/components/ChatBot.tsx`
  - 実装内容：
    - 自然言語での旅行相談
    - リアルタイム提案
    - 多言語対応

**推定工数**: 4-5週間  
**必要API**: OpenAI API, Azure Cognitive Services

---

## 🏗️ 技術スタック

### 現在使用中
```
フロントエンド: Next.js 15, TypeScript, Tailwind CSS
アニメーション: Framer Motion
アイコン: Lucide React
デプロイ: Vercel
リポジトリ: GitHub
```

### 追加予定
```
地図: Mapbox GL JS
データベース: Supabase
認証: Supabase Auth
画像: Cloudinary / Supabase Storage
外部API: Google Places API
PWA: Next.js PWA
機械学習: TensorFlow.js (将来)
```

---

## 📁 プロジェクト構造

```
buddica-road/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # ホームページ（目的地選択）
│   ├── swipe/page.tsx           # スワイプ選択画面
│   ├── route-editor/page.tsx    # ルート編集画面
│   ├── map/page.tsx             # 地図選択画面（未実装）
│   ├── navigation/page.tsx      # ナビゲーション画面（未実装）
│   ├── memories/page.tsx        # 思い出記録画面（未実装）
│   └── auth/                    # 認証関連（未実装）
├── components/                   # 再利用可能コンポーネント
│   ├── SwipeCard.tsx            # スワイプカード
│   ├── Map.tsx                  # 地図コンポーネント（未実装）
│   └── AuthProvider.tsx        # 認証プロバイダー（未実装）
├── lib/                         # ユーティリティ・ロジック
│   ├── mock-data.ts             # モックデータ
│   ├── recommendation.ts        # レコメンドエンジン
│   ├── map.ts                   # 地図関連（未実装）
│   ├── supabase.ts              # データベース（未実装）
│   └── sharing.ts               # 共有機能（未実装）
├── docs/                        # ドキュメント
│   ├── user-stories-v2.md       # ユーザーストーリー
│   ├── DEVELOPMENT_ROADMAP.md   # このファイル
│   └── API_DOCUMENTATION.md     # API仕様（未作成）
└── public/                      # 静的ファイル
```

---

## 🔧 開発環境セットアップ

### 必要環境
```bash
Node.js: 18.0+
npm: 9.0+
Git: 2.30+
```

### 初期セットアップ
```bash
# リポジトリクローン
git clone https://github.com/m-tsurue/buddica-road-v2.git
cd buddica-road-v2

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド確認
npm run build
```

### 環境変数（将来必要）
```env
# .env.local
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GOOGLE_PLACES_API_KEY=your_google_places_key
OPENAI_API_KEY=your_openai_key
```

---

## 📋 開発ガイドライン

### コーディング規約
- **TypeScript**: 厳密な型定義を使用
- **コンポーネント**: 関数コンポーネント + hooks
- **スタイル**: Tailwind CSS class名使用
- **アニメーション**: Framer Motion推奨
- **状態管理**: useState + localStorage（認証後はZustand検討）

### Git Flow
```bash
# 機能開発
git checkout -b feature/map-integration
git commit -m "Add Mapbox integration"
git push origin feature/map-integration

# プルリクエスト作成・レビュー後マージ
# main ブランチで本番デプロイ自動実行
```

### テスト方針
- **単体テスト**: Jest + React Testing Library
- **E2Eテスト**: Playwright（フェーズ4で導入）
- **手動テスト**: 各デバイス・ブラウザ確認

---

## 🚨 技術的注意点

### 1. **パフォーマンス**
- 画像最適化（Next.js Image）必須
- レコメンドエンジンの最適化
- 地図タイル読み込み最適化

### 2. **セキュリティ**
- API キーの環境変数管理
- XSS対策（user-generated content）
- 位置情報の適切な処理

### 3. **アクセシビリティ**
- キーボードナビゲーション
- スクリーンリーダー対応
- カラーコントラスト確保

### 4. **モバイル最適化**
- タッチジェスチャー
- オフライン対応
- バッテリー消費最適化

---

## 📈 KPI・測定指標

### ユーザー体験指標
- **コンバージョン率**: 目的地選択→ルート完成
- **エンゲージメント**: スワイプ回数・選択率
- **リテンション**: 7日後・30日後利用率

### 技術指標
- **Core Web Vitals**: LCP, FID, CLS
- **アプリサイズ**: バンドルサイズ最適化
- **API レスポンス時間**: 地図・検索性能

---

## 🎯 リリース計画

### v2.1 - 地図機能（2025年3月予定）
- Mapbox統合
- 地図からのスポット選択
- 基本ナビゲーション

### v2.2 - データ統合（2025年4月予定）
- Supabase統合
- 実データ1000+件
- ユーザー認証

### v2.3 - ソーシャル機能（2025年5月予定）
- 思い出記録
- 共有機能
- PWA対応

### v3.0 - AI強化（2025年夏予定）
- 機械学習レコメンド
- チャットボット
- 多言語対応

---

## 📞 引き継ぎ情報

### 主要な設計判断
1. **目的地ベースレコメンド**: ランダムスワイプより意図的な旅行体験
2. **レコメンドアルゴリズム**: 距離・類似度・評価の重み付け平均
3. **状態管理**: localStorage使用（認証前）
4. **アニメーション**: ユーザー体験重視のインタラクション

### 開発上の課題
- **地図API選択**: Mapbox vs Google Maps（コスト・機能比較必要）
- **画像最適化**: CDN選択とリサイズ戦略
- **オフライン対応**: PWA + サービスワーカー設計

### 参考資料
- [Mapbox GL JS ドキュメント](https://docs.mapbox.com/mapbox-gl-js/)
- [Supabase ドキュメント](https://supabase.com/docs)
- [Next.js PWA ガイド](https://github.com/shadowwalker/next-pwa)

---

**最終更新**: 2025年1月26日  
**現在のバージョン**: v2.0  
**本番URL**: https://buddica-road-v2.vercel.app/