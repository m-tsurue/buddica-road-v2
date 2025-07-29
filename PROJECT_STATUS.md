# ドライブルートプランニングアプリ - プロジェクト現状

## アプリ概要
Next.js 15 App Router を使用したドライブルート計画アプリ。ユーザーがスワイプでスポットを選択し、ドラッグ&ドロップでルートを編成、Mapbox で地図表示を行う。

## 技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **地図**: Mapbox GL JS v3.13.0
- **ドラッグ&ドロップ**: @dnd-kit/core
- **アイコン**: Lucide React

## 完了済み機能

### 1. SuggestModal (寄り道提案)
- **ファイル**: `/components/SuggestModal.tsx`
- **状態**: 完了
- **デザイン**: 紫グラデーション (from-purple-50 to-pink-50) で統一
- **アニメーション**: Sparkles アイコンの点滅アニメーション
- **仕様**:
  - タイトルフォントサイズ: text-3xl
  - モーダル角丸: rounded-lg
  - スワイプ説明文をカード下部に配置

### 2. SwipeCard (スワイプカード)
- **ファイル**: `/components/SwipeCard.tsx`
- **状態**: 完了
- **仕様**:
  - 4枚のカード表示に固定
  - 写真の高さ: 75-80%
  - padding-bottom: 24px (明示的に設定)
  - フォントサイズ改善済み

### 3. SpotDetailModal (スポット詳細)
- **ファイル**: `/components/SpotDetailModal.tsx`
- **状態**: 完了
- **機能**:
  - 住所表示機能追加
  - Mapbox地図統合 (200px高さ)
  - 閉じるアニメーション修正済み (条件付きレンダリング解除)

### 4. ルート画面統計エリア
- **ファイル**: `/app/route-map/page.tsx`
- **状態**: 完了
- **デザイン**: オレンジ〜アンバーグラデーション背景
- **表示項目**: 距離(km)、予想時間、"🗺️ 冒険ルート"

### 5. Mapbox地図統合
- **ファイル**: `/components/map/MapboxMap.tsx`, `/hooks/useMapbox.ts`
- **状態**: 基本機能完了
- **機能**:
  - マーカー表示とクリック
  - ポップアップ表示
  - ルート描画 (直線)
  - ナビゲーションコントロール

## 現在の問題 (優先度: 高)

### Mapbox地図の位置調整問題
- **症状**: 
  - 地図の左端と上端に16pxの余白が表示される
  - ナビゲーションコントロールが左から100px位置に表示される
  - 地図が本来のコンテナサイズより小さく表示される

- **試行した解決策** (すべて無効):
  ```css
  .mapboxgl-map {
    position: relative !important;
    left: -16px !important;
    top: -16px !important;
    width: calc(100% + 32px) !important;
    height: calc(100% + 32px) !important;
  }
  
  .mapboxgl-ctrl-top-right {
    top: 26px !important;
    right: 26px !important;
  }
  ```

- **推定原因**: 
  - Mapbox初期化時のcontainer設定に起因する可能性
  - useMapbox.ts:48-68のMap初期化オプションで padding や container 関連設定が影響している可能性

## ファイル構成

### 主要コンポーネント
```
/components/
├── SuggestModal.tsx          # 寄り道提案モーダル (完了)
├── SwipeCard.tsx            # スワイプカード (完了)
├── SpotDetailModal.tsx      # スポット詳細モーダル (完了)
└── map/
    └── MapboxMap.tsx        # Mapbox地図コンポーネント

/hooks/
└── useMapbox.ts             # Mapbox地図ロジック (位置調整要修正)

/app/
├── route-map/page.tsx       # ルート画面 (完了)
└── globals.css              # グローバルスタイル (Mapbox調整中)

/lib/
├── mock-data.ts             # モックデータ (住所追加済み)
├── constants.ts             # 定数定義
└── map-config.ts            # Mapbox設定
```

### データ構造
```typescript
interface Spot {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: { lat: number; lng: number };
  address: string;           // 住所フィールド追加済み
  tags: string[];
  rating: number;
  duration: string;
  bestTime: string;
  vibes: string[];
}
```

## 設定ファイル
- **環境変数**: `.env.local` に `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` が必要
- **Mapbox設定**: `/lib/map-config.ts` でスタイルや初期設定
- **定数**: `/lib/constants.ts` でUI/アニメーション設定

## 次の作業者への引き継ぎ事項

### 緊急対応が必要な問題
1. **Mapbox位置調整**: 16px余白問題の根本解決
   - `/hooks/useMapbox.ts` の Map初期化オプション確認
   - containerの padding/margin 設定調査
   - CSS以外のアプローチ検討

### 推奨アプローチ
1. Mapbox Mapコンストラクタのオプションを調査
2. container 要素のデフォルトスタイリングを確認
3. Mapbox GL JS公式ドキュメントでコンテナ設定を確認

### 開発環境
```bash
npm run dev        # 開発サーバー起動
npm run build      # ビルド
npm run lint       # リント実行
```

## 既知の制約事項
- モバイル対応済み (レスポンシブデザイン)
- Mapboxアカウント・アクセストークンが必要
- 現在は直線ルート描画 (道路沿いルートは未実装)
- 実際のナビゲーション連携は未実装 (アラート表示のみ)

---
---

## 🔄 最新アップデート (2025-07-30)

### 完了した作業
✅ **コードプッシュ完了**: 全ての変更をリモートリポジトリ (buddica-road-v2) にプッシュ済み
✅ **引き継ぎドキュメント更新**: メンテナビリティを考慮した詳細な技術ドキュメント整備完了

### 現在の状態
- **リポジトリ**: すべてのコミットがリモートと同期済み
- **ドキュメント**: 次の開発者が即座に作業開始できる状態
- **技術負債**: 体系的なリファクタリング計画策定中

### 今後の優先事項
1. **保守性重視のリファクタリング** - コードの可読性・拡張性の向上
2. **テストカバレッジ向上** - 回帰テスト防止のための自動テスト導入
3. **パフォーマンス最適化** - Core Web Vitals改善

---
*最終更新: 2025-07-30 03:00 JST*
*更新者: Claude (Sonnet 4)*
*次の作業: リファクタリング計画の実行*