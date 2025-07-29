'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Map, TrendingUp, Car } from 'lucide-react';
import { Spot } from '@/lib/mock-data';
import { getSpotsByArea } from '@/lib/recommendation';
import { SearchTab } from '@/components/search/SearchTab';
import { MapTab } from '@/components/map/MapTab';
import { TrendingTab } from '@/components/trending/TrendingTab';
import { ANIMATIONS } from '@/lib/constants';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'map' | 'trending'>('search');
  const [searchResults, setSearchResults] = useState<Spot[]>([]);
  const [showResults, setShowResults] = useState(false);


  const handleDestinationSelect = (spot: Spot) => {
    localStorage.setItem('primaryDestination', JSON.stringify(spot));
    window.location.href = '/swipe';
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const { mockSpots } = await import('@/lib/mock-data');
    const filteredSpots = mockSpots.filter(spot => 
      spot.name.toLowerCase().includes(query.toLowerCase()) ||
      spot.description.toLowerCase().includes(query.toLowerCase()) ||
      spot.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      spot.vibes.some(vibe => vibe.toLowerCase().includes(query.toLowerCase()))
    );
    
    setSearchResults(filteredSpots);
    setShowResults(true);
    setSearchQuery(query);
  };

  const handleAreaSearch = (areaName: string) => {
    const areaSpots = getSpotsByArea(areaName);
    
    if (areaSpots.length > 0) {
      setSearchResults(areaSpots);
      setShowResults(true);
      setSearchQuery(areaName);
    } else {
      void performSearch(areaName);
    }
  };

  const handleClearResults = () => {
    setShowResults(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold text-orange-600 flex items-center gap-3">
              <Car className="w-8 h-8" />
              BUDDICA ROAD
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        {/* メインメッセージ - モバイルでコンパクト */}
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            どこに行きますか？
          </h2>
          <p className="text-base sm:text-xl text-gray-600 mb-4 sm:mb-8">
            最初の目的地を選ぶと、おすすめスポットを提案します
          </p>
        </div>

        {/* 3つのメインアクション - モバイル最適化 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-4 sm:mb-12">
          {/* キーワード検索 */}
          <motion.div
            whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
            className={`p-3 sm:p-6 rounded-xl sm:rounded-3xl border-2 cursor-pointer transition-all ${
              activeTab === 'search' 
                ? 'border-orange-300 bg-orange-50' 
                : 'border-gray-200 bg-white hover:border-orange-200'
            }`}
            onClick={() => setActiveTab('search')}
          >
            <Search className="w-5 h-5 sm:w-8 sm:h-8 text-orange-600 mb-1 sm:mb-4 mx-auto" />
            <h3 className="text-xs sm:text-xl font-bold text-center">キーワード</h3>
            <p className="text-gray-600 text-xs sm:text-sm hidden sm:block text-center mt-1 sm:mt-2">温泉、絶景、グルメなど</p>
          </motion.div>

          {/* 地図で選ぶ */}
          <motion.div
            whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
            className={`p-3 sm:p-6 rounded-xl sm:rounded-3xl border-2 cursor-pointer transition-all ${
              activeTab === 'map' 
                ? 'border-orange-300 bg-orange-50' 
                : 'border-gray-200 bg-white hover:border-orange-200'
            }`}
            onClick={() => setActiveTab('map')}
          >
            <Map className="w-5 h-5 sm:w-8 sm:h-8 text-orange-600 mb-1 sm:mb-4 mx-auto" />
            <h3 className="text-xs sm:text-xl font-bold text-center">地図から選ぶ</h3>
            <p className="text-gray-600 text-xs sm:text-sm hidden sm:block text-center mt-1 sm:mt-2">位置を見ながら探す</p>
          </motion.div>

          {/* 人気スポット */}
          <motion.div
            whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
            className={`p-3 sm:p-6 rounded-xl sm:rounded-3xl border-2 cursor-pointer transition-all ${
              activeTab === 'trending' 
                ? 'border-orange-300 bg-orange-50' 
                : 'border-gray-200 bg-white hover:border-orange-200'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8 text-orange-600 mb-1 sm:mb-4 mx-auto" />
            <h3 className="text-xs sm:text-xl font-bold text-center">人気スポット</h3>
            <p className="text-gray-600 text-xs sm:text-sm hidden sm:block text-center mt-1 sm:mt-2">今注目の場所</p>
          </motion.div>
        </div>

        {/* コンテンツエリア */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm">
          {activeTab === 'search' && (
            <SearchTab
              onSpotSelect={handleDestinationSelect}
              searchResults={searchResults}
              onSearch={performSearch}
              searchQuery={searchQuery}
              showResults={showResults}
              onClearResults={handleClearResults}
            />
          )}

          {activeTab === 'map' && <MapTab onSpotSelect={handleDestinationSelect} />}

          {activeTab === 'trending' && (
            <TrendingTab onSpotSelect={handleDestinationSelect} />
          )}
        </div>
      </main>
    </div>
  );
}