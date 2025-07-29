'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowLeft, MapPin, Clock, Navigation, Sparkles, Star, GripVertical, Plus, Search } from 'lucide-react'
import { useSpotSelection } from '@/contexts/SpotSelectionContext'
import { Spot } from '@/lib/mock-data'
import SuggestModal from '@/components/SuggestModal'
import SpotDetailModal from '@/components/SpotDetailModal'
import { MapboxMap } from '@/components/map/MapboxMap'

// ソート可能なスポットアイテムコンポーネント
function SortableSpotItem({ 
  spot, 
  index, 
  onClick, 
  totalSpots 
}: { 
  spot: Spot; 
  index: number; 
  onClick: (spot: Spot) => void;
  totalSpots: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: spot.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // ドラッグ中は完全に透明にしてDragOverlayを表示
  }

  return (
    <div className="flex items-center gap-2">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex flex-col items-center gap-2 relative group flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
        onClick={() => onClick(spot)}
      >
        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
          <img 
            src={spot.images[0]} 
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 right-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
          
          {/* ドラッグハンドル */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/95 rounded-lg p-2 shadow-sm flex flex-col items-center">
              <GripVertical className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600 mt-1">ドラッグ</span>
            </div>
          </div>
        </div>
        <span className="text-xs text-center truncate w-16">スポット{index + 1}</span>
      </div>
      
      {/* スポット間の矢印（最後以外） */}
      {index < totalSpots - 1 && (
        <div className="flex items-center h-16 text-gray-400 flex-shrink-0">
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </div>
      )}
    </div>
  )
}

export default function RouteMapPage() {
  const router = useRouter()
  const { selectedSpots, selectedCount, reorderSpots, removeSpot } = useSpotSelection()
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
  const [selectedSpotForModal, setSelectedSpotForModal] = useState<Spot | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragStart(event: any) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = selectedSpots.findIndex(spot => spot.id === active.id)
      const newIndex = selectedSpots.findIndex(spot => spot.id === over.id)
      
      // 正しい配列の並び替え処理
      const newSpots = [...selectedSpots]
      const [draggedItem] = newSpots.splice(oldIndex, 1) // ドラッグしたアイテムを削除
      newSpots.splice(newIndex, 0, draggedItem) // 新しい位置に挿入
      
      reorderSpots(newSpots)
    }
    
    setActiveId(null)
  }

  const activeSpot = activeId ? selectedSpots.find(spot => spot.id === activeId) : null

  // ルート統計の計算（仮実装）
  const totalDistance = selectedCount * 30 + 50 // 仮の計算
  const estimatedTime = Math.floor(totalDistance / 50 * 60) // 時速50kmで計算
  const hours = Math.floor(estimatedTime / 60)
  const minutes = estimatedTime % 60

  const handleStartDrive = () => {
    alert('ドライブを開始します！実際のナビゲーションアプリに連携します。')
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
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 w-20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold flex-1 text-center">ドライブルート</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSuggestModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium text-sm"
            >
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
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>寄り道提案</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* 地図エリア - 完全独立 */}
      <div className="relative">
        <MapboxMap 
          spots={selectedSpots}
          height="288px"
          showRoute={true}
          className=""
        />
      </div>

      {/* 統計情報 - コンパクト版 */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-y border-orange-100 py-3">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8">
            {/* 距離 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">{totalDistance}km</span>
              <span className="text-xs text-orange-600 font-medium">の冒険</span>
            </div>
            
            {/* 時間 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Clock className="w-3 h-3 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">
                {hours}:{minutes.toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-purple-600 font-medium">の旅</span>
            </div>
          </div>
        </div>
      </div>

      {/* ルート詳細 */}
      <div className="bg-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* 見出し */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">🗺️ 冒険ルート</h2>
            <span className="text-sm text-gray-500">{selectedCount}スポット</span>
          </div>
          {selectedSpots.length > 1 && (
            <p className="text-sm text-gray-400 mb-4 flex items-center gap-1">
              <GripVertical className="w-3 h-3" />
              ドラッグして順序を変更できます
            </p>
          )}
          
          {/* ルートフロー */}
          <div className="mb-6">
            <DndContext 
              sensors={sensors}
              collisionDetection={rectIntersection}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-wrap items-start gap-2">
                {/* 現在地 */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="text-xs text-center">現在地</span>
                </div>
                
                {/* 現在地の後の矢印 */}
                {selectedSpots.length > 0 && (
                  <div className="flex items-center h-16 text-gray-400 flex-shrink-0">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                )}
                
                {/* ドラッグ&ドロップ可能なスポットリスト */}
                <SortableContext 
                  items={selectedSpots.map(spot => spot.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="flex flex-wrap items-start gap-2 flex-1">
                    {selectedSpots.map((spot, index) => (
                      <SortableSpotItem
                        key={spot.id}
                        spot={spot}
                        index={index}
                        onClick={setSelectedSpotForModal}
                        totalSpots={selectedSpots.length}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
              
              <DragOverlay>
                {activeSpot ? (
                  <div className="flex flex-col items-center gap-2 relative group flex-shrink-0 opacity-90 transform rotate-3 scale-110">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src={activeSpot.images[0]} 
                        alt={activeSpot.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {selectedSpots.findIndex(spot => spot.id === activeSpot.id) + 1}
                      </div>
                    </div>
                    <span className="text-xs text-center truncate w-16">
                      スポット{selectedSpots.findIndex(spot => spot.id === activeSpot.id) + 1}
                    </span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
            
            {/* スポット追加ボタン */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/search')}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <Search className="w-4 h-4" />
                立ち寄り先を追加
              </button>
            </div>
          </div>

        </div>
      </div>


      {/* 固定CTAボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleStartDrive}
            className="w-full py-4 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            <Navigation className="w-6 h-6" />
            ドライブをはじめる
          </motion.button>
        </div>
      </div>

      {/* 下部の余白（固定ボタンの分） */}
      <div className="h-24"></div>

      {/* 提案モーダル */}
      <SuggestModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        baseSpotId={selectedSpots.length > 0 ? selectedSpots[0].id : null}
      />

      {/* スポット詳細モーダル */}
      <SpotDetailModal
        spot={selectedSpotForModal}
        isOpen={!!selectedSpotForModal}
        onClose={() => setSelectedSpotForModal(null)}
        isFromSelectedList={true}
        onRemoveSpot={(spotId) => {
          removeSpot(spotId)
          setSelectedSpotForModal(null)
        }}
      />
    </div>
  )
}