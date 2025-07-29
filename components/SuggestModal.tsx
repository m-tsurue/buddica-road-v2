'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Sparkles, RotateCcw } from 'lucide-react'
import SwipeCard from '@/components/SwipeCard'
import { mockSpots, Spot } from '@/lib/mock-data'
import { generateRecommendations } from '@/lib/recommendation'
import { useSpotSelection } from '@/contexts/SpotSelectionContext'
import { ANIMATIONS } from '@/lib/constants'

interface SuggestModalProps {
  isOpen: boolean
  onClose: () => void
  baseSpotId: string | null
}

export default function SuggestModal({ isOpen, onClose, baseSpotId }: SuggestModalProps) {
  const [baseSpot, setBaseSpot] = useState<Spot | null>(null)
  const [recommendedSpots, setRecommendedSpots] = useState<Spot[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const { selectedSpots, addSpot, selectedCount } = useSpotSelection()

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
      // モーダルが閉じるときは状態をリセット
      setCurrentIndex(0)
      setIsLoaded(false)
    }
    
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  useEffect(() => {
    if (baseSpotId && isOpen) {
      const foundSpot = mockSpots.find(s => s.id === baseSpotId)
      
      if (foundSpot) {
        setBaseSpot(foundSpot)
        
        // 既選択スポットを除外してレコメンド生成
        const excludeIds = selectedSpots.map(s => s.id)
        excludeIds.push(foundSpot.id) // 自分自身も除外
        
        const recommendations = generateRecommendations(foundSpot, excludeIds, 20)
        setRecommendedSpots(recommendations)
        setIsLoaded(true)
      }
    }
  }, [baseSpotId, selectedSpots, isOpen])

  const handleSwipe = (spot: Spot, liked: boolean) => {
    if (liked) {
      addSpot(spot)
    }
    setCurrentIndex(prev => prev + 1)
  }

  const reset = () => {
    setCurrentIndex(0)
  }

  const hasMoreSpots = currentIndex < recommendedSpots.length

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* バックドロップ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* 閉じるボタン（モーダル外側） */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full p-3 shadow-lg hover:bg-white transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>

        {/* モーダルコンテンツ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* ヘッダー */}
          <div className="flex-shrink-0 p-6 pb-4 bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* リセットボタン */}
                {currentIndex > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
                    whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
                    onClick={reset}
                    className="p-2 bg-white hover:bg-gray-50 rounded-full transition-colors shadow-sm"
                    title="最初からやり直す"
                  >
                    <RotateCcw className="w-4 h-4 text-gray-600" />
                  </motion.button>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-base text-black font-medium mb-2">
                🤖 追加で立ち寄れるスポット
              </p>
              <p className="text-sm text-gray-600 mb-2">
                現在のルートに合わせて最適なスポットをご提案
              </p>
              <h2 className="text-xs font-medium text-gray-900">
                {hasMoreSpots ? `${recommendedSpots.length - currentIndex}/${recommendedSpots.length}件` : '完了！'}
              </h2>
            </div>
          </div>

          {/* スワイプエリア */}
          <div className="flex-1 relative p-6 min-h-[500px]">
            
            {!isLoaded ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">おすすめスポットを探しています...</p>
                </div>
              </div>
            ) : hasMoreSpots ? (
              <div className="relative w-full h-full">
                <div className="relative w-full" style={{ height: '350px' }}>
                  <AnimatePresence>
                    {recommendedSpots.slice(currentIndex, currentIndex + 3).map((spot, index) => (
                      <div 
                        key={`${spot.id}-${currentIndex + index}`}
                        className="absolute top-0 left-0 w-full h-full"
                        style={{ zIndex: 10 - index }}
                      >
                        <SwipeCard
                          spot={spot}
                          onSwipe={handleSwipe}
                          isTop={index === 0}
                          hideActionButtons={true}
                        />
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <Sparkles className="w-16 h-16 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">全てチェック完了！</h3>
                <p className="text-gray-600 mb-6">
                  {selectedCount}個のスポットを選びました
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  ルートに戻る
                </button>
              </motion.div>
            )}
          </div>

          {/* アクションボタン - モーダル下部に独立配置 */}
          {hasMoreSpots && (
            <div className="flex-shrink-0 p-6 pt-0">
              <div className="flex justify-center gap-6">
                <motion.button
                  onClick={() => recommendedSpots[currentIndex] && handleSwipe(recommendedSpots[currentIndex], false)}
                  className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:from-red-600 hover:to-red-700"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  title="スキップ"
                >
                  <X className="w-8 h-8 text-white" />
                </motion.button>
                <motion.button
                  onClick={() => recommendedSpots[currentIndex] && handleSwipe(recommendedSpots[currentIndex], true)}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:from-green-600 hover:to-green-700"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  title="ルートに追加"
                >
                  <Heart className="w-8 h-8 text-white fill-current" />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}