'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Clock, Plus, Filter } from 'lucide-react';
import { mockSpots, Spot } from '@/lib/mock-data';
import { useSpotSelection } from '@/contexts/SpotSelectionContext';
import SpotDetailModal from '@/components/SpotDetailModal';

// エリア別のスポット（実際のアプリではAPIから取得）
const getSpotsByArea = (area: string): Spot[] => {
  const areaFilters: { [key: string]: (spot: Spot) => boolean } = {
    '現在地から50km': (spot) => {
      // 住所ベースでフィルタリング（東京・神奈川・埼玉の一部）
      const address = spot.address || '';
      return address.includes('東京都') || 
             address.includes('神奈川県') || 
             address.includes('埼玉県');
    },
    '現在地から100km': (spot) => {
      // より広範囲（関東全域）
      const address = spot.address || '';
      return address.includes('東京都') || 
             address.includes('神奈川県') || 
             address.includes('埼玉県') || 
             address.includes('千葉県') || 
             address.includes('茨城県') || 
             address.includes('栃木県') || 
             address.includes('群馬県');
    },
    '南関東': (spot) => {
      const address = spot.address || '';
      return address.includes('東京都') || 
             address.includes('神奈川県') || 
             address.includes('千葉県') || 
             address.includes('埼玉県');
    },
    '北関東': (spot) => {
      const address = spot.address || '';
      return address.includes('群馬県') || 
             address.includes('栃木県') || 
             address.includes('茨城県');
    },
    '中部': (spot) => {
      const address = spot.address || '';
      return address.includes('山梨県') || 
             address.includes('長野県') || 
             address.includes('静岡県');
    },
    '関西': (spot) => {
      const address = spot.address || '';
      return address.includes('大阪府') || 
             address.includes('京都府') || 
             address.includes('奈良県');
    },
  };
  
  const filter = areaFilters[area];
  return filter ? mockSpots.filter(filter) : mockSpots;
};

const categories = [
  { id: 'all', name: '全て', emoji: '🌟' },
  { id: 'nature', name: '自然・景色', emoji: '🌲' },
  { id: 'culture', name: '歴史・文化', emoji: '🏛️' },
  { id: 'food', name: 'グルメ', emoji: '🍜' },
  { id: 'shopping', name: 'ショッピング', emoji: '🛍️' },
  { id: 'activity', name: 'アクティビティ', emoji: '🎯' },
];

function RecommendationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSpot, removeSpot, selectedSpots, isSelected } = useSpotSelection();
  
  const area = searchParams.get('area') || '南関東';
  const searchQuery = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [spots, setSpots] = useState<Spot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
  const [selectedSpotForModal, setSelectedSpotForModal] = useState<Spot | null>(null);
  const [successStates, setSuccessStates] = useState<{[key: string]: 'add' | 'remove' | null}>({});

  // エリアまたはキーワードに基づいてスポットを取得
  useEffect(() => {
    let resultSpots: Spot[];
    
    if (searchQuery) {
      // キーワード検索の場合：全スポットから検索
      resultSpots = mockSpots.filter(spot => 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        spot.vibes.some(vibe => vibe.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    } else {
      // エリア選択の場合：エリア別フィルタリング
      resultSpots = getSpotsByArea(area);
    }
    
    setSpots(resultSpots);
  }, [area, searchQuery]);

  // カテゴリでフィルタリング
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredSpots(spots);
    } else {
      const categoryFilters: { [key: string]: (spot: Spot) => boolean } = {
        nature: (spot) => spot.tags.some(tag => ['自然', '景色', '公園', '山', '海'].includes(tag)),
        culture: (spot) => spot.tags.some(tag => ['歴史', '文化', '寺', '神社', '博物館'].includes(tag)),
        food: (spot) => spot.tags.some(tag => ['グルメ', '料理', 'レストラン', 'カフェ'].includes(tag)),
        shopping: (spot) => spot.tags.some(tag => ['ショッピング', '買い物', 'モール'].includes(tag)),
        activity: (spot) => spot.tags.some(tag => ['アクティビティ', 'スポーツ', '体験'].includes(tag)),
      };
      
      const filter = categoryFilters[selectedCategory];
      setFilteredSpots(filter ? spots.filter(filter) : spots);
    }
  }, [spots, selectedCategory]);

  const handleAddSpot = (spot: Spot) => {
    addSpot(spot);
    // 成功状態を設定
    setSuccessStates(prev => ({ ...prev, [spot.id]: 'add' }));
    setTimeout(() => {
      setSuccessStates(prev => ({ ...prev, [spot.id]: null }));
    }, 1500);
  };

  const handleRemoveSpot = (spot: Spot) => {
    removeSpot(spot.id);
    // 成功状態を設定
    setSuccessStates(prev => ({ ...prev, [spot.id]: 'remove' }));
    setTimeout(() => {
      setSuccessStates(prev => ({ ...prev, [spot.id]: null }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>戻る</span>
            </button>
            <h1 className="text-lg font-bold">
              {searchQuery ? `"${searchQuery}"の検索結果` : `${area}のおすすめスポット`}
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* カテゴリフィルター */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* スポット一覧 */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            {searchQuery 
              ? `"${searchQuery}"で${filteredSpots.length}件のスポットが見つかりました`
              : `${filteredSpots.length}件のスポットが見つかりました`
            }
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter className="w-4 h-4" />
            <span>評価順</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSpots.map((spot, index) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* 写真部分 - クリック可能 */}
                <div
                  className="relative h-48 cursor-pointer"
                  onClick={() => setSelectedSpotForModal(spot)}
                >
                  <img
                    src={spot.images[0]}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                    <div className="flex items-center gap-1 text-white text-sm">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{spot.rating}</span>
                    </div>
                  </div>
                </div>
                
                {/* 情報部分 - クリック可能 */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedSpotForModal(spot)}
                >
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{spot.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{spot.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{spot.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>12km</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {spot.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* ボタン部分 - クリックイベント分離 */}
                <div className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
                  {(() => {
                    const successState = successStates[spot.id];
                    
                    if (successState === 'add') {
                      return (
                        <button
                          disabled
                          className="w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 bg-green-500 text-white"
                        >
                          追加しました！
                        </button>
                      );
                    }
                    
                    if (successState === 'remove') {
                      return (
                        <button
                          disabled
                          className="w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 bg-red-500 text-white"
                        >
                          削除しました
                        </button>
                      );
                    }
                    
                    if (isSelected(spot.id)) {
                      return (
                        <button
                          onClick={() => handleRemoveSpot(spot)}
                          className="w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 bg-gray-200 text-gray-600 hover:bg-gray-300"
                        >
                          <Plus className="w-4 h-4 rotate-45" />
                          行き先から外す
                        </button>
                      );
                    }
                    
                    return (
                      <button
                        onClick={() => handleAddSpot(spot)}
                        className="w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
                      >
                        <Plus className="w-4 h-4" />
                        追加
                      </button>
                    );
                  })()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredSpots.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 mb-2">
              {searchQuery 
                ? `"${searchQuery}"に該当するスポットが見つかりませんでした`
                : '該当するスポットが見つかりませんでした'
              }
            </p>
            <p className="text-sm text-gray-400">
              {searchQuery 
                ? '別のキーワードを試してみてください'
                : '別のカテゴリを試してみてください'
              }
            </p>
          </div>
        )}
      </div>

      {/* 現在のルート */}
      {selectedSpots.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => router.push('/route-map')}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all"
            >
              ルートを見る（{selectedSpots.length}箇所）
            </button>
          </div>
        </div>
      )}

      {/* スポット詳細モーダル */}
      <SpotDetailModal
        spot={selectedSpotForModal}
        isOpen={!!selectedSpotForModal}
        onClose={() => setSelectedSpotForModal(null)}
      />
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <RecommendationsContent />
    </Suspense>
  );
}