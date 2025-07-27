'use client';

import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from '@/components/SwipeCard';
import { Spot } from '@/lib/mock-data';
import { Car, Heart, Sparkles, Route, RotateCcw } from 'lucide-react';
import { useSpotSelection } from '@/hooks/useSpotSelection';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ActionButton } from '@/components/ui/ActionButton';
import { ANIMATIONS } from '@/lib/constants';

export default function SwipePage() {
  const {
    primaryDestination,
    selectedSpots,
    currentIndex,
    recommendedSpots,
    isLoaded,
    hasMoreSpots,
    handleSwipe,
    reset,
    proceedToRouteEditor
  } = useSpotSelection();



  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
              <Car className="w-6 h-6" />
              BUDDICA ROAD
            </h1>
            
            {/* 選択済みスポット数 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                <Heart className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  {selectedSpots.length}個選択中
                </span>
              </div>
              
              {/* リセットボタン（選択したスポットがある場合のみ表示） */}
              {(selectedSpots.length > 0 || currentIndex > 0) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
                  whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
                  onClick={reset}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  title="最初からやり直す"
                >
                  <RotateCcw className="w-4 h-4 text-gray-600" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* スワイプエリア */}
          <div className="flex-1">
            <div className="text-center mb-4 sm:mb-8">
              {primaryDestination && (
                <div className="mb-2 sm:mb-4">
                  <p className="text-xs sm:text-sm text-orange-600 font-medium">
                    📍 {primaryDestination.name} をベースにレコメンド
                  </p>
                </div>
              )}
              <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                ドライブを彩るスポットを選ぼう
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                素敵な寄り道で旅をもっと特別にしませんか？
              </p>
            </div>

            <div className="relative h-[400px] sm:h-[600px] max-w-md mx-auto">
              {hasMoreSpots ? (
                <AnimatePresence>
                  {recommendedSpots.slice(currentIndex, currentIndex + 3).map((spot, index) => (
                    <SwipeCard
                      key={`${spot.id}-${currentIndex + index}`}
                      spot={spot}
                      onSwipe={handleSwipe}
                      isTop={index === 0}
                    />
                  ))}
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center bg-white rounded-3xl shadow-xl p-8"
                >
                  <Sparkles className="w-16 h-16 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">全てチェック完了！</h3>
                  <p className="text-gray-600 mb-6">
                    {selectedSpots.length}個のスポットを選びました
                  </p>
                  <div className="flex flex-col gap-4 w-full max-w-xs">
                    <ActionButton
                      onClick={proceedToRouteEditor}
                      variant="primary"
                      icon={Route}
                      className="w-full max-w-xs"
                    >
                      ルートを作成する
                    </ActionButton>
                    
                    <ActionButton
                      onClick={reset}
                      variant="secondary"
                      icon={RotateCcw}
                      className="w-full max-w-xs"
                    >
                      最初からやり直す
                    </ActionButton>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

          {/* サイドバー：選択済みスポット - モバイル最適化 */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm sticky top-20 sm:top-24">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                選んだスポット ({selectedSpots.length})
              </h3>
              
              {selectedSpots.length === 0 ? (
                <div className="text-center py-6 sm:py-12 text-gray-500">
                  <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
                  <p className="text-sm sm:text-base">まだスポットが選ばれていません</p>
                  <p className="text-xs sm:text-sm">右にスワイプして追加しましょう</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-[200px] sm:max-h-[300px] lg:max-h-[400px] overflow-y-auto">
                  <AnimatePresence>
                    {selectedSpots.map((spot, index) => (
                      <motion.div
                        key={`selected-${spot.id}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-500 rounded-md sm:rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          {index + 1}
                        </div>
                        <img
                          src={spot.images[0]}
                          alt={spot.name}
                          className="w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs sm:text-sm truncate">{spot.name}</h4>
                          <p className="text-xs text-gray-500">{spot.duration}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* スティッキーCTAボタン */}
      {selectedSpots.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 z-30">
          <div className="max-w-7xl mx-auto">
            <ActionButton
              onClick={proceedToRouteEditor}
              variant="primary"
              icon={Route}
              className="w-full"
            >
              今選んだ{selectedSpots.length}個でルート作成
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}