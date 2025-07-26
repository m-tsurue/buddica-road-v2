'use client';

import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Route, Play, Download, Share2, RotateCcw } from 'lucide-react';
import { Spot } from '@/lib/mock-data';
import Link from 'next/link';
import { useRouteEditor } from '@/hooks/useRouteEditor';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ActionButton } from '@/components/ui/ActionButton';
import { ANIMATIONS, ROUTES } from '@/lib/constants';

export default function RouteEditor() {
  const {
    selectedSpots,
    isLoading,
    totalDuration,
    estimatedDriveTime,
    hasSpots,
    reorderSpots,
    resetAll,
    startNavigation,
    saveRoute,
    shareRoute
  } = useRouteEditor();

  if (isLoading) {
    return <LoadingSpinner message="ルートを読み込み中..." />;
  }

  if (!hasSpots) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">スポットが選択されていません</h2>
          <p className="text-gray-600 mb-6">まずはスポットを選んでからルートを作成しましょう</p>
          <Link href={ROUTES.HOME}>
            <ActionButton variant="primary" onClick={() => {}}>
              スポット選択に戻る
            </ActionButton>
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
              <Link href={ROUTES.HOME}>
                <motion.button
                  whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
                  whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">ルート編集</h1>
              
              {/* 最初からやり直すボタン */}
              <motion.button
                whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
                whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
                onClick={resetAll}
                className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                title="最初からやり直す"
              >
                <RotateCcw className="w-5 h-5 text-red-600" />
              </motion.button>
            </div>
            
            <div className="flex items-center gap-2">
              <ActionButton
                onClick={startNavigation}
                variant="primary"
                size="sm"
                icon={Play}
              >
                ナビ開始
              </ActionButton>
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
                  <div className="text-2xl font-bold text-green-600">{estimatedDriveTime}時間</div>
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
                onReorder={reorderSpots}
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
                        whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
                        whileDrag={{ scale: ANIMATIONS.SCALE_HOVER, zIndex: 50 }}
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
              
              <ActionButton
                onClick={startNavigation}
                variant="primary"
                icon={Play}
                className="w-full"
              >
                ナビゲーション開始
              </ActionButton>
              
              <ActionButton
                onClick={saveRoute}
                variant="secondary"
                icon={Download}
                className="w-full"
              >
                ルートを保存
              </ActionButton>
              
              <ActionButton
                onClick={shareRoute}
                variant="outline"
                icon={Share2}
                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200 hover:border-blue-300"
              >
                ルートを共有
              </ActionButton>
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