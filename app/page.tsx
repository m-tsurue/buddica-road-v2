'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Map, TrendingUp, MapPin, Clock, Star, Car } from 'lucide-react';
import { mockSpots, Spot } from '@/lib/mock-data';

export default function Home() {
  const [selectedDestination, setSelectedDestination] = useState<Spot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'map' | 'trending'>('search');

  // 人気のカテゴリキーワード
  const popularCategories = [
    { name: '温泉', icon: '♨️', count: 234 },
    { name: '絶景', icon: '🌅', count: 189 },
    { name: 'グルメ', icon: '🍽️', count: 156 },
    { name: '歴史', icon: '🏯', count: 98 },
    { name: 'アート', icon: '🎨', count: 87 },
    { name: 'カフェ', icon: '☕', count: 145 }
  ];

  // おすすめエリア
  const recommendedAreas = [
    { name: '湘南', spots: 45, image: 'https://images.unsplash.com/photo-1544967882-71b4fe52e0b3?w=200&h=120&fit=crop' },
    { name: '箱根', spots: 38, image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=200&h=120&fit=crop' },
    { name: '鎌倉', spots: 52, image: 'https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?w=200&h=120&fit=crop' },
    { name: '富士五湖', spots: 29, image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=200&h=120&fit=crop' }
  ];

  // トレンドスポット（mockSpotsから抜粋）
  const trendingSpots = mockSpots.slice(0, 3);

  const handleDestinationSelect = (spot: Spot) => {
    setSelectedDestination(spot);
    // 選択した目的地をlocalStorageに保存
    localStorage.setItem('primaryDestination', JSON.stringify(spot));
    // スワイプページに遷移
    window.location.href = '/swipe';
  };

  const handleCategorySearch = (category: string) => {
    setSearchQuery(category);
    // カテゴリに基づくスポット検索実装
    // 現在はモック実装のため、人気スポットをフィルタリング
    const filteredSpots = mockSpots.filter(spot => 
      spot.tags.some(tag => tag.includes(category))
    );
    console.log(`${category} で検索:`, filteredSpots);
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* メインメッセージ */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            どこに行きますか？
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            最初の目的地を選ぶと、おすすめスポットを提案します
          </p>
        </div>

        {/* 3つのメインアクション */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* キーワード検索 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
              activeTab === 'search' 
                ? 'border-orange-300 bg-orange-50' 
                : 'border-gray-200 bg-white hover:border-orange-200'
            }`}
            onClick={() => setActiveTab('search')}
          >
            <Search className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">キーワードで探す</h3>
            <p className="text-gray-600 text-sm">温泉、絶景、グルメなど</p>
          </motion.div>

          {/* 地図で選ぶ */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
              activeTab === 'map' 
                ? 'border-orange-300 bg-orange-50' 
                : 'border-gray-200 bg-white hover:border-orange-200'
            }`}
            onClick={() => setActiveTab('map')}
          >
            <Map className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">地図から選ぶ</h3>
            <p className="text-gray-600 text-sm">位置を見ながら探す</p>
          </motion.div>

          {/* 人気スポット */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
              activeTab === 'trending' 
                ? 'border-orange-300 bg-orange-50' 
                : 'border-gray-200 bg-white hover:border-orange-200'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            <TrendingUp className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">人気スポット</h3>
            <p className="text-gray-600 text-sm">今注目の場所</p>
          </motion.div>
        </div>

        {/* コンテンツエリア */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          {activeTab === 'search' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">🔍 キーワードで探す</h3>
              
              {/* 検索バー */}
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="行きたい場所やカテゴリを入力..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-orange-300 focus:outline-none transition-colors"
                />
              </div>

              {/* 人気カテゴリ */}
              <div className="mb-8">
                <h4 className="text-lg font-bold mb-4">人気のカテゴリ</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {popularCategories.map((category) => (
                    <motion.button
                      key={category.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategorySearch(category.name)}
                      className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors text-left"
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.count}件</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* おすすめエリア */}
              <div>
                <h4 className="text-lg font-bold mb-4">おすすめエリア</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendedAreas.map((area) => (
                    <motion.div
                      key={area.name}
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer"
                    >
                      <div className="relative rounded-xl overflow-hidden mb-2">
                        <img
                          src={area.image}
                          alt={area.name}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-2 left-2 text-white">
                          <div className="font-bold">{area.name}</div>
                          <div className="text-xs">{area.spots}スポット</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="text-center py-12">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">🗺️ 地図から選ぶ</h3>
              <p className="text-gray-600 mb-6">地図機能は次回アップデートで実装予定です</p>
              <p className="text-sm text-gray-500">現在は人気スポットからお選びください</p>
            </div>
          )}

          {activeTab === 'trending' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">🔥 今話題のスポット</h3>
              <div className="space-y-4">
                {trendingSpots.map((spot, index) => (
                  <motion.div
                    key={spot.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleDestinationSelect(spot)}
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 hover:border-orange-300 rounded-xl cursor-pointer transition-all"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {index + 1}
                    </div>
                    
                    <img
                      src={spot.images[0]}
                      alt={spot.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-1">{spot.name}</h4>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{spot.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{spot.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{spot.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{spot.bestTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        {spot.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">今週の人気</div>
                      <div className="text-2xl">🔥</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}