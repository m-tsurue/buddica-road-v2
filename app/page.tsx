'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import SpotSelectionBadge from '@/components/home/SpotSelectionBadge'
import AreaTags from '@/components/home/AreaTags'
import SpotShowcase from '@/components/home/SpotShowcase'
import SpotDetailModal from '@/components/SpotDetailModal'
import { mockSpots, Spot } from '@/lib/mock-data'
import { useSpotSelection } from '@/contexts/SpotSelectionContext'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [selectedSpotForModal, setSelectedSpotForModal] = useState<Spot | null>(null)
  const { selectedCount } = useSpotSelection()
  
  // 最近の表示スポット（仮データ）
  const recentSpots = mockSpots.slice(0, 6)
  
  // 人気スポット（仮データ）
  const popularSpots = mockSpots.slice(6, 12)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set('q', searchQuery)
      window.location.href = `/search?${params.toString()}`
    }
  }

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area)
    // エリア選択でも検索画面に遷移
    const params = new URLSearchParams()
    params.set('area', area)
    window.location.href = `/search?${params.toString()}`
  }

  return (
    <div className="min-h-screen">
      {/* ヘッダー部分（背景画像） */}
      <div 
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')`
        }}
      >
        {/* 上部余白 */}
        <div className="absolute top-0 left-0 right-0 h-16"></div>

        {/* メインコンテンツ */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-12"
          >
            今日はどこまで行きますか？
          </motion.h1>

          {/* 検索フォーム */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="w-full max-w-2xl mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="スポットを検索"
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </motion.form>

          {/* エリアタグ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <AreaTags onTagSelect={handleAreaSelect} />
          </motion.div>

          {/* 検索ボタン */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="px-12 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
          >
            検索
          </motion.button>
        </div>
      </div>

      {/* スポット表示セクション */}
      <div className="bg-gray-50 pb-24">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* 最近の表示 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">最近の表示</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recentSpots.map((spot) => (
                <SpotShowcase 
                  key={spot.id} 
                  spot={spot} 
                  variant="card" 
                  onSpotClick={(spot) => setSelectedSpotForModal(spot)}
                />
              ))}
            </div>
          </section>

          {/* 現在地周辺の人気スポット */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              現在地周辺(~100km)の人気スポット
            </h2>
            <div className="space-y-4">
              {popularSpots.map((spot) => (
                <SpotShowcase 
                  key={spot.id} 
                  spot={spot} 
                  variant="list" 
                  onSpotClick={(spot) => setSelectedSpotForModal(spot)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 選択中スポットバッジ */}
      <SpotSelectionBadge />
      
      {/* スポット詳細モーダル */}
      {selectedSpotForModal && (
        <SpotDetailModal
          spot={selectedSpotForModal}
          isOpen={!!selectedSpotForModal}
          onClose={() => setSelectedSpotForModal(null)}
        />
      )}
    </div>
  )
}