'use client';

import { Spot } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation2, Sparkles } from 'lucide-react';

interface MapViewProps {
  spots: Spot[];
  className?: string;
}

export default function MapView({ spots, className = '' }: MapViewProps) {
  return (
    <div className={`relative ${className} flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl`}>
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Navigation2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">地図機能</h3>
        <p className="text-gray-600 mb-4">
          {spots.length > 0 ? `${spots.length}個のスポットが選択されています` : 'スポットを選択してください'}
        </p>
        
        {spots.length > 0 && (
          <div className="space-y-2">
            {spots.map((spot, index) => (
              <div key={spot.id} className="flex items-center gap-3 bg-white/80 rounded-lg p-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-sm">{spot.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Sparkles className="w-3 h-3" />
                    <span>{spot.vibes[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-4">
          ※ 地図機能は開発中です
        </p>
      </div>
    </div>
  );
}