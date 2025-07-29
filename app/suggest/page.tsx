'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Car, Heart, Sparkles, Route, RotateCcw } from 'lucide-react'
import SwipeCard from '@/components/SwipeCard'
import { mockSpots, Spot } from '@/lib/mock-data'
import { generateRecommendations } from '@/lib/recommendation'
import { useSpotSelection } from '@/contexts/SpotSelectionContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ActionButton } from '@/components/ui/ActionButton'
import { ANIMATIONS } from '@/lib/constants'

export default function SuggestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const baseSpotId = searchParams?.get('baseSpot')
  
  const [baseSpot, setBaseSpot] = useState<Spot | null>(null)
  const [recommendedSpots, setRecommendedSpots] = useState<Spot[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const { selectedSpots, addSpot, selectedCount } = useSpotSelection()

  useEffect(() => {
    if (baseSpotId) {
      const foundSpot = mockSpots.find(s => s.id === baseSpotId)
      if (foundSpot) {
        setBaseSpot(foundSpot)
        
        // 既選択スポットを除外してレコメンド生成
        const excludeIds = selectedSpots.map(s => s.id)
        excludeIds.push(foundSpot.id) // 自分自身も除外
        
        const recommendations = generateRecommendations(foundSpot, excludeIds, 28)
        setRecommendedSpots(recommendations)
        setIsLoaded(true)
      }
    }
  }, [baseSpotId, selectedSpots])

  const handleSwipe = (spot: Spot, liked: boolean) => {
    if (liked) {
      addSpot(spot)
    }
    setCurrentIndex(prev => prev + 1)
  }

  const reset = () => {
    setCurrentIndex(0)
  }

  const proceedToRouteEditor = () => {
    router.push('/route-editor')
  }

  const hasMoreSpots = currentIndex < recommendedSpots.length

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  if (!baseSpot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">基準スポットが見つかりません</p>
          <button
            onClick={() => router.back()}
            className="text-orange-500 hover:text-orange-600"
          >
            戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">提案</span>
            </button>
            
            {/* 選択済みスポット数 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                <Heart className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  {selectedCount}個選択中
                </span>
              </div>
              
              {/* リセットボタン */}
              {currentIndex > 0 && (
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
      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-8">
          <div className="mb-2 sm:mb-4">
            <p className="text-xs sm:text-sm text-orange-600 font-medium">
              📍 {baseSpot.name}近くの岬周辺のおすすめスポット
            </p>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            {recommendedSpots.length - currentIndex}/{recommendedSpots.length}件
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            素敵な寄り道で旅をもっと特別にしませんか？
          </p>
        </div>

        <div className="relative h-[500px] sm:h-[700px] max-w-lg mx-auto">
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
              <p className="text-gray-600">
                {selectedCount}個のスポットを選びました
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* スティッキーCTAボタン */}
      {selectedCount > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 z-30">
          <div className="max-w-7xl mx-auto flex gap-3">
            <button
              onClick={() => router.push('/destination-list')}
              className="flex-1 py-4 bg-white border-2 border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
            >
              <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {selectedCount}
              </div>
              行き先
            </button>
            
            <button
              onClick={() => router.push('/route-map')}
              className="flex-1 py-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              ドライブルートを見る
            </button>
          </div>
        </div>
      )}
    </div>
  )
}