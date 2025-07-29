'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Star, Check } from 'lucide-react'
import { Spot } from '@/lib/mock-data'
import { useSpotSelection } from '@/contexts/SpotSelectionContext'

interface SpotShowcaseProps {
  spot: Spot
  variant?: 'card' | 'list'
  onSpotClick?: (spot: Spot) => void
}

export default function SpotShowcase({ spot, variant = 'card', onSpotClick }: SpotShowcaseProps) {
  const { toggleSpot, isSelected } = useSpotSelection()
  const selected = isSelected(spot.id)

  if (variant === 'card') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="flex-shrink-0 w-48 bg-white rounded-lg overflow-hidden shadow-md cursor-pointer"
        onClick={() => onSpotClick?.(spot)}
      >
        <div className="relative h-32">
          <img 
            src={spot.images[0]} 
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          {selected && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-bold text-sm line-clamp-1">{spot.name}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3" />
            <span>122km</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleSpot(spot)
            }}
            className={`text-xs mt-2 px-2 py-1 rounded ${
              selected ? 'bg-gray-200 text-gray-600' : 'bg-orange-500 text-white'
            }`}
          >
            {selected ? '行き先から外す' : '行き先追加'}
          </button>
        </div>

      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onSpotClick?.(spot)}
    >
      <div className="flex">
        {/* 画像部分 */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <img 
            src={spot.images[0]} 
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          {/* グラデーションオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {/* 距離バッジ */}
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">122km</span>
            </div>
          </div>
        </div>

        {/* コンテンツ部分 */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{spot.name}</h3>
            
            {/* 評価 */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-yellow-700">{spot.rating}</span>
              </div>
              <span className="text-xs text-gray-500">({spot.reviews.toLocaleString()}件)</span>
            </div>

            {/* タグ */}
            <div className="flex flex-wrap gap-1 mb-2">
              {spot.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 時間情報 */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{spot.duration} • {spot.bestTime}</span>
            </div>
          </div>
        </div>

        {/* ボタン部分 */}
        <div className="flex items-center pr-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              toggleSpot(spot)
            }}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              selected 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg'
            }`}
          >
            {selected ? '外す' : '追加'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}