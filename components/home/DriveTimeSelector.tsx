'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Hotel } from 'lucide-react';
import { ANIMATIONS } from '@/lib/constants';

interface DriveTimeSelectorProps {
  onSelect: (type: 'short' | 'day' | 'overnight') => void;
}

export function DriveTimeSelector({ onSelect }: DriveTimeSelectorProps) {
  const options = [
    {
      id: 'short',
      icon: Clock,
      title: '2-3時間',
      subtitle: '~100km圏内',
      description: 'ちょっとしたドライブ',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'day',
      icon: MapPin,
      title: '日帰り',
      subtitle: '~200km圏内',
      description: '1日楽しむドライブ',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      id: 'overnight',
      icon: Hotel,
      title: '1泊2日',
      subtitle: '200km以上',
      description: '泊まりがけの旅行',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          どのくらいの時間をかけますか？
        </h3>
        <p className="text-sm text-gray-600">
          現在地からの距離と時間で、おすすめスポットを提案します
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
              whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
              onClick={() => onSelect(option.id as 'short' | 'day' | 'overnight')}
              className={`relative p-6 rounded-2xl border-2 ${option.borderColor} ${option.bgColor} hover:shadow-lg transition-all group overflow-hidden`}
            >
              {/* 背景グラデーション */}
              <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center mb-4 mx-auto`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {option.title}
                </h4>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {option.subtitle}
                </p>
                <p className="text-xs text-gray-600">
                  {option.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}