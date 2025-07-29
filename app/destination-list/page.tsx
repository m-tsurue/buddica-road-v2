'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { ArrowLeft, Trash2, MapPin, Star, Clock, Car } from 'lucide-react'
import { useSpotSelection } from '@/contexts/SpotSelectionContext'
import { Spot } from '@/lib/mock-data'
import SpotDetailModal from '@/components/SpotDetailModal'

export default function DestinationListPage() {
  const router = useRouter()
  const { selectedSpots, removeSpot, clearSelection, selectedCount, reorderSpots } = useSpotSelection()
  const [selectedSpotForModal, setSelectedSpotForModal] = useState<Spot | null>(null)

  const handleReorder = (newOrder: Spot[]) => {
    console.log('Reordering spots:', newOrder.map(s => s.name))
    reorderSpots(newOrder)
  }

  if (selectedCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">選択されたスポットがありません</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">戻る</span>
            </button>
            <h1 className="text-lg font-bold">行き先リスト ({selectedCount}件)</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* スポットリスト */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-40">
        <Reorder.Group
          axis="y"
          values={selectedSpots}
          onReorder={handleReorder}
          className="space-y-4"
        >
          <AnimatePresence>
            {selectedSpots.map((spot, index) => (
              <Reorder.Item
                key={spot.id}
                value={spot}
                className="cursor-grab active:cursor-grabbing"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  whileDrag={{ scale: 1.02, zIndex: 50 }}
                  className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  {/* 順番番号 */}
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                    {index + 1}
                  </div>

                  {/* スポット画像 */}
                  <img 
                    src={spot.images[0]} 
                    alt={spot.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* スポット情報 */}
                  <div 
                    className="flex-grow cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Opening modal for:', spot.name)
                      setSelectedSpotForModal(spot)
                    }}
                  >
                    <h3 className="font-bold text-lg mb-1">{spot.name}</h3>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>122km</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{spot.rating}/5</span>
                      </div>
                      <span className="text-sm text-gray-500">({spot.reviews}件の口コミ)</span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
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

                  {/* 削除ボタン */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSpot(spot.id)
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* ドラッグハンドル */}
                  <div className="flex flex-col gap-0.5 flex-shrink-0 px-1">
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
      </main>

      {/* 固定アクションボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/route-map')}
            className="w-full py-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            ドライブルートを見る
          </button>
        </div>
      </div>

      {/* 下部の余白（固定ボタンの分） */}
      <div className="h-24"></div>

      {/* 詳細モーダル */}
      {selectedSpotForModal && (
        <SpotDetailModal
          spot={selectedSpotForModal}
          isOpen={!!selectedSpotForModal}
          onClose={() => {
            console.log('Closing modal')
            setSelectedSpotForModal(null)
          }}
          isFromSelectedList={true}
          onRemoveSpot={removeSpot}
        />
      )}
    </div>
  )
}