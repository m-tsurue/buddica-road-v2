'use client'

import { useState, useEffect } from 'react'
import { Spot } from '@/lib/mock-data'
import { mockSpots } from '@/lib/mock-data'
import { generateRecommendations } from '@/lib/recommendation'
import { useSpotSelection } from '@/contexts/SpotSelectionContext'

export function useSpotSelectionContext() {
  const { selectedSpots, addSpot, removeSpot } = useSpotSelection()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [recommendedSpots, setRecommendedSpots] = useState<Spot[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [baseSpots, setBaseSpots] = useState<Spot[]>([])

  // スワイプコンテキストを生成
  const swipeContext = selectedSpots.length > 0
    ? `${selectedSpots[0].name}近くの岬周辺のおすすめスポット`
    : '人気のドライブスポット'

  useEffect(() => {
    // 選択済みスポットから基準スポットを抽出
    const newBaseSpots = selectedSpots.length > 0 ? selectedSpots : mockSpots.slice(0, 1)
    setBaseSpots(newBaseSpots)

    // レコメンド生成
    let recommendations: Spot[] = []
    if (newBaseSpots.length > 0) {
      const excludeIds = selectedSpots.map(s => s.id)
      recommendations = generateRecommendations(newBaseSpots[0], excludeIds, 10)
    }
    
    setRecommendedSpots(recommendations)
    setIsLoaded(true)
  }, [selectedSpots])

  const handleSwipe = (spot: Spot, liked: boolean) => {
    if (liked) {
      addSpot(spot)
    }
    setCurrentIndex(prev => prev + 1)
  }

  const reset = () => {
    setCurrentIndex(0)
    // Note: 選択状態のリセットは親コンポーネントで管理
  }

  const proceedToRouteEditor = () => {
    window.location.href = '/route-editor'
  }

  const hasMoreSpots = currentIndex < recommendedSpots.length

  return {
    selectedSpots,
    currentIndex,
    recommendedSpots,
    isLoaded,
    hasMoreSpots,
    swipeContext,
    handleSwipe,
    reset,
    proceedToRouteEditor
  }
}