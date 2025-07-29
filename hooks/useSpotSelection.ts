import { useState, useEffect } from 'react';
import { Spot } from '@/lib/mock-data';
import { generateRecommendations } from '@/lib/recommendation';
import { getSpotsByDistance, getSavedLocation, DRIVE_TIME_LIMITS } from '@/lib/location-utils';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, ROUTES } from '@/lib/constants';
import { navigation } from '@/lib/utils';

interface SwipeParams {
  driveTime?: 'short' | 'day' | 'overnight';
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

export function useSpotSelection() {
  const [selectedSpots, setSelectedSpots] = useLocalStorage<Spot[]>(
    STORAGE_KEYS.SELECTED_SPOTS,
    []
  );
  const [currentIndex, setCurrentIndex] = useLocalStorage<number>(
    STORAGE_KEYS.CURRENT_INDEX,
    0
  );

  const [recommendedSpots, setRecommendedSpots] = useState<Spot[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // スポットを読み込む
  useEffect(() => {
    const loadSpots = async () => {
      try {
        // SSRセーフチェック
        if (typeof window === 'undefined') return;
        
        const searchParams = localStorage.getItem('searchParams');
        const primaryDestination = localStorage.getItem('primaryDestination');
        
        let spots: Spot[] = [];

        if (searchParams) {
          // 距離・時間ベースの検索
          const params: SwipeParams = JSON.parse(searchParams);
          
          if (params.driveTime && params.userLocation) {
            const { mockSpots } = await import('@/lib/mock-data');
            const filter = DRIVE_TIME_LIMITS[params.driveTime];
            
            const filteredSpots = getSpotsByDistance(
              mockSpots,
              params.userLocation,
              filter
            );
            
            spots = filteredSpots.sort((a, b) => b.rating - a.rating);
          }
        } else if (primaryDestination) {
          // 従来の目的地ベースレコメンド
          const destination: Spot = JSON.parse(primaryDestination);
          const excludeIds = selectedSpots.map(s => s.id);
          spots = generateRecommendations(destination, excludeIds);
        } else {
          // フォールバック: 人気スポット
          const { mockSpots } = await import('@/lib/mock-data');
          spots = mockSpots.sort((a, b) => b.rating - a.rating).slice(0, 10);
        }

        setRecommendedSpots(spots);
      } catch (error) {
        console.error('スポット読み込みエラー:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSpots();
  }, [selectedSpots]);

  // 目的地を選択する（非推奨 - 新しいトップページでは使用しない）
  const selectDestination = (spot: Spot) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('primaryDestination', JSON.stringify(spot));
    }
    navigation.push(ROUTES.SWIPE);
  };

  // スポットをスワイプで選択/スキップ
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      const spot = recommendedSpots[currentIndex];
      if (spot && !selectedSpots.find(s => s.id === spot.id)) {
        setSelectedSpots([...selectedSpots, spot]);
      }
    }
    setCurrentIndex(currentIndex + 1);
  };

  // リセット
  const reset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('primaryDestination');
      localStorage.removeItem('searchParams');
    }
    setSelectedSpots([]);
    setCurrentIndex(0);
    setRecommendedSpots([]);
    navigation.push(ROUTES.HOME);
  };

  // 選択済みスポットから削除
  const removeSpot = (spotId: string) => {
    setSelectedSpots(selectedSpots.filter(s => s.id !== spotId));
  };

  // レコメンドスポットが残っているかどうか
  const hasMoreSpots = currentIndex < recommendedSpots.length;

  // ルート編集画面に遷移
  const proceedToRouteEditor = () => {
    navigation.push(ROUTES.ROUTE_EDITOR);
  };

  return {
    // State
    selectedSpots,
    currentIndex,
    recommendedSpots,
    isLoaded,
    hasMoreSpots,

    // Actions
    selectDestination,
    handleSwipe,
    reset,
    removeSpot,
    proceedToRouteEditor,
    setSelectedSpots,

    // Current spot
    currentSpot: recommendedSpots[currentIndex] || null,
  };
}