'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Search, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AddSpotModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddSpotModal({ isOpen, onClose }: AddSpotModalProps) {
  const router = useRouter()

  const handleRecommendations = () => {
    onClose()
    router.push('/recommendations?area=現在地から100km')
  }

  const handleSearch = () => {
    onClose()
    router.push('/search')
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
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[60vh]"
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

              {/* タイトル */}
              <div className="px-6 pb-4">
                <h2 className="text-xl font-bold text-gray-900">立ち寄り先を追加</h2>
                <p className="text-sm text-gray-600 mt-1">どのような方法で追加しますか？</p>
              </div>
            </div>

            {/* オプション */}
            <div className="px-6 pb-6 space-y-4">
              {/* おすすめから追加 */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleRecommendations}
                className="w-full p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-red-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">おすすめから追加</h3>
                    <p className="text-sm text-gray-600">エリア別のおすすめスポットから選択</p>
                  </div>
                  <div className="text-orange-500 font-medium">→</div>
                </div>
              </motion.button>

              {/* 検索して追加 */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">検索して追加</h3>
                    <p className="text-sm text-gray-600">場所名で検索して追加</p>
                  </div>
                  <div className="text-blue-500 font-medium">→</div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}