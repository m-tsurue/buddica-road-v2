import { GenreTab } from './GenreTab';
import { Spot } from '@/lib/mock-data';

interface TrendingTabProps {
  onSpotSelect: (spot: Spot) => void;
}

export function TrendingTab({ onSpotSelect }: TrendingTabProps) {
  return <GenreTab onSpotSelect={onSpotSelect} />;
}