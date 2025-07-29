'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, MapPin, Star, Check } from 'lucide-react';
import { PlaceSearch } from '@/components/PlaceSearch';
import { GoogleMap } from '@/components/map/GoogleMap';
import { useSpotSelection, Location } from '@/contexts/SpotSelectionContext';
import { Spot } from '@/lib/mock-data';
import SpotDetailModal from '@/components/SpotDetailModal';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSpot, removeSpot, selectedSpots, isSelected, setStartLocation, setEndLocation } = useSpotSelection();
  
  // URLパラメータから動作モードを取得
  const mode = searchParams.get('mode'); // 'location' または null
  const locationType = searchParams.get('type'); // 'start' または 'end'
  const isLocationMode = mode === 'location';
  const isStartLocation = locationType === 'start';
  const locationTitle = isStartLocation ? '出発地' : '到着地';
  const [searchResults, setSearchResults] = useState<Spot[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Spot | null>(null);
  const [selectedSpotForModal, setSelectedSpotForModal] = useState<Spot | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 35.6895, lng: 139.6917 });

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;

    // Google PlacesのデータをSpot形式に変換
    const newSpot: Spot = {
      id: place.place_id || Math.random().toString(),
      name: place.name || '名称不明',
      description: place.formatted_address || '',
      images: place.photos?.map(photo => photo.getUrl({ maxWidth: 800 })) || ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'],
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      },
      address: place.formatted_address || '',
      tags: place.types?.slice(0, 3).map(type => type.replace(/_/g, ' ')) || [],
      rating: place.rating || 4.0,
      duration: '30分',
      bestTime: '終日',
      vibes: [],
      reviews: Math.floor(Math.random() * 1000) + 50
    };

    setSearchResults([newSpot]);
    setSelectedPlace(newSpot);
    setMapCenter({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    });
  };

  const handleAddSpot = (spot: Spot) => {
    if (isLocationMode) {
      // 位置設定モード：スポットを場所として設定
      const location: Location = {
        name: spot.name,
        address: spot.address,
        lat: spot.location.lat,
        lng: spot.location.lng
      };
      
      if (isStartLocation) {
        setStartLocation(location);
      } else {
        setEndLocation(location);
      }
      
      // フィードバック表示
      const button = document.getElementById(`add-btn-${spot.id}`);
      if (button) {
        button.textContent = `${locationTitle}に設定しました！`;
        button.classList.add('bg-green-500', 'text-white');
        setTimeout(() => {
          router.push('/route-map');
        }, 800);
      }
    } else {
      // 通常モード：ルートに追加
      addSpot(spot);
      // フィードバック表示
      const button = document.getElementById(`add-btn-${spot.id}`);
      if (button) {
        button.textContent = '追加しました！';
        button.classList.add('bg-green-500', 'text-white');
        setTimeout(() => {
          router.push('/route-map');
        }, 800);
      }
    }
  };

  const handleRemoveSpot = (spot: Spot) => {
    removeSpot(spot.id);
    
    // フィードバック表示
    const button = document.getElementById(`add-btn-${spot.id}`);
    if (button) {
      button.textContent = '削除しました';
      button.classList.add('bg-red-500', 'text-white');
      setTimeout(() => {
        button.textContent = '+ 追加';
        button.classList.remove('bg-red-500', 'text-white');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>戻る</span>
            </button>
            <h1 className="text-lg font-bold">
              {isLocationMode ? `${locationTitle}を検索` : '場所を検索'}
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* 検索エリア */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-4">
          <PlaceSearch 
            onPlaceSelect={handlePlaceSelect}
            className="w-full"
          />
        </div>
      </div>

      {/* 地図エリア */}
      <div className="h-96">
        <GoogleMap
          spots={searchResults}
          selectedSpot={selectedPlace}
          height="100%"
          showRoute={false}
        />
      </div>

      {/* 検索結果 */}
      <div className="max-w-4xl mx-auto p-4">
        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {isLocationMode ? `${locationTitle}を検索して設定しましょう` : '場所を検索してルートに追加しましょう'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((spot) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="flex">
                  {/* 写真部分 - クリック可能 */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => setSelectedSpotForModal(spot)}
                  >
                    <img
                      src={spot.images[0]}
                      alt={spot.name}
                      className="w-32 h-32 object-cover"
                    />
                  </div>
                  
                  {/* 情報部分 - クリック可能 */}
                  <div 
                    className="flex-1 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedSpotForModal(spot)}
                  >
                    <h3 className="font-bold text-lg mb-1">{spot.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{spot.address}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{spot.rating}</span>
                      </div>
                      <span>{spot.duration}</span>
                    </div>
                  </div>
                  
                  {/* ボタン部分 - クリックイベント分離 */}
                  <div className="p-4" onClick={(e) => e.stopPropagation()}>
                    {isLocationMode ? (
                      <button
                        id={`add-btn-${spot.id}`}
                        onClick={() => handleAddSpot(spot)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        {locationTitle}に設定
                      </button>
                    ) : isSelected(spot.id) ? (
                      <button
                        id={`add-btn-${spot.id}`}
                        onClick={() => handleRemoveSpot(spot)}
                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4 rotate-45" />
                        行き先から外す
                      </button>
                    ) : (
                      <button
                        id={`add-btn-${spot.id}`}
                        onClick={() => handleAddSpot(spot)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        追加
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 現在のルート - 位置設定モードでは非表示 */}
      {!isLocationMode && selectedSpots.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-4xl mx-auto">
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}