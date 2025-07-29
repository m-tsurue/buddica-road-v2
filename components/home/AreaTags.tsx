'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ChevronDown } from 'lucide-react'

interface AreaTagsProps {
  onTagSelect: (tag: string) => void
}

const INITIAL_TAGS = [
  { id: 'current-100', label: '現在地~100km', icon: MapPin },
  { id: 'south-kanto', label: '南関東', icon: null },
  { id: 'izu-hakone', label: '伊豆半島', icon: null },
  { id: 'boso', label: '房総半島', icon: null },
  { id: 'hokuriku', label: '北関', icon: null },
]

const ADDITIONAL_TAGS = [
  { id: 'shonan', label: '湘南', icon: null },
  { id: 'kamakura', label: '鎌倉', icon: null },
  { id: 'fuji', label: '富士五湖', icon: null },
  { id: 'nikko', label: '日光', icon: null },
  { id: 'chichibu', label: '秩父', icon: null },
]

export default function AreaTags({ onTagSelect }: AreaTagsProps) {
  const [showMore, setShowMore] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const handleTagClick = (tagId: string) => {
    setSelectedTag(tagId)
    onTagSelect(tagId)
  }

  const displayTags = showMore ? [...INITIAL_TAGS, ...ADDITIONAL_TAGS] : INITIAL_TAGS

  return (
    <div className="flex flex-wrap items-center gap-2">
      {displayTags.map((tag, index) => (
        <motion.button
          key={tag.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => handleTagClick(tag.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            selectedTag === tag.id
              ? 'bg-orange-500 text-white'
              : 'bg-white/80 backdrop-blur-sm hover:bg-white'
          }`}
        >
          {tag.icon && <tag.icon className="w-4 h-4" />}
          {tag.label}
        </motion.button>
      ))}
      
      {!showMore && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowMore(true)}
          className="px-4 py-2 rounded-full text-sm font-medium bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all flex items-center gap-1"
        >
          もっと見る
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  )
}