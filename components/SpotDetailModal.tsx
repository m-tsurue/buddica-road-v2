'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { X, MapPin, Star, Clock, Car, Plus, Check } from 'lucide-react'
import { mockSpots, Spot } from '@/lib/mock-data'
import { useSpotSelection } from '@/contexts/SpotSelectionContext'
import { MapboxMap } from '@/components/map/MapboxMap'

interface SpotDetailModalProps {
  spotId?: string | null
  spot?: Spot
  isOpen: boolean
  onClose: () => void
  isFromSelectedList?: boolean
  onRemoveSpot?: (spotId: string) => void
}

export default function SpotDetailModal({ spotId, spot: providedSpot, isOpen, onClose, isFromSelectedList = false, onRemoveSpot }: SpotDetailModalProps) {
  const [spot, setSpot] = useState<Spot | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successAction, setSuccessAction] = useState<'add' | 'remove' | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const { toggleSpot, isSelected } = isFromSelectedList && onRemoveSpot ? 
    { toggleSpot: (spot: Spot) => onRemoveSpot(spot.id), isSelected: () => true } : 
    useSpotSelection()

  useEffect(() => {
    if (providedSpot) {
      setSpot(providedSpot)
    } else if (spotId) {
      const foundSpot = mockSpots.find(s => s.id === spotId)
      setSpot(foundSpot || null)
    }
    setShowSuccess(false)
    setSuccessAction(null)
  }, [spotId, providedSpot])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
      // モーダルが閉じるときは状態をリセット
      setShowSuccess(false)
      setSuccessAction(null)
      setIsDragging(false)
    }
    
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const selected = spot ? isSelected(spot.id) : false

  const handleToggleSpot = async () => {
    if (showSuccess) return // 既に処理中の場合は無効化

    const wasSelected = selected
    
    if (isFromSelectedList) {
      // 選択リストから開いた場合は必ず削除
      setSuccessAction('remove')
      setShowSuccess(true)
      toggleSpot(spot)
      
      // 成功メッセージを少し表示してから閉じる
      setTimeout(() => {
        onClose()
      }, 800)
    } else if (!wasSelected) {
      // 追加する場合
      setSuccessAction('add')
      setShowSuccess(true)
      toggleSpot(spot)
      
      // 1秒後に閉じる
      setTimeout(() => {
        onClose()
      }, 800)
    } else {
      // 削除する場合
      setSuccessAction('remove')
      setShowSuccess(true)
      toggleSpot(spot)
      
      // 0.5秒後に閉じる
      setTimeout(() => {
        onClose()
      }, 400)
    }
  }

  // スワイプダウンで閉じる処理
  const handleDragEnd = (event: any, info: PanInfo) => {
    const shouldClose = info.velocity.y > 300 || info.offset.y > 150
    
    if (shouldClose) {
      onClose()
    }
    setIsDragging(false)
  }

  // バックドロップクリックで閉じる（ドラッグ中は無効）
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDragging && !showSuccess) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && spot && (
        <>
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleBackdropClick}
            style={{ touchAction: 'none' }}
          />
          
          <motion.div
            key="modal-content"
            ref={modalRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'tween',
              ease: [0.4, 0.0, 0.2, 1],
              duration: 0.5
            }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] flex flex-col"
            style={{ touchAction: 'auto' }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragStart={(event, info) => {
              // 閉じるボタンエリアからのドラッグは無効化
              const target = event.target as HTMLElement
              if (target.closest('button')) {
                return false
              }
              setIsDragging(true)
            }}
            onDragEnd={handleDragEnd}
            whileDrag={{ cursor: 'grabbing' }}
          >
            {/* ヘッダー部分（固定） */}
            <div className="flex-shrink-0">
              {/* ハンドル */}
              <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* 閉じるボタン */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                disabled={showSuccess}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 disabled:opacity-50"
                style={{ touchAction: 'manipulation' }}
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* スクロール可能コンテンツ */}
            <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="px-6">
                {/* ヘッダー画像 */}
                <div className="relative h-64 mb-6 -mx-6">
                  <img 
                    src={spot.images[0]} 
                    alt={spot.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <h1 className="text-2xl font-bold text-white mb-2">{spot.name}</h1>
                    
                    <div className="flex items-center gap-1 text-white/80 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>122km</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-bold text-white">{spot.rating}/5</span>
                      </div>
                      <span className="text-white/80">({spot.reviews}件の口コミ)</span>
                    </div>
                  </div>
                </div>

                {/* 詳細情報 */}
                <div className="space-y-6">
                  {/* 住所セクション */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      住所・アクセス
                    </h3>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">住所：</span>
                        {spot.address}
                      </div>
                      
                      {/* 地図 */}
                      <div className="rounded-lg overflow-hidden">
                        <MapboxMap 
                          spots={[spot]}
                          height="200px"
                          showRoute={false}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
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

                  {/* 説明 */}
                  {spot.description && (
                    <div>
                      <h3 className="font-bold mb-2">詳細</h3>
                      <p className="text-gray-700 leading-relaxed">{spot.description}</p>
                    </div>
                  )}

                  {/* タグ */}
                  <div>
                    <h3 className="font-bold mb-3">特徴</h3>
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
                  </div>

                  {/* vibes */}
                  {spot.vibes.length > 0 && (
                    <div>
                      <h3 className="font-bold mb-3">雰囲気</h3>
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
                    </div>
                  )}

                  {/* 下部の余白 */}
                  <div className="h-8"></div>
                </div>
              </div>
            </div>

            {/* 固定CTA */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleSpot}
                disabled={showSuccess}
                className={`w-full py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  showSuccess
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : selected
                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {showSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    {successAction === 'add' ? '行き先に追加しました' : '行き先から外しました'}
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    {isFromSelectedList || selected ? '行き先から外す' : '行き先追加'}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}