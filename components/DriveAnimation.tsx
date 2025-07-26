'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Sparkles, MapPin, Clock } from 'lucide-react';
import { Spot } from '@/lib/mock-data';

interface DriveAnimationProps {
  currentSpot: Spot;
  nextSpot: Spot | null;
  onArrival: () => void;
}

export default function DriveAnimation({ currentSpot, nextSpot, onArrival }: DriveAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [showArrivalAnimation, setShowArrivalAnimation] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowArrivalAnimation(true);
          setTimeout(() => {
            onArrival();
            setShowArrivalAnimation(false);
            setProgress(0);
          }, 3000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentSpot, onArrival]);

  useEffect(() => {
    if (progress > 80 && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [progress, countdown]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 z-50">
      {/* 背景アニメーション */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-20, 20, -20],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {!showArrivalAnimation ? (
            <motion.div
              key="driving"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center text-white max-w-2xl"
            >
              {/* 現在地 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <Navigation className="w-5 h-5" />
                  <span className="text-lg font-medium">移動中</span>
                </div>
              </motion.div>

              {/* プログレスバー */}
              <div className="w-full max-w-md mx-auto mb-8">
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-pink-400"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* 次のスポット情報 */}
              {nextSpot && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8"
                >
                  <h2 className="text-2xl font-bold mb-4">
                    次の目的地
                  </h2>
                  <h3 className="text-3xl font-bold mb-2 gradient-text">
                    {nextSpot.name}
                  </h3>
                  <div className="flex items-center justify-center gap-4 text-white/80">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {nextSpot.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {nextSpot.bestTime}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* カウントダウン */}
              {progress > 80 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl font-bold"
                >
                  {countdown > 0 ? countdown : '到着！'}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="arrival"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center text-white"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="mb-8"
              >
                <Sparkles className="w-24 h-24 mx-auto" />
              </motion.div>
              <h2 className="text-4xl font-bold mb-4">到着しました！</h2>
              <h3 className="text-2xl mb-8">{currentSpot.name}</h3>
              
              {/* Vibesタグ */}
              <div className="flex items-center justify-center gap-3">
                {currentSpot.vibes.map((vibe, index) => (
                  <motion.span
                    key={vibe}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full"
                  >
                    {vibe}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}