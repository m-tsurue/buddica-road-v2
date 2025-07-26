'use client';

import { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Grip, X, Navigation, Clock, MapPin, Sparkles } from 'lucide-react';
import { Spot, calculateDistance, estimateDrivingTime } from '@/lib/mock-data';

interface RouteEditorProps {
  spots: Spot[];
  onRemoveSpot: (id: string) => void;
  onReorderSpots: (spots: Spot[]) => void;
  onStartDrive: () => void;
}

export default function RouteEditor({ spots, onRemoveSpot, onReorderSpots, onStartDrive }: RouteEditorProps) {
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalTime, setTotalTime] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (spots.length < 2) {
      setTotalDistance(0);
      setTotalTime('');
      return;
    }

    let distance = 0;
    for (let i = 0; i < spots.length - 1; i++) {
      distance += calculateDistance(
        spots[i].location.lat,
        spots[i].location.lng,
        spots[i + 1].location.lat,
        spots[i + 1].location.lng
      );
    }
    
    setTotalDistance(Math.round(distance));
    setTotalTime(estimateDrivingTime(distance));
  }, [spots]);

  const handleReorder = (newOrder: Spot[]) => {
    setIsAnimating(true);
    onReorderSpots(newOrder);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (spots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <MapPin className="w-12 h-12 mb-4" />
        <p className="text-lg">スワイプでスポットを選んでください</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ルート統計 */}
      <motion.div 
        className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-700">
                {spots.length}ヶ所
              </span>
            </div>
            {totalDistance > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-700">
                    約{totalDistance}km
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-700">
                    {totalTime}
                  </span>
                </div>
              </>
            )}
          </div>
          <motion.button
            onClick={onStartDrive}
            className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-medium shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ドライブ開始
          </motion.button>
        </div>
      </motion.div>

      {/* スポットリスト */}
      <Reorder.Group 
        axis="y" 
        values={spots} 
        onReorder={handleReorder}
        className="space-y-3"
      >
        <AnimatePresence>
          {spots.map((spot, index) => (
            <Reorder.Item
              key={spot.id}
              value={spot}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <motion.div
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-move"
                whileHover={{ scale: 1.02 }}
                layout
              >
                <div className="flex items-center gap-4">
                  {/* ドラッグハンドル */}
                  <Grip className="w-5 h-5 text-gray-400" />
                  
                  {/* 番号 */}
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  {/* スポット情報 */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{spot.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {spot.duration}
                      </span>
                      {spot.vibes.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {spot.vibes[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* 削除ボタン */}
                  <motion.button
                    onClick={() => onRemoveSpot(spot.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </motion.button>
                </div>
                
                {/* 接続線 */}
                {index < spots.length - 1 && (
                  <motion.div
                    className="absolute left-11 top-full h-3 w-0.5 bg-gradient-to-b from-orange-300 to-red-300"
                    initial={{ height: 0 }}
                    animate={{ height: 12 }}
                    transition={{ delay: 0.2 }}
                  />
                )}
              </motion.div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}