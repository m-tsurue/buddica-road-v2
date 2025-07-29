import { useState, useEffect } from 'react';
import { Spot } from '@/lib/mock-data';
import { generateRecommendations } from '@/lib/recommendation';
import { getSpotsByDistance, getSavedLocation, DRIVE_TIME_LIMITS } from '@/lib/location-utils';

interface SwipeParams {
  driveTime?: 'short' | 'day' | 'overnight';
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

export function useSwipeSpots() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpots = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // SSRセーフチェック
        if (typeof window === 'undefined') return;

        // localStorage から検索パラメータを取得
        const searchParams = localStorage.getItem('searchParams');
        const primaryDestination = localStorage.getItem('primaryDestination');
        
        let recommendedSpots: Spot[] = [];

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
            
            // 評価が高い順にソート
            recommendedSpots = filteredSpots.sort((a, b) => b.rating - a.rating);
          }
        } else if (primaryDestination) {
          // 従来の目的地ベースレコメンド
          const destination: Spot = JSON.parse(primaryDestination);
          recommendedSpots = generateRecommendations(destination);
        } else {
          // フォールバック: 人気スポット
          const { mockSpots } = await import('@/lib/mock-data');
          recommendedSpots = mockSpots.sort((a, b) => b.rating - a.rating).slice(0, 10);
        }

        setSpots(recommendedSpots);
      } catch (err) {
        console.error('スポット読み込みエラー:', err);
        setError('スポットの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadSpots();
  }, []);

  const getSwipeContext = (): string => {
    if (typeof window === 'undefined') return '人気スポットから選ぶ';
    
    const searchParams = localStorage.getItem('searchParams');
    const primaryDestination = localStorage.getItem('primaryDestination');
    
    if (searchParams) {
      const params: SwipeParams = JSON.parse(searchParams);
      const userLocation = getSavedLocation();
      
      if (params.driveTime && userLocation) {
        const filter = DRIVE_TIME_LIMITS[params.driveTime];
        return `現在地から${filter.maxDistance}km圏内（${filter.driveTime === 'short' ? '2-3時間' : filter.driveTime === 'day' ? '日帰り' : '1泊2日'}コース）`;
      }
    } else if (primaryDestination) {
      const destination: Spot = JSON.parse(primaryDestination);
      return `${destination.name} をベースにレコメンド`;
    }
    
    return '人気スポットから選ぶ';
  };

  return {
    spots,
    isLoading,
    error,
    swipeContext: getSwipeContext(),
  };
}