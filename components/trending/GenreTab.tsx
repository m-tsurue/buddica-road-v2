'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TreePine, 
  Waves, 
  Mountain, 
  Camera, 
  Heart, 
  Star,
  MapPin,
  Clock
} from 'lucide-react';
import { Spot } from '@/lib/mock-data';
import { ANIMATIONS } from '@/lib/constants';

interface GenreTabProps {
  onSpotSelect: (spot: Spot) => void;
}

const GENRES = [
  {
    id: 'nature',
    name: '自然・絶景',
    icon: TreePine,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    tags: ['絶景', '自然', '山', '海', '湖', '森林', '公園'],
  },
  {
    id: 'water',
    name: '海・水辺',
    icon: Waves,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    tags: ['海', '湖', '川', '滝', '温泉', 'ビーチ', '水族館'],
  },
  {
    id: 'mountain',
    name: '山・高原',
    icon: Mountain,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50',
    tags: ['山', '高原', '峠', '展望台', 'ロープウェイ'],
  },
  {
    id: 'culture',
    name: '歴史・文化',
    icon: Star,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    tags: ['歴史', '文化', '神社', '寺院', '城', '博物館', '美術館'],
  },
  {
    id: 'photo',
    name: 'フォトスポット',
    icon: Camera,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    tags: ['写真映え', 'インスタ映え', 'フォトジェニック', 'アート'],
  },
  {
    id: 'romantic',
    name: 'デート・カップル',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    tags: ['デート', 'ロマンチック', '夕日', '夜景', 'イルミネーション'],
  },
];

export function GenreTab({ onSpotSelect }: GenreTabProps) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // スポットデータの読み込み
  useEffect(() => {
    const loadSpots = async () => {
      const { mockSpots } = await import('@/lib/mock-data');
      setSpots(mockSpots);
    };
    loadSpots();
  }, []);

  // ジャンル選択時のフィルタリング
  useEffect(() => {
    if (!selectedGenre || !spots.length) {
      setFilteredSpots([]);
      return;
    }

    setIsLoading(true);
    
    const genre = GENRES.find(g => g.id === selectedGenre);
    if (!genre) return;

    // タグベースでフィルタリング
    const filtered = spots.filter(spot =>
      genre.tags.some(tag =>
        spot.tags.some(spotTag => spotTag.includes(tag)) ||
        spot.vibes.some(vibe => vibe.includes(tag)) ||
        spot.name.includes(tag) ||
        spot.description.includes(tag)
      )
    );

    // 評価順でソート
    const sorted = filtered.sort((a, b) => b.rating - a.rating);
    
    setTimeout(() => {
      setFilteredSpots(sorted);
      setIsLoading(false);
    }, 300); // 読み込み感を演出
  }, [selectedGenre, spots]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          どんな体験をお探しですか？
        </h3>
        <p className="text-sm text-gray-600">
          ジャンルを選んで、お好みのスポットを見つけましょう
        </p>
      </div>

      {/* ジャンル選択 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {GENRES.map((genre) => {
          const Icon = genre.icon;
          const isSelected = selectedGenre === genre.id;
          
          return (
            <motion.button
              key={genre.id}
              whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
              whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
              onClick={() => setSelectedGenre(genre.id)}
              className={`relative p-4 rounded-xl border-2 transition-all overflow-hidden ${
                isSelected
                  ? 'border-orange-300 bg-orange-50'
                  : `border-gray-200 ${genre.bgColor} hover:border-orange-200`
              }`}
            >
              {isSelected && (
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-10`} />
              )}
              
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${genre.color} flex items-center justify-center mb-2 mx-auto`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {genre.name}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 検索結果 */}
      {selectedGenre && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-gray-900">
              {GENRES.find(g => g.id === selectedGenre)?.name}のスポット
            </h4>
            {filteredSpots.length > 0 && (
              <span className="text-sm text-gray-600">
                {filteredSpots.length}件見つかりました
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-32"></div>
                </div>
              ))}
            </div>
          ) : filteredSpots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSpots.slice(0, 8).map((spot) => (
                <motion.div
                  key={spot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
                  onClick={() => onSpotSelect(spot)}
                  className="cursor-pointer bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="relative h-32">
                    <img
                      src={spot.images[0]}
                      alt={spot.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                      ⭐ {spot.rating}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h5 className="font-bold text-sm text-gray-900 mb-1 truncate">
                      {spot.name}
                    </h5>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {spot.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{spot.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{spot.bestTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 mt-2">
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
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Camera className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>このジャンルのスポットが見つかりませんでした</p>
              <p className="text-sm">他のジャンルもお試しください</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}