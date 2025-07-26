'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from '@/components/SwipeCard';
import { mockSpots, Spot } from '@/lib/mock-data';
import { Car, Heart, Sparkles, Route } from 'lucide-react';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSpots, setSelectedSpots] = useState<Spot[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ページロード時にlocalStorageから状態を復元
  useEffect(() => {
    const storedSpots = localStorage.getItem('selectedSpots');
    const storedIndex = localStorage.getItem('currentIndex');
    
    if (storedSpots) {
      try {
        const spots = JSON.parse(storedSpots);
        setSelectedSpots(spots);
      } catch (error) {
        console.error('Failed to parse stored spots:', error);
      }
    }
    
    if (storedIndex) {
      try {
        const index = parseInt(storedIndex);
        setCurrentIndex(isNaN(index) ? 0 : index);
      } catch (error) {
        console.error('Failed to parse stored index:', error);
      }
    }
    
    setIsLoaded(true);
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      const spot = mockSpots[currentIndex];
      // 重複チェック: 同じIDのスポットが既に選択されていないか確認
      if (!selectedSpots.find(s => s.id === spot.id)) {
        const newSelectedSpots = [...selectedSpots, spot];
        setSelectedSpots(newSelectedSpots);
        // localStorageにも保存
        localStorage.setItem('selectedSpots', JSON.stringify(newSelectedSpots));
      }
    }

    // アニメーション完了後にcurrentIndexを更新するためのタイマー
    setTimeout(() => {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      // currentIndexもlocalStorageに保存
      localStorage.setItem('currentIndex', newIndex.toString());
    }, 300); // SwipeCardのアニメーション時間と同じ
  };

  const hasMoreSpots = currentIndex < mockSpots.length;

  // ローディング中は何も表示しない
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
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
            <h1 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
              <Car className="w-6 h-6" />
              BUDDICA ROAD
            </h1>
            
            {/* 選択済みスポット数 */}
            <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
              <Heart className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">
                {selectedSpots.length}個選択中
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* スワイプエリア */}
          <div className="flex-1">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ドライブスポットを探そう
              </h2>
              <p className="text-gray-600">
                左右にスワイプして、行きたいスポットを選んでください
              </p>
            </div>

            <div className="relative h-[600px] max-w-md mx-auto">
              {hasMoreSpots ? (
                <AnimatePresence>
                  {mockSpots.slice(currentIndex, currentIndex + 3).map((spot, index) => (
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // 選択したスポットをlocalStorageに保存
                      localStorage.setItem('selectedSpots', JSON.stringify(selectedSpots));
                      // ルート編集ページに遷移
                      window.location.href = '/route-editor';
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-medium shadow-lg flex items-center gap-2"
                  >
                    <Route className="w-5 h-5" />
                    ルートを作成する
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* 操作説明 */}
            {hasMoreSpots && (
              <div className="text-center mt-8 text-gray-600">
                <p className="mb-4">スワイプまたはボタンで選択</p>
                <div className="flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">←</span>
                    </div>
                    <span className="text-sm">スキップ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">→</span>
                    </div>
                    <span className="text-sm">行きたい！</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* サイドバー：選択済みスポット */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-500" />
                選んだスポット ({selectedSpots.length})
              </h3>
              
              {selectedSpots.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>まだスポットが選ばれていません</p>
                  <p className="text-sm">右にスワイプして追加しましょう</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  <AnimatePresence>
                    {selectedSpots.map((spot, index) => (
                      <motion.div
                        key={`selected-${spot.id}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <img
                          src={spot.images[0]}
                          alt={spot.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{spot.name}</h4>
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
    </div>
  );
}