# Google Maps API 問題の解決手順

## 解決済み問題
- **問題**: Vercel本番環境で「This page can't load Google Maps correctly.」エラー
- **原因**: Vercel環境変数 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` が未設定
- **解決**: Vercelダッシュボードで環境変数を設定し、再デプロイ実行
- **確認**: https://buddica-road-v2.vercel.app/route-map で正常動作確認済み

## 解決手順（参考）

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
5. **重要**: 環境変数設定後は必ずデプロイメントの再実行が必要

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

## デバッグ方法
- ブラウザ開発者ツールのConsoleタブで以下の情報を確認:
  - `Google Maps API Key exists: true/false`
  - `API Key length: 39` (正常な場合)
- エラー詳細は地図読み込み失敗時に表示される「エラー詳細」を展開して確認

## 現在の設定状況
- **ローカル開発**: `.env.local`でAPIキー設定済み
- **Vercel本番**: 環境変数設定済み、正常動作中
- **API制限**: `https://buddica-road-v2.vercel.app/*` で設定済み
- **有効API**: Maps JavaScript API, Places API, Directions API, Geocoding API