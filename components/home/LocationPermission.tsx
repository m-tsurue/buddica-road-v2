'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { ANIMATIONS } from '@/lib/constants';

interface LocationPermissionProps {
  onLocationGranted: (coords: GeolocationCoordinates) => void;
  onLocationDenied: () => void;
}

export function LocationPermission({ onLocationGranted, onLocationDenied }: LocationPermissionProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async () => {
    setIsRequesting(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('お使いのブラウザは位置情報に対応していません');
      setIsRequesting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsRequesting(false);
        onLocationGranted(position.coords);
      },
      (error) => {
        setIsRequesting(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('位置情報の使用が拒否されました');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('位置情報が取得できませんでした');
            break;
          case error.TIMEOUT:
            setError('位置情報の取得がタイムアウトしました');
            break;
          default:
            setError('位置情報の取得中にエラーが発生しました');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              現在地を使用しますか？
            </h3>
            <p className="text-sm text-gray-600">
              現在地から最適なドライブコースを提案します
            </p>
          </div>
        </div>
        <button
          onClick={onLocationDenied}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
          whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
          onClick={requestLocation}
          disabled={isRequesting}
          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRequesting ? '取得中...' : '現在地を使用'}
        </motion.button>
        <motion.button
          whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
          whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
          onClick={onLocationDenied}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          スキップ
        </motion.button>
      </div>
    </motion.div>
  );
}