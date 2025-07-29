'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useSpotSelection } from '@/contexts/SpotSelectionContext'
import { useRouter } from 'next/navigation'

export default function SpotSelectionBadge() {
  const { selectedCount } = useSpotSelection()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const checkModalState = () => {
      setIsModalOpen(document.body.classList.contains('modal-open'))
    }

    // 初回チェック
    checkModalState()

    // MutationObserverでbodyのclass変更を監視
    const observer = new MutationObserver(checkModalState)
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    })

    return () => observer.disconnect()
  }, [])

  if (selectedCount === 0 || isModalOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => router.push('/route-map')}
          className="bg-orange-500 text-white rounded-full px-6 py-3 shadow-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <div className="bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            {selectedCount}
          </div>
          <span className="font-medium">ルートを確認</span>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}