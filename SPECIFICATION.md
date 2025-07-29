# Drive Memory App 仕様書（引き継ぎ用）

## 概要
関東エリアを中心としたドライブスポット発見・ルート作成アプリ。Google Maps APIを活用したルート表示機能を持つNext.js 15アプリケーション。

## 技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **地図**: Google Maps API (@react-google-maps/api)
- **ドラッグ&ドロップ**: @dnd-kit/core
- **アイコン**: Lucide React
- **状態管理**: React Context API + localStorage

## 主要機能

### 1. ホーム画面
- **エリア選択**: 現在地から50km/100km、南関東、北関東、中部、関西
- **スポット一覧**: モダンなカードデザインで表示
- **検索機能**: キーワード検索とエリアフィルタリング
- **スポット選択**: 最大10箇所まで選択可能

### 2. ルート画面 (`/route-map`)
- **地図表示**: Google Maps with Directions API
- **地図展開機能**: 右上トグルボタンで288px ↔ 60vh切り替え
- **出発地・到着地設定**: LocationActionSheetによる設定・削除
- **スポット並び替え**: ドラッグ&ドロップによる3列グリッドレイアウト
- **ルート計算**: 実際の道路に沿った距離・時間表示
- **統計表示**: 距離と時間をグラデーションカードで表示

### 3. 検索機能 (`/search`)
- **位置設定モード**: URLパラメータ(`mode=location&type=start/end`)で動作切り替え
- **Google Places API**: リアルタイム検索
- **動作分岐**: 
  - 通常モード: スポットをルートに追加
  - 位置設定モード: 出発地/到着地として設定

### 4. レコメンド画面 (`/recommendations`)
- **エリア別表示**: 選択されたエリアのスポット一覧
- **カテゴリフィルタ**: 自然・景色、歴史・文化、グルメ、ショッピング、アクティビティ
- **スポット管理**: 追加・削除の状態管理

## データ構造

### Spot Interface
```typescript
interface Spot {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: { lat: number; lng: number; };
  address: string;
  tags: string[];
  bestTime: string;
  duration: string;
  rating: number;
  reviews: number;
  vibes: string[];
}
```

### Location Interface
```typescript
interface Location {
  name: string;
  address: string;
  lat: number;
  lng: number;
}
```

## 重要コンポーネント

### 1. SpotSelectionContext
- **状態管理**: 選択スポット、出発地、到着地
- **永続化**: localStorage使用
- **主要メソッド**: 
  - `addSpot()`, `removeSpot()`, `reorderSpots()`
  - `setStartLocation()`, `setEndLocation()`
  - `clearStartLocation()`, `clearEndLocation()`
  - `getCurrentLocation()`

### 2. GoogleMap Component
- **ルート表示**: Directions APIによる実際の道路ルート
- **マーカー**: 出発地(緑・出)、到着地(赤・着)、スポット(番号付き)
- **インタラクション**: `gestureHandling: 'greedy'`でシングルタッチドラッグ
- **条件**: `spots.length > 1 || (startLocation && endLocation)`でルート表示

### 3. LocationActionSheet
- **機能**: 現在地設定、場所検索、削除
- **削除UI**: 設定済み地点情報の右上に小さなゴミ箱ボタン
- **ナビゲーション**: 検索モードでの適切なURL生成

### 4. SortableSpotItem
- **デザイン**: 3列グリッドレイアウト
- **ドラッグハンドル**: 左上に常時表示（2個以上の時）
- **視覚フィードバック**: ホバー・ドラッグ時のアニメーション

## UI/UXの特徴

### デザインシステム
- **カラーパレット**: オレンジ-赤グラデーション、緑(出発)、赤(到着)
- **角丸**: `rounded-2xl`中心のモダンデザイン
- **アニメーション**: Framer Motionによる滑らかな遷移
- **レスポンシブ**: スマートフォン最適化

### インタラクション
- **ホバー効果**: `scale: 1.02`等の微細な変化
- **タップフィードバック**: `scale: 0.98`
- **ドラッグ操作**: 直感的なハンドル配置と説明

## 設定・環境
- **Google Maps API Key**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - ローカル開発: `.env.local`で設定
  - Vercel本番: Environment Variablesで設定済み
  - API制限: `https://buddica-road-v2.vercel.app/*`
  - 有効API: Maps JavaScript API, Places API, Directions API, Geocoding API
- **開発サーバー**: `npm run dev --turbopack`
- **ポート**: デフォルト3000、競合時は3001使用
- **本番URL**: https://buddica-road-v2.vercel.app/

---

# 今後の開発テーマ

## 🔥 優先度：高

### 1. バックエンド・データベース統合
- **Supabase/Firebase導入**: ユーザーデータの永続化
- **ユーザー認証**: ソーシャルログイン対応
- **スポットデータAPI**: 実際のスポット情報取得
- **お気に入り機能**: クラウド同期対応

### 2. 地図機能の強化
- **リアルタイム交通情報**: 渋滞を考慮したルート
- **代替ルート提案**: 複数ルートの比較表示
- **ガソリンスタンド情報**: ルート上のスタンド表示
- **駐車場情報**: スポット周辺の駐車場検索

### 3. スポット情報の充実
- **写真ギャラリー**: 複数写真のスワイプ表示
- **口コミ・レビュー**: ユーザー投稿機能
- **営業時間・料金**: リアルタイム情報
- **混雑状況**: Google Places APIの混雑度

## 🚀 優先度：中

### 4. ドライブ体験の向上
- **音声ナビゲーション**: Web Speech API活用
- **オフラインマップ**: PWA対応でオフライン使用
- **ドライブ記録**: 走行履歴とフォトアルバム
- **天気情報**: 各スポットの天気予報表示

### 5. ソーシャル機能
- **ルート共有**: SNS連携・QRコード生成
- **グループプラン**: 複数人でのルート作成
- **コミュニティ**: ユーザー投稿のスポット情報
- **ランキング**: 人気スポット・ルートランキング

### 6. パーソナライゼーション
- **AIレコメンド**: 過去の行動からの提案
- **季節連動**: 季節に応じたスポット推薦
- **時間帯最適化**: 交通状況を考慮した出発時間提案
- **予算設定**: コスト考慮のルート作成

## 🎯 優先度：低

### 7. 高度な機能
- **AR機能**: カメラでスポット情報表示
- **IoT連携**: 車載デバイスとの連携
- **決済連携**: スポットでの事前決済
- **多言語対応**: 国際観光客向け

### 8. 運営・分析
- **管理画面**: スポット情報管理
- **分析ダッシュボード**: ユーザー行動分析
- **A/Bテスト**: UI改善のための実験
- **パフォーマンス最適化**: Core Web Vitals向上

### 9. プラットフォーム拡張
- **React Native**: iOS/Androidアプリ化
- **デスクトップ版**: Electron使用
- **Apple CarPlay/Android Auto**: 車載対応
- **スマートウォッチ**: 簡易操作対応

---

## 技術的な改善点

### パフォーマンス
- **画像最適化**: Next.js Image最適化
- **コード分割**: 動的インポート活用
- **キャッシュ戦略**: SWRまたはReact Query導入
- **バンドルサイズ**: 不要ライブラリの除去

### 開発体験
- **テスト**: Jest + React Testing Library
- **CI/CD**: GitHub Actions設定
- **型安全性**: より厳密なTypeScript設定
- **ドキュメント**: Storybook導入

### セキュリティ・品質
- **エラーハンドリング**: エラー境界とログ収集
- **アクセシビリティ**: WCAG準拠
- **SEO最適化**: メタデータとサイトマップ
- **セキュリティ**: CSP、CORS設定

---

## 最近の対応履歴

### Google Maps API設定問題の解決 (2024年)
- **問題**: Vercel本番環境で「This page can't load Google Maps correctly.」エラー
- **原因**: 環境変数 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` がVercelで未設定
- **解決**: Vercel Dashboardで環境変数を設定し、再デプロイ実行
- **確認**: https://buddica-road-v2.vercel.app/route-map で正常動作確認済み

### UI/UX改善対応
- 出発地・到着地ボックスの高さ調整（コンパクト化）
- 地図の展開機能追加（288px ↔ 60vh）
- シングルタッチでの地図ドラッグ対応
- 削除機能の追加（出発地・到着地の右上にゴミ箱ボタン）
- 検索機能の改善（位置設定モードとルート追加モードの分離）
- ドラッグ&ドロップのUI改善（3列グリッド、説明テキスト）

### コードベース管理
- Git push先をorigin-v2に修正
- 包括的な仕様書とデバッグガイドの作成
- AI引き継ぎ用ドキュメントの整備

この仕様書をベースに、次の開発者が効率的に開発を継続できます。