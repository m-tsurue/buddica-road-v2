import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';
import { Spot } from '@/lib/mock-data';
import { UI, ANIMATIONS } from '@/lib/constants';

interface SpotCardProps {
  spot: Spot;
  onClick: () => void;
  showIndex?: number;
  className?: string;
}

export function SpotCard({ spot, onClick, showIndex, className = "" }: SpotCardProps) {
  return (
    <motion.div
      whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
      whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
      onClick={onClick}
      className={`flex items-center gap-4 p-4 border-2 border-gray-200 hover:border-orange-300 rounded-xl cursor-pointer transition-all ${className}`}
    >
      {/* 順番表示 */}
      {showIndex !== undefined && (
        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
          {showIndex}
        </div>
      )}

      {/* スポット画像 */}
      <img
        src={spot.images[0]}
        alt={spot.name}
        className="w-16 h-16 rounded-xl object-cover"
      />
      
      {/* スポット情報 */}
      <div className="flex-1">
        <h5 className="font-bold text-lg mb-1">{spot.name}</h5>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{spot.description}</p>
        
        {/* メタ情報 */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{spot.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{spot.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{spot.bestTime}</span>
          </div>
        </div>
        
        {/* タグ */}
        <div className="flex gap-2 mt-2">
          {spot.tags.slice(0, UI.MAX_TAGS_DISPLAY).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}