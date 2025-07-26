'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Route, Play, Download, Share2 } from 'lucide-react';
import { Spot } from '@/lib/mock-data';
import Link from 'next/link';

export default function RouteEditor() {
  const [selectedSpots, setSelectedSpots] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorageから選択されたスポットを取得
    const storedSpots = localStorage.getItem('selectedSpots');
    if (storedSpots) {
      try {
        const spots = JSON.parse(storedSpots);
        setSelectedSpots(spots);
      } catch (error) {
        console.error('Failed to parse stored spots:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const totalDuration = selectedSpots.reduce((total, spot) => {
    const hours = parseInt(spot.duration);
    return total + (isNaN(hours) ? 1 : hours);
  }, 0);

  const estimatedDriveTime = selectedSpots.length * 0.5; // 仮の移動時間

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">ルートを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (selectedSpots.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">スポットが選択されていません</h2>
          <p className="text-gray-600 mb-6">まずはスポットを選んでからルートを作成しましょう</p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-medium shadow-lg"
            >
              スポット選択に戻る
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">ルート編集</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-orange-600 text-white rounded-full font-medium flex items-center gap-2 shadow-lg"
              >
                <Play className="w-4 h-4" />
                ナビ開始
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ルート情報 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Route className="w-6 h-6 text-orange-500" />
                あなたのドライブルート
              </h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">{selectedSpots.length}</div>
                  <div className="text-sm text-gray-600">スポット</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{totalDuration}時間</div>
                  <div className="text-sm text-gray-600">滞在時間</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{Math.round(estimatedDriveTime * 2) / 2}時間</div>
                  <div className="text-sm text-gray-600">移動時間</div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                スポットをドラッグして順番を変更できます。最適なルートになるよう調整してみてください。
              </p>
            </div>

            {/* ドラッグ可能なスポットリスト */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">スポット順序</h3>
              
              <Reorder.Group
                axis="y"
                values={selectedSpots}
                onReorder={setSelectedSpots}
                className="space-y-3"
              >
                <AnimatePresence>
                  {selectedSpots.map((spot, index) => (
                    <Reorder.Item
                      key={spot.id}
                      value={spot}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                        whileDrag={{ scale: 1.05, zIndex: 50 }}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-transparent hover:border-orange-200 transition-all"
                      >
                        {/* 順番番号 */}
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>

                        {/* スポット画像 */}
                        <img
                          src={spot.images[0]}
                          alt={spot.name}
                          className="w-16 h-16 rounded-xl object-cover shadow-md"
                        />

                        {/* スポット情報 */}
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900">{spot.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{spot.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{spot.bestTime}</span>
                            </div>
                          </div>
                          
                          {/* タグ */}
                          <div className="flex gap-2 mt-2">
                            {spot.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* ドラッグハンドル */}
                        <div className="flex flex-col gap-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </div>
          </div>

          {/* アクションパネル */}
          <div className="space-y-6">
            {/* 地図プレビュー */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">ルートプレビュー</h3>
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">地図表示準備中</p>
                  <p className="text-xs">次のアップデートで追加予定</p>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold">アクション</h3>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-medium shadow-lg flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                ナビゲーション開始
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                ルートを保存
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                ルートを共有
              </motion.button>
            </div>

            {/* おすすめタイミング */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <h3 className="text-lg font-bold text-orange-800 mb-3">💡 おすすめ</h3>
              <p className="text-sm text-orange-700 mb-3">
                現在のルートなら午前10時出発がベスト！各スポットの最適時間に合わせて計算しました。
              </p>
              <div className="text-xs text-orange-600">
                🌅 10:00 出発 → 🌅 11:00 江の島 → 🍽️ 13:00 ランチ → 🎨 15:00 箱根
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}