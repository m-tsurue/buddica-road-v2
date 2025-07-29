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
import { ArrowLeft, MapPin, Clock, Navigation, Sparkles, Star, GripVertical, Plus, Search, Expand, Minimize, Settings } from 'lucide-react'
import { useSpotSelection, Location } from '@/contexts/SpotSelectionContext'
import { Spot } from '@/lib/mock-data'
import SuggestModal from '@/components/SuggestModal'
import SpotDetailModal from '@/components/SpotDetailModal'
import AddSpotModal from '@/components/AddSpotModal'
import LocationActionSheet from '@/components/LocationActionSheet'
import { GoogleMap } from '@/components/map/GoogleMap'

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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group cursor-grab active:cursor-grabbing touch-none"
      onClick={() => onClick(spot)}
    >
      <div className="aspect-square w-full bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-orange-300 transition-colors">
        <div className="relative w-full h-full">
          <img 
            src={spot.images[0]} 
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
          
          {/* ドラッグハンドル - 2個以上の時のみ表示 */}
          {totalSpots > 1 && (
            <div className="absolute top-1 left-1 w-5 h-5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded shadow-sm flex items-center justify-center cursor-grab active:cursor-grabbing z-10">
              <GripVertical className="w-3 h-3 text-gray-500" />
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-600 truncate block">スポット{index + 1}</span>
      </div>
    </div>
  )
}

export default function RouteMapPage() {
  const router = useRouter()
  const { 
    selectedSpots, 
    selectedCount, 
    reorderSpots, 
    removeSpot,
    startLocation,
    endLocation,
    setStartLocation,
    setEndLocation,
    clearStartLocation,
    clearEndLocation,
    getCurrentLocation
  } = useSpotSelection()
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
  const [isAddSpotModalOpen, setIsAddSpotModalOpen] = useState(false)
  const [selectedSpotForModal, setSelectedSpotForModal] = useState<Spot | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [locationModalType, setLocationModalType] = useState<'start' | 'end' | null>(null)
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  
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

  // ルート統計の表示用（Google Mapsで正確な値を取得するまでの仮値）
  const [routeStats, setRouteStats] = useState({ distance: '---', duration: '---' })

  const handleStartDrive = () => {
    alert('ドライブを開始します！実際のナビゲーションアプリに連携します。')
  }

  const handleUpdateCurrentLocation = async (type: 'start' | 'end') => {
    const currentLocation = await getCurrentLocation()
    if (currentLocation) {
      if (type === 'start') {
        setStartLocation(currentLocation)
      } else {
        setEndLocation(currentLocation)
      }
    }
  }

  const handleLocationTap = (type: 'start' | 'end') => {
    setLocationModalType(type)
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
      <motion.div 
        className="relative"
        animate={{ height: isMapExpanded ? '60vh' : '288px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <GoogleMap 
          spots={selectedSpots}
          startLocation={startLocation}
          endLocation={endLocation}
          height="100%"
          showRoute={true}
          className=""
          onRouteCalculated={(info) => {
            if (info) {
              setRouteStats({ distance: info.distance, duration: info.duration });
            }
          }}
          onMarkerClick={(spot) => setSelectedSpotForModal(spot)}
        />
        
        {/* 地図展開/縮小ボタン */}
        <button
          onClick={() => setIsMapExpanded(!isMapExpanded)}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm hover:bg-white transition-colors flex items-center justify-center z-10"
          title={isMapExpanded ? '地図を縮小' : '地図を拡大'}
        >
          {isMapExpanded ? (
            <Minimize className="w-4 h-4 text-gray-600" />
          ) : (
            <Expand className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </motion.div>

      {/* 統計情報 - コンパクト版 */}
      {!isMapExpanded && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-y border-orange-100 py-3">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8">
            {/* 距離 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">{routeStats.distance}</span>
              <span className="text-xs text-orange-600 font-medium">の冒険</span>
            </div>
            
            {/* 時間 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Clock className="w-3 h-3 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">{routeStats.duration}</span>
              <span className="text-xs text-purple-600 font-medium">の旅</span>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* ルート詳細 */}
      {!isMapExpanded && (
        <div className="bg-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* 見出し */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">🗺️ 冒険ルート</h2>
            {selectedSpots.length > 1 && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <GripVertical className="w-3 h-3" />
                <span>ドラッグして順序を変更できます</span>
              </p>
            )}
          </div>
          
          {/* ルートフロー */}
          <div className="mb-6 space-y-3">
            {/* 出発地 */}
            <div 
              className="w-full px-3 py-2 bg-green-50 border border-green-200 rounded cursor-pointer hover:bg-green-100 hover:border-green-300 transition-colors group"
              onClick={() => handleLocationTap('start')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">出</span>
                  </div>
                  <span className="text-sm text-gray-900 truncate">
                    {startLocation?.name || '出発地をセットしてください'}
                  </span>
                </div>
                <Settings className="w-4 h-4 text-green-400 group-hover:text-green-600 transition-colors flex-shrink-0" />
              </div>
            </div>
            
            <DndContext 
              sensors={sensors}
              collisionDetection={rectIntersection}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {/* スポットグリッド */}
              <SortableContext 
                items={selectedSpots.map(spot => spot.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-3 gap-3">
                  {selectedSpots.map((spot, index) => (
                    <div key={spot.id} className="relative">
                      <SortableSpotItem
                        spot={spot}
                        index={index}
                        onClick={setSelectedSpotForModal}
                        totalSpots={selectedSpots.length}
                      />
                      {/* 右向き矢印（最後の列以外） */}
                      {(index + 1) % 3 !== 0 && index < selectedSpots.length - 1 && (
                        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SortableContext>
              
              <DragOverlay>
                {activeSpot ? (
                  <div className="w-24 opacity-90 transform rotate-3 scale-110">
                    <div className="aspect-square w-full bg-white border-2 border-orange-400 rounded-lg overflow-hidden shadow-lg">
                      <div className="relative w-full h-full">
                        <img 
                          src={activeSpot.images[0]} 
                          alt={activeSpot.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {selectedSpots.findIndex(spot => spot.id === activeSpot.id) + 1}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-xs text-gray-600 truncate block">
                        スポット{selectedSpots.findIndex(spot => spot.id === activeSpot.id) + 1}
                      </span>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
            
            {/* 到着地 */}
            <div 
              className="w-full px-3 py-2 bg-red-50 border border-red-200 rounded cursor-pointer hover:bg-red-100 hover:border-red-300 transition-colors group"
              onClick={() => handleLocationTap('end')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">着</span>
                  </div>
                  <span className="text-sm text-gray-900 truncate">
                    {endLocation?.name || '到着地をセットしてください'}
                  </span>
                </div>
                <Settings className="w-4 h-4 text-red-400 group-hover:text-red-600 transition-colors flex-shrink-0" />
              </div>
            </div>
            
            {/* スポット追加ボタン */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsAddSpotModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                立ち寄り先を追加
              </button>
            </div>
          </div>

        </div>
        </div>
      )}

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

      {/* スポット追加モーダル */}
      <AddSpotModal
        isOpen={isAddSpotModalOpen}
        onClose={() => setIsAddSpotModalOpen(false)}
      />

      {/* 位置設定アクションシート */}
      <LocationActionSheet
        isOpen={!!locationModalType}
        onClose={() => setLocationModalType(null)}
        type={locationModalType || 'start'}
        location={locationModalType === 'start' ? startLocation : endLocation}
        onSetCurrentLocation={() => {
          if (locationModalType) {
            handleUpdateCurrentLocation(locationModalType)
          }
        }}
        onClearLocation={() => {
          if (locationModalType === 'start') {
            clearStartLocation()
          } else {
            clearEndLocation()
          }
        }}
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