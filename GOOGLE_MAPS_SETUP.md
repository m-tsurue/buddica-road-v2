# Google Maps API セットアップ手順

## エラー解決方法

現在のエラー: `RefererNotAllowedMapError`

### 1. Google Cloud Consoleで設定を更新

1. [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials) にアクセス
2. APIキー `AIzaSyBNppw7cFG_r5mU6qON4tv_Iw2JdLbDbog` をクリック
3. 「アプリケーションの制限」セクションで「HTTPリファラー（ウェブサイト）」を選択
4. 以下のURLを追加:
   ```
   http://localhost:3000/*
   http://localhost:3001/*
   http://localhost:3002/*
   http://localhost:3003/*
   http://localhost/*
   ```

### 2. API有効化の確認

以下のAPIが有効になっているか確認:
- Maps JavaScript API
- Places API (オプション)
- Geocoding API (オプション)

### 3. 開発環境での一時的な解決策

開発中のみ、制限なしで使用する場合:
1. 「アプリケーションの制限」を「なし」に設定
2. **重要**: 本番環境では必ず制限を設定すること

## 本番環境での設定

本番デプロイ時は以下のURLも追加:
```
https://yourdomain.com/*
https://www.yourdomain.com/*
```

## セキュリティ注意事項

- APIキーは公開リポジトリにコミットしない
- 本番環境では必ずHTTPリファラー制限を設定
- 使用量上限を設定してコスト管理を行う