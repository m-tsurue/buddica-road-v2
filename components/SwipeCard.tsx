'use client';

import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Heart, X, MapPin, Clock, Star, Sparkles } from 'lucide-react';
import { Spot } from '@/lib/mock-data';
import { useState } from 'react';

interface SwipeCardProps {
  spot: Spot;
  onSwipe: (spot: Spot, liked: boolean) => void;
  isTop: boolean;
  hideActionButtons?: boolean;
  onCardClick?: (spot: Spot) => void;
}

export default function SwipeCard({ spot, onSwipe, isTop, hideActionButtons = false, onCardClick }: SwipeCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // スワイプに応じた回転とオパシティ
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  
  const handleDragEnd = async (_event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    if (Math.abs(offset) > 75 || Math.abs(velocity) > 300) {
      const direction = offset > 0 ? 'right' : 'left';
      
      await controls.start({
        x: offset > 0 ? 400 : -400,
        opacity: 0,
        scale: 0.8,
        rotate: offset > 0 ? 20 : -20,
        transition: { duration: 0.3, ease: "easeOut" }
      });
      
      onSwipe(spot, direction === 'right');
    } else {
      controls.start({ 
        x: 0, 
        y: 0, 
        rotate: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      });
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when cycling images
    if (spot.images.length > 1) {
      setImageIndex((prev) => (prev + 1) % spot.images.length);
    }
  };

  return (
    <motion.div
      className={`w-full ${isTop ? 'z-30' : 'z-10'} relative`}
      style={{ x, y, rotate }}
      drag={isTop}
      dragConstraints={{ left: -300, right: 300, top: -50, bottom: 50 }}
      dragElastic={0.2}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={{ scale: 0.98 }}
      whileDrag={{ scale: 1.05 }}
      initial={{ scale: isTop ? 1 : 0.95, opacity: 1 }}
    >
      <div 
        className={`w-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl relative ${!isTop ? 'brightness-95' : ''} ${onCardClick ? 'cursor-pointer' : ''}`}
        onClick={(e) => {
          // Only handle click if not dragging and onCardClick is provided
          if (onCardClick && !e.defaultPrevented) {
            onCardClick(spot);
          }
        }}
      >
        {/* 画像エリア - 高さを大きく */}
        <div 
          className="relative h-64 overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={spot.images[imageIndex]}
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          
          {/* 画像インジケーター */}
          {spot.images.length > 1 && (
            <div className="absolute top-4 right-4 flex gap-1">
              {spot.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === imageIndex ? 'bg-white w-6' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* グラデーションオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* スワイプヒント - モバイル最適化 */}
          <motion.div
            className="absolute top-10 sm:top-20 right-4 sm:right-20 px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded-full font-bold text-sm sm:text-lg transform rotate-12"
            style={{ opacity: likeOpacity }}
          >
            <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
          </motion.div>
          <motion.div
            className="absolute top-10 sm:top-20 left-4 sm:left-20 px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white rounded-full font-bold text-sm sm:text-lg transform -rotate-12"
            style={{ opacity: nopeOpacity }}
          >
            <X className="w-4 h-4 sm:w-6 sm:h-6" />
          </motion.div>
          
          {/* タグ - モバイルでサイズ縮小 */}
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex flex-wrap gap-1 sm:gap-2">
            {spot.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 sm:px-3 sm:py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* 情報エリア - 仕様固定 */}
        <div className="px-4 sm:px-6 pt-4 pb-6 space-y-3">
          {/* タイトルとレーティング */}
          <div className="flex items-start justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex-1 mr-2">{spot.name}</h2>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{spot.rating}</span>
            </div>
          </div>
          
          {/* 説明文 - 最大3行 */}
          <p className="text-gray-600 text-sm sm:text-base line-clamp-3 leading-relaxed">{spot.description}</p>
          
          {/* タップヒント */}
          {onCardClick && (
            <div className="text-center pt-2">
              <span className="text-sm text-purple-600 font-medium">タップして詳細を見る</span>
            </div>
          )}
        </div>
        
        {/* アクションボタン - モバイルサイズ縮小 */}
        {!hideActionButtons && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 sm:gap-4">
            <motion.button
              onClick={() => onSwipe(spot, false)}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </motion.button>
            <motion.button
              onClick={() => onSwipe(spot, true)}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}