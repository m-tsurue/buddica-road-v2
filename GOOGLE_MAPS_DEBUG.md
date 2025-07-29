# Google Maps API 問題の解決手順

## 現在の問題
- Vercel本番環境で「This page can't load Google Maps correctly.」エラー
- ローカル環境では動作している
- API制限は `https://buddica-road-v2.vercel.app/*` で設定済み

## 解決手順

### 1. Vercelの環境変数を確認・設定
```bash
# Vercel CLIでの設定
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# 値: AIzaSyBNppw7cFG_r5mU6qON4tv_Iw2JdLbDbog
```

または Vercel Dashboard で:
1. プロジェクト設定 → Environment Variables
2. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` を追加
3. 値: `AIzaSyBNppw7cFG_r5mU6qON4tv_Iw2JdLbDbog`
4. Production, Preview, Development 全てにチェック

### 2. Google Cloud Console でAPI制限を確認
- Google Cloud Console → APIs & Services → Credentials
- APIキーの制限を確認:
  - **HTTP リファラー**: `https://buddica-road-v2.vercel.app/*`
  - **API制限**: Maps JavaScript API, Places API, Directions APIが有効

### 3. 必要なAPIが有効化されているか確認
以下のAPIが有効である必要があります:
- Maps JavaScript API
- Places API  
- Directions API
- Geocoding API

### 4. デバッグ用のエラー情報を追加
ブラウザの開発者ツールでコンソールエラーを確認し、具体的なエラーメッセージを特定する。

### 5. APIキーの形式確認
- APIキーが正しく39文字であることを確認
- 不正な文字や改行が含まれていないことを確認

## トラブルシューティング
1. **環境変数が読み込まれない**: Vercel再デプロイが必要
2. **API制限エラー**: Google Cloud Consoleでリファラー設定を確認  
3. **API無効エラー**: 必要なAPIが有効化されているか確認
4. **課金エラー**: Google Cloudで課金アカウントが設定されているか確認