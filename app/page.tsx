'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from '@/components/SwipeCard';
import RouteEditor from '@/components/RouteEditor';
import MapView from '@/components/MapView';
import { mockSpots, Spot } from '@/lib/mock-data';
import { Car, Map, Sparkles, Heart, X } from 'lucide-react';

export default function Home() {
  const [mode, setMode] = useState<'swipe' | 'route' | 'map'>('swipe');
  const [availableSpots, setAvailableSpots] = useState<Spot[]>(mockSpots);
  const [selectedSpots, setSelectedSpots] = useState<Spot[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // ウェルカムアニメーションを3秒後に消す
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      const spot = availableSpots[currentIndex];
      setSelectedSpots([...selectedSpots, spot]);
      
      // いいねアニメーション
      const event = new CustomEvent('spotLiked', { detail: { spot } });
      window.dispatchEvent(event);
    }

    setCurrentIndex(currentIndex + 1);

    // 全てスワイプし終わったら自動的にルート編集モードへ
    if (currentIndex >= availableSpots.length - 1) {
      setTimeout(() => setMode('route'), 1000);
    }
  };

  const handleRemoveSpot = (id: string) => {
    setSelectedSpots(selectedSpots.filter(spot => spot.id !== id));
  };

  const handleReorderSpots = (newSpots: Spot[]) => {
    setSelectedSpots(newSpots);
  };

  const handleStartDrive = () => {
    // ここでナビゲーション開始の処理
    setMode('map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* ウェルカムアニメーション */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-600 to-red-600"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-center text-white"
            >
              <Car className="w-24 h-24 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">BUDDICA ROAD</h1>
              <p className="text-xl">最高のドライブ体験を</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Car className="w-6 h-6" />
              BUDDICA ROAD
            </h1>
            
            {/* モード切り替えタブ */}
            <div className="flex gap-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setMode('swipe')}
                className={`px-4 py-2 rounded-full transition-all ${
                  mode === 'swipe' 
                    ? 'bg-white shadow-sm font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  探す
                </span>
              </button>
              <button
                onClick={() => setMode('route')}
                className={`px-4 py-2 rounded-full transition-all ${
                  mode === 'route' 
                    ? 'bg-white shadow-sm font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  ルート
                </span>
              </button>
              <button
                onClick={() => setMode('map')}
                className={`px-4 py-2 rounded-full transition-all ${
                  mode === 'map' 
                    ? 'bg-white shadow-sm font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  地図
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {mode === 'swipe' && (
            <motion.div
              key="swipe"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              {/* スワイプエリア */}
              <div className="flex-1">
                <div className="relative h-[600px] max-w-md mx-auto">
                  {currentIndex < availableSpots.length ? (
                    <AnimatePresence>
                      {availableSpots.slice(currentIndex, currentIndex + 3).map((spot, index) => (
                        <SwipeCard
                          key={spot.id}
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
                      className="flex flex-col items-center justify-center h-full text-center"
                    >
                      <Sparkles className="w-16 h-16 text-orange-500 mb-4" />
                      <h2 className="text-2xl font-bold mb-2">全てチェック完了！</h2>
                      <p className="text-gray-600 mb-6">
                        {selectedSpots.length}個のスポットを選びました
                      </p>
                      <button
                        onClick={() => setMode('route')}
                        className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-medium shadow-lg"
                      >
                        ルートを作成する
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* スワイプ説明 */}
                {currentIndex < availableSpots.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-8 text-gray-600"
                  >
                    <p className="mb-2">左右にスワイプして選んでください</p>
                    <div className="flex items-center justify-center gap-8">
                      <span className="flex items-center gap-2">
                        <X className="w-5 h-5 text-red-500" />
                        スキップ
                      </span>
                      <span className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-green-500" />
                        行きたい！
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* サイドバー：選択済みスポット */}
              <div className="w-full lg:w-96">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-orange-500" />
                    選んだスポット ({selectedSpots.length})
                  </h2>
                  
                  {selectedSpots.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      まだスポットが選ばれていません
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      <AnimatePresence>
                        {selectedSpots.map((spot, index) => (
                          <motion.div
                            key={spot.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={spot.images[0]}
                              alt={spot.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">{spot.name}</h3>
                              <p className="text-xs text-gray-500">{spot.duration}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'route' && (
            <motion.div
              key="route"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-6">ドライブルートを編集</h2>
                <RouteEditor
                  spots={selectedSpots}
                  onRemoveSpot={handleRemoveSpot}
                  onReorderSpots={handleReorderSpots}
                  onStartDrive={handleStartDrive}
                />
              </div>
              
              {/* 地図プレビュー */}
              <div className="w-full lg:w-[500px] h-[600px]">
                <MapView spots={selectedSpots} className="w-full h-full" />
              </div>
            </motion.div>
          )}

          {mode === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-[calc(100vh-200px)]"
            >
              <MapView spots={selectedSpots} className="w-full h-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* いいねアニメーション */}
      <AnimatePresence>
        {typeof window !== 'undefined' && (
          <LikeAnimation />
        )}
      </AnimatePresence>
    </div>
  );
}

// いいねアニメーションコンポーネント
function LikeAnimation() {
  const [likes, setLikes] = useState<{ id: number; spot: Spot }[]>([]);

  useEffect(() => {
    const handleLike = (e: Event) => {
      const event = e as CustomEvent<{ spot: Spot }>;
      const newLike = { id: Date.now(), spot: event.detail.spot };
      setLikes(prev => [...prev, newLike]);
      
      // 3秒後に削除
      setTimeout(() => {
        setLikes(prev => prev.filter(like => like.id !== newLike.id));
      }, 3000);
    };

    window.addEventListener('spotLiked', handleLike);
    return () => window.removeEventListener('spotLiked', handleLike);
  }, []);

  return (
    <>
      {likes.map(like => (
        <motion.div
          key={like.id}
          initial={{ opacity: 0, scale: 0.5, x: '-50%', y: 20 }}
          animate={{ opacity: 1, scale: 1, x: '-50%', y: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: '-50%', y: -20 }}
          className="fixed bottom-8 left-1/2 z-50 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
        >
          <Heart className="w-5 h-5 text-orange-500 fill-current" />
          <span className="font-medium">{like.spot.name}を追加！</span>
        </motion.div>
      ))}
    </>
  );
}