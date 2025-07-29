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
    <div className="relative w-full h-full">
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
          style={{ height: '380px' }}
          onClick={(e) => {
            // Only handle click if not dragging and onCardClick is provided
            if (onCardClick && !e.defaultPrevented) {
              onCardClick(spot);
            }
          }}
        >
        {/* 画像エリア - 70%の高さ */}
        <div 
          className="relative overflow-hidden cursor-pointer"
          style={{ height: '70%' }}
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
        
        {/* 情報エリア - コンパクト */}
        <div className="px-4 sm:px-6 pt-3 pb-3 space-y-2">
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
            <div className="text-center pt-1">
              <span className="text-xs text-purple-600 font-medium">タップして詳細を見る</span>
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
      
      {/* スワイプヒント - 固定位置オーバーレイ（カードの元の位置に固定） */}
      {isTop && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-500/30 backdrop-blur-sm flex items-center justify-center pointer-events-none z-50"
            style={{ opacity: likeOpacity }}
          >
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/20 transform rotate-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="text-lg font-bold text-gray-800">追加</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-500/30 backdrop-blur-sm flex items-center justify-center pointer-events-none z-50"
            style={{ opacity: nopeOpacity }}
          >
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/20 transform -rotate-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-800">スキップ</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}