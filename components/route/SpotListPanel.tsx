'use client';

import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, Clock, MapPin, Trash2 } from 'lucide-react';
import { Spot } from '@/lib/mock-data';
import { ANIMATIONS } from '@/lib/constants';

interface SpotListPanelProps {
  isOpen: boolean;
  onClose: () => void;
  spots: Spot[];
  onReorder: (newOrder: Spot[]) => void;
  onRemoveSpot: (spotId: string) => void;
}

export function SpotListPanel({ isOpen, onClose, spots, onReorder, onRemoveSpot }: SpotListPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* スライドインパネル */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden"
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                スポット一覧 ({spots.length})
              </h2>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
                whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* スポットリスト */}
            <div className="flex-1 overflow-y-auto p-4">
              {spots.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>スポットが選択されていません</p>
                </div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={spots}
                  onReorder={onReorder}
                  className="space-y-3"
                >
                  <AnimatePresence>
                    {spots.map((spot, index) => (
                      <Reorder.Item
                        key={spot.id}
                        value={spot}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          whileDrag={{ scale: 1.02, zIndex: 50 }}
                          className="group flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-orange-200 transition-all shadow-sm"
                        >
                          {/* 順番番号 */}
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                            {index + 1}
                          </div>

                          {/* スポット画像 */}
                          <img
                            src={spot.images[0]}
                            alt={spot.name}
                            className="w-12 h-12 rounded-lg object-cover shadow-md flex-shrink-0"
                          />

                          {/* スポット情報 */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-900 truncate">{spot.name}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{spot.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{spot.bestTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* 削除ボタン */}
                          <motion.button
                            onClick={() => onRemoveSpot(spot.id)}
                            whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
                            whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
                            className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>

                          {/* ドラッグハンドル */}
                          <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          </div>
                        </motion.div>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}