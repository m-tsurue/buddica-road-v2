'use client';

import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Clock, MapPin, Trash2, Search, Plus } from 'lucide-react';
import { Spot } from '@/lib/mock-data';
import { ANIMATIONS } from '@/lib/constants';
import { useState, useEffect } from 'react';
import SpotDetailModal from '@/components/SpotDetailModal';

interface SpotListProps {
  spots: Spot[];
  onReorder: (newOrder: Spot[]) => void;
  onRemoveSpot: (spotId: string) => void;
  onAddSpot: (spot: Spot) => void;
}

export function SpotList({ spots, onReorder, onRemoveSpot, onAddSpot }: SpotListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Spot[]>([]);
  const [recommendedSpots, setRecommendedSpots] = useState<Spot[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedSpotForModal, setSelectedSpotForModal] = useState<Spot | null>(null);

  // おすすめスポットの取得
  useEffect(() => {
    const getRecommendedSpots = async () => {
      const { mockSpots } = await import('@/lib/mock-data');
      // 現在選択されていないスポットから3つ選出
      const currentSpotIds = spots.map(spot => spot.id);
      const available = mockSpots.filter(spot => !currentSpotIds.includes(spot.id));
      setRecommendedSpots(available.slice(0, 3));
    };
    getRecommendedSpots();
  }, [spots]);

  // 検索機能
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { mockSpots } = await import('@/lib/mock-data');
      const currentSpotIds = spots.map(spot => spot.id);
      const filteredSpots = mockSpots.filter(spot => 
        !currentSpotIds.includes(spot.id) &&
        (spot.name.toLowerCase().includes(query.toLowerCase()) ||
         spot.description.toLowerCase().includes(query.toLowerCase()) ||
         spot.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      );
      setSearchResults(filteredSpots.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleAddSpot = (spot: Spot) => {
    onAddSpot(spot);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };
  if (spots.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center py-12 text-gray-500">
        <div>
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-lg font-medium mb-2">スポットがありません</p>
          <p className="text-sm">まずはスポットを選択してルートを作成しましょう</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* スポット追加セクション */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-bold text-gray-900">スポットを追加</h4>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            検索
          </button>
        </div>

        {/* 検索バー */}
        {showSearch && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="スポット名やキーワードで検索..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            
            {/* 検索結果 */}
            {searchQuery && (
              <div className="mt-2">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((spot) => (
                      <motion.div
                        key={spot.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:border-orange-200 transition-colors"
                      >
                        <img
                          src={spot.images[0]}
                          alt={spot.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm text-gray-900 truncate">{spot.name}</h5>
                          <p className="text-xs text-gray-500">{spot.tags.slice(0, 2).join(', ')}</p>
                        </div>
                        <button
                          onClick={() => handleAddSpot(spot)}
                          className="p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 py-2 text-center">
                    「{searchQuery}」に該当するスポットが見つかりませんでした
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* おすすめスポット */}
        {recommendedSpots.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">💡 おすすめの追加スポット</p>
            <div 
              className="w-full overflow-x-scroll pb-2"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                overflowY: 'hidden'
              }}
            >
              <div 
                className="flex gap-2"
                style={{ 
                  width: `${recommendedSpots.length * 250}px`,
                  minWidth: 'fit-content'
                }}
              >
                {recommendedSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className="flex-shrink-0"
                    style={{ width: '240px' }}
                  >
                    <motion.button
                      onClick={() => handleAddSpot(spot)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg hover:from-orange-100 hover:to-amber-100 transition-all"
                    >
                      <img
                        src={spot.images[0]}
                        alt={spot.name}
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      />
                      <span className="text-sm font-medium text-gray-900 whitespace-nowrap truncate flex-1 text-left">{spot.name}</span>
                      <Plus className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 現在のスポットリスト */}
      <div className="mb-4">
        <h4 className="text-lg font-bold text-gray-900 mb-2">
          選択したスポット ({spots.length}箇所)
        </h4>
        <p className="text-sm text-gray-600">
          ドラッグして順番を変更したり、不要なスポットを削除できます
        </p>
      </div>

      <Reorder.Group
        axis="y"
        values={spots}
        onReorder={(newOrder) => {
          console.log('SpotList: Reordering spots', newOrder.map(s => s.name))
          onReorder(newOrder)
        }}
        className="space-y-3"
      >
        <AnimatePresence>
          {spots.map((spot, index) => (
            <Reorder.Item
              key={spot.id}
              value={spot}
              className="cursor-grab active:cursor-grabbing"
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileDrag={{ scale: 1.02, zIndex: 50 }}
                className="group flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg hover:border-orange-200 transition-all shadow-sm"
              >
                {/* 順番番号 */}
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg flex-shrink-0">
                  {index + 1}
                </div>

                {/* スポット画像 */}
                <img
                  src={spot.images[0]}
                  alt={spot.name}
                  className="w-10 h-10 rounded-lg object-cover shadow-md flex-shrink-0"
                />

                {/* スポット情報 */}
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('SpotList: Clicked on spot', spot.name)
                    setSelectedSpotForModal(spot)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900 truncate pr-2">{spot.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{spot.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* タグ */}
                  <div className="flex gap-1 mt-1">
                    {spot.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 削除ボタン */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveSpot(spot.id)
                  }}
                  whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
                  whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
                  className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  title="このスポットを削除"
                >
                  <Trash2 className="w-3 h-3" />
                </motion.button>

                {/* ドラッグハンドル */}
                <div className="flex flex-col gap-0.5 flex-shrink-0 px-1 cursor-grab active:cursor-grabbing">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      
      {/* 詳細モーダル */}
      {selectedSpotForModal && (
        <SpotDetailModal
          spot={selectedSpotForModal}
          isOpen={!!selectedSpotForModal}
          onClose={() => {
            console.log('SpotList: Closing modal')
            setSelectedSpotForModal(null)
          }}
          isFromSelectedList={true}
          onRemoveSpot={onRemoveSpot}
        />
      )}
    </div>
  );
}