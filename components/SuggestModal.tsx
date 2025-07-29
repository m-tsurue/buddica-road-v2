'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Sparkles, RotateCcw } from 'lucide-react'
import SwipeCard from '@/components/SwipeCard'
import SpotDetailModal from '@/components/SpotDetailModal'
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
  const [selectedSpotForDetail, setSelectedSpotForDetail] = useState<Spot | null>(null)
  
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
          className="relative bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* ヘッダー */}
          <div className="flex-shrink-0 bg-gradient-to-br from-purple-50 to-pink-50" style={{ paddingTop: '12px' }}>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900">
                  寄り道提案
                </h1>
                <div className="inline-flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-purple-700">
                    {hasMoreSpots ? `${recommendedSpots.length - currentIndex}/${recommendedSpots.length}件` : '完了！'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* スワイプエリア */}
          <div className="flex-1 relative px-4 pb-4" style={{ paddingTop: '16px' }}>
            
            {!isLoaded ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">おすすめスポットを探しています...</p>
                </div>
              </div>
            ) : hasMoreSpots ? (
              <div className="relative w-full h-full">
                {/* スワイプインストラクション - 控えめに */}
                <div className="flex justify-center mb-3">
                  <span className="text-sm text-gray-500">
                    ← スワイプして選択 →
                  </span>
                </div>
                
                <div className="relative w-full" style={{ height: '380px' }}>
                  <AnimatePresence>
                    {recommendedSpots.slice(currentIndex, currentIndex + 3).map((spot, index) => (
                      <div 
                        key={`${spot.id}-${currentIndex + index}`}
                        className="absolute top-0 left-0 w-full"
                        style={{ zIndex: 10 - index, height: '380px' }}
                      >
                        <SwipeCard
                          spot={spot}
                          onSwipe={handleSwipe}
                          isTop={index === 0}
                          hideActionButtons={true}
                          onCardClick={setSelectedSpotForDetail}
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
                <Sparkles className="w-16 h-16 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">全てチェック完了！</h3>
                <p className="text-gray-600 mb-6">
                  {selectedCount}個のスポットを選びました
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  ルートに戻る
                </button>
              </motion.div>
            )}
          </div>

          {/* アクションボタン - モーダル下部に独立配置 */}
          {hasMoreSpots && (
            <div className="flex-shrink-0 px-4 pb-3 pt-4">
              <div className="flex justify-center gap-8">
                <div className="flex flex-col items-center">
                  <motion.button
                    onClick={() => recommendedSpots[currentIndex] && handleSwipe(recommendedSpots[currentIndex], false)}
                    className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:from-gray-500 hover:to-gray-600"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                  <span className="text-xs text-gray-600 mt-1">スキップ</span>
                </div>
                <div className="flex flex-col items-center">
                  <motion.button
                    onClick={() => recommendedSpots[currentIndex] && handleSwipe(recommendedSpots[currentIndex], true)}
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:from-purple-600 hover:to-pink-600"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </motion.button>
                  <span className="text-xs text-gray-600 mt-1">追加</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* スポット詳細モーダル */}
        {selectedSpotForDetail && (
          <SpotDetailModal
            spot={selectedSpotForDetail}
            isOpen={!!selectedSpotForDetail}
            onClose={() => setSelectedSpotForDetail(null)}
          />
        )}
      </div>
    </AnimatePresence>
  )
}