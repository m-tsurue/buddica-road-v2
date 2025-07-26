import { mockSpots } from '@/lib/mock-data';
import { SpotCard } from '@/components/ui/SpotCard';
import { Spot } from '@/lib/mock-data';

interface TrendingTabProps {
  onSpotSelect: (spot: Spot) => void;
}

export function TrendingTab({ onSpotSelect }: TrendingTabProps) {
  // トレンドスポット（mockSpotsから上位3つ）
  const trendingSpots = mockSpots.slice(0, 3);

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">🔥 今話題のスポット</h3>
      <div className="space-y-4">
        {trendingSpots.map((spot, index) => (
          <div key={spot.id} className="relative">
            <SpotCard
              spot={spot}
              onClick={() => onSpotSelect(spot)}
              className="pr-20"
            />
            
            {/* ランキング番号と人気インジケーター */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-2">
                {index + 1}
              </div>
              <div className="text-xs text-gray-500 mb-1">今週の人気</div>
              <div className="text-2xl">🔥</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}