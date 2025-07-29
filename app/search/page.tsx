'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, ChevronDown } from 'lucide-react'
import SpotShowcase from '@/components/home/SpotShowcase'
import SpotDetailModal from '@/components/SpotDetailModal'
import { mockSpots, Spot } from '@/lib/mock-data'
import { useSpotSelection } from '@/contexts/SpotSelectionContext'

const GENRE_CATEGORIES = [
  { id: 'all', label: 'すべて', active: true },
  { id: 'experience', label: '体験' },
  { id: 'culture', label: '文化' },
  { id: 'nature', label: '自然' },
  { id: 'gourmet', label: 'グルメ' },
]

const SORT_OPTIONS = [
  { id: 'relevance', label: '並べ替え' },
  { id: 'distance', label: '距離順' },
  { id: 'rating', label: '評価順' },
  { id: 'reviews', label: 'レビュー数順' },
]

const FILTER_OPTIONS = [
  { id: 'none', label: '絞り込み' },
  { id: 'nearby', label: '近場のみ' },
  { id: 'highrated', label: '高評価のみ' },
  { id: 'popular', label: '人気のみ' },
]

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  const area = searchParams?.get('area') || ''
  
  const [searchQuery, setSearchQuery] = useState(query)
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [filterBy, setFilterBy] = useState('none')
  const [filteredSpots, setFilteredSpots] = useState(mockSpots)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSpotForModal, setSelectedSpotForModal] = useState<Spot | null>(null)
  
  const { selectedCount } = useSpotSelection()

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

  useEffect(() => {
    // 検索・フィルタリング処理
    let results = mockSpots

    // キーワード検索
    if (searchQuery) {
      results = results.filter(spot => 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // エリア検索
    if (area) {
      // エリアに基づくフィルタリング（実装例）
      results = results.filter(spot => 
        spot.tags.some(tag => tag.includes(area))
      )
    }

    // ジャンルフィルタ
    if (selectedGenre !== 'all') {
      results = results.filter(spot => 
        spot.tags.some(tag => tag.includes(selectedGenre)) ||
        spot.vibes.some(vibe => vibe.includes(selectedGenre))
      )
    }

    // ソート
    if (sortBy === 'distance') {
      // 距離順（仮実装）
      results = [...results].sort(() => Math.random() - 0.5)
    } else if (sortBy === 'rating') {
      results = [...results].sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'reviews') {
      results = [...results].sort((a, b) => b.reviews - a.reviews)
    }

    setFilteredSpots(results)
  }, [searchQuery, area, selectedGenre, sortBy, filterBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (area) params.set('area', area)
    router.push(`/search?${params.toString()}`)
  }

  const getSearchTitle = () => {
    if (area) return `${area}の人気スポット`
    if (searchQuery) return `"${searchQuery}"の検索結果`
    return '人気スポット'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">戻る</span>
            </button>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* 検索フォーム */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="スポットを検索"
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* ジャンルタブ */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {GENRE_CATEGORIES.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedGenre === genre.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {genre.label}
                {genre.id === 'all' && <span className="ml-1 text-orange-500">●</span>}
              </button>
            ))}
          </div>

          {/* 並べ替え・絞り込み */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 検索結果 */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <h1 className="text-2xl font-bold mb-6">{getSearchTitle()}</h1>
        
        {filteredSpots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">検索結果が見つかりませんでした</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedGenre('all')
                setSortBy('relevance')
                setFilterBy('none')
              }}
              className="text-orange-500 hover:text-orange-600"
            >
              検索条件をリセット
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSpots.map((spot) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SpotShowcase 
                  spot={spot} 
                  variant="list" 
                  onSpotClick={(spot) => setSelectedSpotForModal(spot)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* 選択中スポット数表示（固定ボタン） */}
      {selectedCount > 0 && !isModalOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => router.push('/route-map')}
            className="bg-orange-500 text-white rounded-full px-6 py-3 shadow-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <div className="bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {selectedCount}
            </div>
            <span className="font-medium">ルートを確認</span>
          </button>
        </div>
      )}
      
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}