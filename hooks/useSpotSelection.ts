import { useState, useEffect } from 'react';
import { Spot } from '@/lib/mock-data';
import { generateRecommendations } from '@/lib/recommendation';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, ROUTES } from '@/lib/constants';
import { navigation } from '@/lib/utils';

export function useSpotSelection() {
  const [primaryDestination, setPrimaryDestination] = useLocalStorage<Spot | null>(
    STORAGE_KEYS.PRIMARY_DESTINATION,
    null
  );
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

  // 主要目的地が変更された時にレコメンドを生成
  useEffect(() => {
    if (primaryDestination) {
      const excludeIds = [primaryDestination.id, ...selectedSpots.map(s => s.id)];
      const recommendations = generateRecommendations(primaryDestination, excludeIds);
      setRecommendedSpots(recommendations);
      
      // 主要目的地が選択済みスポットに含まれていない場合は追加
      if (!selectedSpots.find(s => s.id === primaryDestination.id)) {
        setSelectedSpots([primaryDestination, ...selectedSpots]);
      }
    }
    setIsLoaded(true);
  }, [primaryDestination]);

  // 目的地を選択する
  const selectDestination = (spot: Spot) => {
    setPrimaryDestination(spot);
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
    setPrimaryDestination(null);
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
    primaryDestination,
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