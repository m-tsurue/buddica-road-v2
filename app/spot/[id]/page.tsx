'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Star, Clock, Car, Plus, Check } from 'lucide-react'
import { mockSpots, Spot } from '@/lib/mock-data'
import { useSpotSelection } from '@/contexts/SpotSelectionContext'

interface SpotDetailPageProps {
  params: Promise<{ id: string }>
}

export default function SpotDetailPage({ params }: SpotDetailPageProps) {
  const router = useRouter()
  const [spot, setSpot] = useState<Spot | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const { toggleSpot, isSelected } = useSpotSelection()
  const resolvedParams = use(params)

  useEffect(() => {
    const foundSpot = mockSpots.find(s => s.id === resolvedParams.id)
    setSpot(foundSpot || null)
  }, [resolvedParams.id])

  if (!spot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">スポットが見つかりません</p>
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

  const selected = isSelected(spot.id)

  const handleToggleSpot = () => {
    if (!selected) {
      // 追加する場合
      toggleSpot(spot)
      setShowSuccess(true)
      // 1.5秒後に前画面に戻る
      setTimeout(() => {
        router.back()
      }, 1500)
    } else {
      // 削除する場合は即座に実行
      toggleSpot(spot)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー画像 */}
      <div className="relative h-80">
        <img 
          src={spot.images[0]} 
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        
        {/* 戻るボタン */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* コンテンツオーバーレイ */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6">
          <h1 className="text-2xl font-bold mb-2">{spot.name}</h1>
          
          <div className="flex items-center gap-1 text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span>122km</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-bold">{spot.rating}/5</span>
            </div>
            <span className="text-gray-500">({spot.reviews}件の口コミ)</span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>営業時間：00:00~223:59</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span>駐車場：あり（有料）</span>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="px-6 py-6 space-y-6 pb-32">
        {/* 地図セクション */}
        <section>
          <h2 className="text-lg font-bold mb-4">地図</h2>
          <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
            {/* 実際の地図実装時はMapbox等を使用 */}
            <img 
              src="https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Map+Placeholder"
              alt="地図"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </section>

        {/* 説明セクション（必要に応じて追加） */}
        {spot.description && (
          <section>
            <h2 className="text-lg font-bold mb-4">詳細</h2>
            <p className="text-gray-700 leading-relaxed">{spot.description}</p>
          </section>
        )}

        {/* タグセクション */}
        <section>
          <h2 className="text-lg font-bold mb-4">特徴</h2>
          <div className="flex flex-wrap gap-2">
            {spot.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* vibesセクション */}
        {spot.vibes.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4">雰囲気</h2>
            <div className="flex flex-wrap gap-2">
              {spot.vibes.map((vibe, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 固定アクションボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleSpot}
            disabled={showSuccess}
            className={`w-full py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              showSuccess
                ? 'bg-green-500 text-white'
                : selected
                ? 'bg-gray-200 text-gray-600'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {showSuccess ? (
              <>
                <Check className="w-5 h-5" />
                行き先に追加しました
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                {selected ? '行き先から外す' : '行き先追加'}
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* 下部の余白（固定ボタンの分） */}
      <div className="h-24"></div>
    </div>
  )
}