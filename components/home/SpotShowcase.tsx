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
      whileHover={{ x: 4 }}
      className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4 cursor-pointer"
      onClick={() => onSpotClick?.(spot)}
    >
      <img 
        src={spot.images[0]} 
        alt={spot.name}
        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-grow">
        <h3 className="font-bold text-lg">{spot.name}</h3>
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          <MapPin className="w-4 h-4" />
          <span>122km</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{spot.rating}/5</span>
          </div>
          <span className="text-sm text-gray-500">({spot.reviews}件の口コミ)</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          営業時間：00:00~223:59 駐車場：あり（有料）
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          toggleSpot(spot)
        }}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          selected 
            ? 'bg-gray-200 text-gray-600' 
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        {selected ? '行き先から外す' : '行き先追加'}
      </motion.button>

    </motion.div>
  )
}