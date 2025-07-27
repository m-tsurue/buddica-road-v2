import { useState, useEffect } from 'react';
import { Spot } from '@/lib/mock-data';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, ROUTES } from '@/lib/constants';
import { navigation, numbers } from '@/lib/utils';

export function useRouteEditor() {
  const [selectedSpots, setSelectedSpots] = useLocalStorage<Spot[]>(
    STORAGE_KEYS.SELECTED_SPOTS,
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // 総滞在時間の計算
  const totalDuration = selectedSpots.reduce((total, spot) => {
    const hours = parseInt(spot.duration);
    return total + (isNaN(hours) ? 1 : hours);
  }, 0);

  // 推定移動時間の計算
  const estimatedDriveTime = numbers.round(selectedSpots.length * 0.5, 1);

  // スポットの順序変更
  const reorderSpots = (newOrder: Spot[]) => {
    setSelectedSpots(newOrder);
  };

  // スポット削除
  const removeSpot = (spotId: string) => {
    setSelectedSpots(prev => prev.filter(spot => spot.id !== spotId));
  };

  // スポット追加
  const addSpot = (spot: Spot) => {
    setSelectedSpots(prev => {
      // 重複チェック
      if (prev.some(existingSpot => existingSpot.id === spot.id)) {
        return prev;
      }
      return [...prev, spot];
    });
  };

  // 最初からやり直し
  const resetAll = () => {
    setSelectedSpots([]);
    navigation.push(ROUTES.HOME);
  };

  // ナビゲーション開始
  const startNavigation = () => {
    // TODO: ナビゲーション機能実装時に更新
    alert('ナビゲーション機能は今後実装予定です');
  };

  // ルート保存
  const saveRoute = () => {
    // TODO: ルート保存機能実装時に更新
    alert('ルート保存機能は今後実装予定です');
  };

  // ルート共有
  const shareRoute = () => {
    // TODO: ルート共有機能実装時に更新
    if (navigator.share) {
      navigator.share({
        title: 'BUDDICA ROAD - ドライブルート',
        text: `${selectedSpots.length}箇所のドライブルートを作成しました！`,
        url: window.location.href,
      });
    } else {
      alert('ルート共有機能は今後実装予定です');
    }
  };

  return {
    // State
    selectedSpots,
    isLoading,
    totalDuration,
    estimatedDriveTime,

    // Actions
    reorderSpots,
    removeSpot,
    addSpot,
    resetAll,
    startNavigation,
    saveRoute,
    shareRoute,

    // Computed
    hasSpots: selectedSpots.length > 0,
  };
}