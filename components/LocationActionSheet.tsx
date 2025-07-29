'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Navigation2, Search, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Location } from '@/contexts/SpotSelectionContext'

interface LocationActionSheetProps {
  isOpen: boolean
  onClose: () => void
  type: 'start' | 'end'
  location: Location | null
  onSetCurrentLocation: () => void
  onClearLocation: () => void
}

export default function LocationActionSheet({ 
  isOpen, 
  onClose, 
  type, 
  location,
  onSetCurrentLocation,
  onClearLocation
}: LocationActionSheetProps) {
  const router = useRouter()
  const isStart = type === 'start'
  const title = isStart ? '出発地' : '到着地'

  const handleSearch = () => {
    onClose()
    router.push(`/search?mode=location&type=${type}`)
  }

  const handleCurrentLocation = () => {
    onSetCurrentLocation()
    onClose()
  }

  const handleClearLocation = () => {
    onClearLocation()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          <motion.div
            key="modal-content"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'tween',
              ease: [0.4, 0.0, 0.2, 1],
              duration: 0.4
            }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[70vh]"
          >
            {/* ヘッダー */}
            <div className="flex-shrink-0">
              {/* ハンドル */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* 閉じるボタン */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              {/* タイトルエリア */}
              <div className="px-6 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 ${isStart ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{isStart ? '出' : '着'}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{title}の設定</h2>
                </div>
                
                {/* 現在の設定 */}
                {location ? (
                  <div className="bg-gray-50 rounded-lg p-3 relative">
                    <button
                      onClick={handleClearLocation}
                      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-xs transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>削除</span>
                    </button>
                    <p className="font-medium text-gray-900 mb-1 pr-12">{location.name}</p>
                    <p className="text-sm text-gray-600 pr-12">{location.address}</p>
                  </div>
                ) : (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-700">まだ{title}が設定されていません</p>
                  </div>
                )}
              </div>
            </div>

            {/* オプション */}
            <div className="px-6 pb-6 space-y-3">
              {/* 現在地に設定 */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCurrentLocation}
                className="w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Navigation2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">現在地に設定</h3>
                    <p className="text-sm text-gray-600">GPSで現在の位置を取得します</p>
                  </div>
                </div>
              </motion.button>

              {/* 場所を検索 */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">場所を検索</h3>
                    <p className="text-sm text-gray-600">地名や住所で検索して設定</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}