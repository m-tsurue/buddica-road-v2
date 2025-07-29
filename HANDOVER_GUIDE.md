# BUDDICA ROAD - 引き継ぎガイド

## 🎯 このプロジェクトについて

**BUDDICA ROAD** は、ドライブ好きユーザー向けの「思い出作り」がテーマのルート提案アプリです。目的地を選ぶとAIがパーソナライズされたスポットを提案し、Tinderライクなスワイプで楽しく旅程を作成できます。

---

## 📋 現在の状態（2025年1月26日時点）

### ✅ 実装完了機能
- ✅ ホームページ（3つの発見方法）
- ✅ キーワード検索機能
- ✅ エリア選択機能
- ✅ 人気スポット表示
- ✅ レコメンドエンジン
- ✅ スワイプ選択画面
- ✅ ルート編集機能
- ✅ リセット・状態管理

### 🚧 実装待ち機能
- ⏳ 地図統合（最優先）
- ⏳ 実データベース（Supabase）
- ⏳ ナビゲーション機能
- ⏳ 思い出記録・共有

---

## 🚀 すぐに始められるタスク

### 1. **地図機能実装**（優先度：🔥 高）

**目的**: 「地図から選ぶ」ボタンを機能させる

**実装ステップ**:
```bash
# 1. Mapbox インストール
npm install mapbox-gl @types/mapbox-gl

# 2. 環境変数設定
# .env.local に追加
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
```

**作成ファイル**:
```typescript
// lib/map.ts
export const mapboxConfig = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [139.6917, 35.6895], // 東京
  zoom: 10
};

// components/Map.tsx  
import mapboxgl from 'mapbox-gl';
// 基本的な地図コンポーネント

// app/map/page.tsx
// 地図選択画面
```

**連携ポイント**:
- 地図でスポットを選択 → `handleDestinationSelect()` 呼び出し
- 既存のレコメンドシステムと連携

### 2. **実データ統合**（優先度：🔥 高）

**目的**: モックデータから実際の観光スポットデータへ移行

**実装ステップ**:
```bash
# 1. Supabase セットアップ
npm install @supabase/supabase-js

# 2. データベース設計
# spots テーブル作成（SQL DDL は下記参照）
```

**データベース設計**:
```sql
-- spots テーブル
CREATE TABLE spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location POINT NOT NULL,
  images TEXT[],
  tags TEXT[],
  vibes TEXT[],
  rating DECIMAL(2,1),
  reviews INTEGER,
  duration TEXT,
  best_time TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_spots_location ON spots USING GIST(location);
CREATE INDEX idx_spots_tags ON spots USING GIN(tags);
```

### 3. **PWA対応**（優先度：🟡 中）

**目的**: モバイルアプリライクな体験

**実装ステップ**:
```bash
# next-pwa インストール
npm install next-pwa

# next.config.ts に PWA 設定追加
# manifest.json 作成
# service worker 設定
```

---

## 🔧 開発環境の理解

### ディレクトリ構造
```
app/
├── page.tsx              # 🏠 ホームページ（目的地選択）
├── swipe/page.tsx        # 🎴 スワイプ選択画面  
├── route-editor/page.tsx # 🛣️ ルート編集画面
├── map/page.tsx          # 🗺️ 地図画面（未実装）
└── navigation/page.tsx   # 🧭 ナビ画面（未実装）

components/
└── SwipeCard.tsx         # メインのスワイプカード

lib/
├── mock-data.ts          # 現在のモックデータ
├── recommendation.ts     # レコメンドエンジン
├── map.ts               # 地図関連（未実装）
└── supabase.ts          # DB接続（未実装）
```

### データフロー
```
1. ホームページで目的地選択
   ↓ localStorage に保存
2. スワイプページでレコメンド表示
   ↓ 選択したスポットを追加
3. ルート編集で順序調整
   ↓ 最終ルート確定
4. （未実装）ナビゲーション開始
```

### 重要な関数
```typescript
// 目的地選択時
handleDestinationSelect(spot: Spot) // page.tsx:39

// レコメンド生成
generateRecommendations(primary, excludes, maxResults) // recommendation.ts:67

// スワイプ処理
handleSwipe(direction: 'left' | 'right') // swipe/page.tsx:69
```

---

## 🎨 デザインシステム

### カラーパレット
```css
/* メインカラー */
--orange-primary: #ea580c;    /* オレンジ600 */
--orange-secondary: #fed7aa;  /* オレンジ200 */
--orange-bg: #fff7ed;         /* オレンジ50 */

/* アクセント */
--red-accent: #dc2626;        /* レッド600 */
--green-success: #16a34a;     /* グリーン600 */
--gray-text: #6b7280;         /* グレー500 */
```

### コンポーネントパターン
```tsx
// ボタンの基本パターン
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-medium shadow-lg"
>

// カードの基本パターン  
<motion.div
  whileHover={{ scale: 1.02 }}
  className="p-6 bg-white rounded-3xl shadow-sm border-2 border-gray-200 hover:border-orange-300"
>
```

---

## 🐛 既知の課題

### 1. **地図タブの未実装**
**現状**: クリックしても「実装予定」メッセージのみ  
**対応**: 上記の地図機能実装で解決

### 2. **モックデータの制限**
**現状**: 6つのスポットのみ  
**対応**: Supabase統合で1000+スポット追加

### 3. **ナビゲーション機能なし**
**現状**: 「ナビ開始」ボタンは飾り  
**対応**: GPS + Mapbox Navigation SDK実装

### 4. **オフライン対応なし**
**現状**: ネットワーク必須  
**対応**: PWA + Service Worker実装

---

## 📚 重要な技術選択

### なぜ Next.js？
- SSR/SSG でSEO対応
- App Router で最新機能
- Vercel との親和性

### なぜ Framer Motion？
- スワイプ操作の滑らかなアニメーション
- 宣言的なアニメーション記述
- パフォーマンス最適化

### なぜ localStorage？
- 認証前のシンプルな状態管理
- ページリロード対応
- 将来的にはZustand等に移行予定

### なぜ Tailwind CSS？
- 高速な開発
- 一貫したデザインシステム
- JIT コンパイルで最適化

---

## 🔍 デバッグ・トラブルシューティング

### よくある問題

#### 1. **スワイプが効かない**
```typescript
// SwipeCard.tsx の dragConstraints を確認
dragConstraints={{ left: -300, right: 300, top: -50, bottom: 50 }}
dragElastic={0.2}
```

#### 2. **レコメンドが生成されない**
```typescript
// recommendation.ts の generateRecommendations を確認
console.log('Primary:', primaryDestination);
console.log('Recommendations:', recommendedSpots);
```

#### 3. **localStorage エラー**
```typescript
// ブラウザの開発者ツールで確認
localStorage.getItem('primaryDestination');
localStorage.getItem('selectedSpots');
```

#### 4. **ビルドエラー**
```bash
# 型エラーの場合
npm run type-check

# 依存関係の問題
rm -rf node_modules package-lock.json
npm install
```

### デバッグ用コード
```typescript
// レコメンドスコアの詳細確認
import { getRecommendationDetails } from '@/lib/recommendation';
console.log(getRecommendationDetails(primary, candidate));

// 状態確認用
console.log('Current state:', {
  currentIndex,
  selectedSpots: selectedSpots.length,
  hasMoreSpots
});
```

---

## 📞 連絡先・リソース

### 技術サポート
- **Next.js**: [公式ドキュメント](https://nextjs.org/docs)
- **Framer Motion**: [API リファレンス](https://www.framer.com/motion/)
- **Tailwind CSS**: [ユーティリティクラス](https://tailwindcss.com/docs)

### 外部サービス
- **Mapbox**: [GL JS ガイド](https://docs.mapbox.com/mapbox-gl-js/)
- **Supabase**: [Getting Started](https://supabase.com/docs)
- **Vercel**: [デプロイガイド](https://vercel.com/docs)

### コミュニティ
- **Next.js Discord**: 技術的な質問
- **Stack Overflow**: エラー解決
- **GitHub Issues**: バグ報告・機能要望

---

## 🚀 次のステップ

### 1週間以内にやること
1. **環境構築確認**: ローカルで開発サーバー起動
2. **地図機能調査**: Mapbox アカウント作成・API キー取得
3. **コードベース理解**: 主要ファイルの読み込み

### 1ヶ月以内の目標
1. **地図機能リリース**: 基本的な地図選択機能
2. **実データ統合**: 最低100スポットのデータ追加
3. **PWA対応**: モバイル体験の改善

### 3ヶ月以内の目標
1. **ナビゲーション機能**: GPS連携ナビ
2. **ユーザー認証**: アカウント・お気に入り機能
3. **思い出機能**: 写真投稿・共有システム

---

---

## 📝 最新更新情報 (2025-07-30)

### プッシュ完了アップデート
- **リポジトリ**: すべての変更が buddica-road-v2 にプッシュ済み
- **コミット状態**: 26コミットがリモートと同期完了
- **最終コミット**: SuggestModal と SwipeCard コンポーネントの最終化完了

### 今後の作業方針
1. **保守性を重視したリファクタリング** - デグレ一切なしでコード品質向上
2. **総合テスト強化** - 継続的な品質保証のためのテスト基盤構築
3. **パフォーマンス最適化** - ユーザー体験向上のための継続改善

### 開発環境確認
```bash
# ローカル開発サーバー起動確認
npm run dev

# ビルドエラーがないことを確認
npm run build

# タイプチェック実行
npm run type-check
```

---

**引き継ぎ完了日**: 2025年7月30日 03:00 JST  
**リポジトリ状態**: 完全同期済み・作業開始可能  
**次回レビュー**: リファクタリング計画策定後  
**緊急連絡**: GitHub Issues で質問・相談・コードレビュー依頼