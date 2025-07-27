'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Route, Play, Download, Share2, RotateCcw, Map, List } from 'lucide-react';
import { Spot } from '@/lib/mock-data';
import Link from 'next/link';
import { useRouteEditor } from '@/hooks/useRouteEditor';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ActionButton } from '@/components/ui/ActionButton';
import { MapboxMap } from '@/components/map/MapboxMap';
import { SpotList } from '@/components/route/SpotList';
import { ANIMATIONS, ROUTES } from '@/lib/constants';
import { useState } from 'react';

export default function RouteEditor() {
  const {
    selectedSpots,
    isLoading,
    totalDuration,
    estimatedDriveTime,
    hasSpots,
    reorderSpots,
    removeSpot,
    addSpot,
    resetAll,
    startNavigation,
    saveRoute,
    shareRoute
  } = useRouteEditor();

  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');

  if (isLoading) {
    return <LoadingSpinner message="ルートを読み込み中..." />;
  }

  if (!hasSpots) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">スポットが選択されていません</h2>
          <p className="text-gray-600 mb-6">まずはスポットを選んでからルートを作成しましょう</p>
          <Link href={ROUTES.HOME}>
            <ActionButton variant="primary" onClick={() => {}}>
              スポット選択に戻る
            </ActionButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={ROUTES.HOME}>
                <motion.button
                  whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
                  whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">ドライブルート</h1>
              
              {/* リセットボタン */}
              <motion.button
                whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
                whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
                onClick={resetAll}
                className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                title="最初からやり直す"
              >
                <RotateCcw className="w-5 h-5 text-red-600" />
              </motion.button>
            </div>
            
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        {/* コンパクトなルートサマリ */}
        <div className="bg-white rounded-xl p-3 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold flex items-center gap-2 truncate">
              <Route className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="truncate">{selectedSpots[0]?.name} → {selectedSpots[selectedSpots.length - 1]?.name}</span>
            </h2>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{selectedSpots.length}箇所</span>
          </div>
          
          <div className="flex gap-4 text-center">
            <div className="flex-1">
              <div className="text-sm font-bold text-orange-600">{totalDuration}h</div>
              <div className="text-xs text-gray-600">滞在</div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-blue-600">{estimatedDriveTime}h</div>
              <div className="text-xs text-gray-600">移動</div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-green-600">{totalDuration + estimatedDriveTime}h</div>
              <div className="text-xs text-gray-600">合計</div>
            </div>
          </div>
        </div>

        {/* ルートプレビュー */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            {/* タブ切り替えボタン */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('map')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'map'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4" />
                地図
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                リスト
              </button>
            </div>
            
            <div className="flex gap-2">
              <ActionButton
                onClick={saveRoute}
                variant="secondary"
                icon={Download}
                size="sm"
                className="aspect-square p-2"
              />
              
              <ActionButton
                onClick={shareRoute}
                variant="outline"
                icon={Share2}
                size="sm"
                className="aspect-square p-2 bg-white"
              />
            </div>
          </div>
          
          {/* コンテンツエリア */}
          <div className="relative">
            {activeTab === 'map' ? (
              <MapboxMap
                key="route-editor-map"
                spots={selectedSpots}
                height="600px"
                showRoute={true}
                className="w-full"
                onSpotRemove={(spot) => removeSpot(spot.id)}
              />
            ) : (
              <div className="h-[600px] overflow-y-auto">
                <SpotList
                  spots={selectedSpots}
                  onReorder={reorderSpots}
                  onRemoveSpot={removeSpot}
                  onAddSpot={addSpot}
                />
              </div>
            )}
          </div>
        </div>

        {/* おすすめタイミング */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200 mt-4">
          <h3 className="text-sm font-bold text-orange-800 mb-2">💡 おすすめの出発時間</h3>
          <p className="text-xs text-orange-700 mb-2">
            現在のルートなら午前10時出発がベスト！
          </p>
          <div className="text-xs text-orange-600">
            🌅 10:00 出発 → 🌅 11:00 {selectedSpots[0]?.name}
            {selectedSpots.length > 1 && (
              <> → 🍽️ 13:00 ランチ → 🎨 15:00 {selectedSpots[selectedSpots.length - 1]?.name}</>
            )}
          </div>
        </div>
      </main>

      {/* スティッキーナビ開始ボタン */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 z-30">
        <div className="max-w-7xl mx-auto">
          <ActionButton
            onClick={startNavigation}
            variant="primary"
            icon={Play}
            className="w-full"
          >
            ナビゲーション開始
          </ActionButton>
        </div>
      </div>

    </div>
  );
}