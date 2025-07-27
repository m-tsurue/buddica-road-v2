import { useState, useEffect } from 'react';
import { MapboxMap } from './MapboxMap';
import { mockSpots, Spot } from '@/lib/mock-data';
import { SpotCard } from '@/components/ui/SpotCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { MapPin, List, Grid } from 'lucide-react';

interface MapTabProps {
  onSpotSelect: (spot: Spot) => void;
}

export function MapTab({ onSpotSelect }: MapTabProps) {
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>(mockSpots);

  // 地図でスポットを選択した時の処理（ポップアップからの選択）
  const handleMapSpotSelect = (spot: Spot) => {
    onSpotSelect(spot);
  };

  // スポットを目的地として選択
  const handleSpotConfirm = (spot: Spot) => {
    onSpotSelect(spot);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">🗺️ 地図から選ぶ</h3>
        
        {/* 表示モード切り替え */}
        <div className="flex items-center gap-2">
          <ActionButton
            onClick={() => setViewMode('map')}
            variant={viewMode === 'map' ? 'primary' : 'outline'}
            size="sm"
            icon={MapPin}
          >
            地図
          </ActionButton>
          <ActionButton
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            icon={List}
          >
            リスト
          </ActionButton>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="space-y-6">
          {/* 地図コンポーネント */}
          <MapboxMap
            spots={filteredSpots}
            selectedSpot={selectedSpot}
            onSpotSelect={handleMapSpotSelect}
            height="500px"
            className="shadow-lg"
          />

          {/* 選択されたスポットの詳細 */}
          {selectedSpot && (
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-orange-200">
              <div className="flex items-start gap-4">
                <img
                  src={selectedSpot.images[0]}
                  alt={selectedSpot.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2">{selectedSpot.name}</h4>
                  <p className="text-gray-600 mb-3">{selectedSpot.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>⭐ {selectedSpot.rating}</span>
                    <span>⏱️ {selectedSpot.duration}</span>
                    <span>📍 {selectedSpot.bestTime}</span>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    {selectedSpot.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <ActionButton
                    onClick={() => handleSpotConfirm(selectedSpot)}
                    variant="primary"
                    icon={MapPin}
                  >
                    このスポットを選ぶ
                  </ActionButton>
                </div>
              </div>
            </div>
          )}

          {/* 使い方の説明 */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">💡 使い方</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 地図上のマーカーをクリックしてスポット詳細を確認</li>
              <li>• 気になるスポットを見つけたら「このスポットを選ぶ」をクリック</li>
              <li>• 選択したスポットを起点におすすめルートを作成します</li>
            </ul>
          </div>
        </div>
      ) : (
        /* リスト表示 */
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                onClick={() => handleSpotConfirm(spot)}
                className={selectedSpot?.id === spot.id ? 'border-orange-500 bg-orange-50' : ''}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}