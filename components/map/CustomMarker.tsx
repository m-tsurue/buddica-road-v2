'use client';

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

interface CustomMarkerProps {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  index: number;
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CustomMarker({
  map,
  position,
  index,
  name,
  isSelected = false,
  onClick
}: CustomMarkerProps) {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const rootRef = useRef<any>(null);

  useEffect(() => {
    if (!window.google || !map) return;

    // カスタムマーカーの要素を作成
    const content = document.createElement('div');
    content.className = 'custom-marker-container';
    
    // Reactコンポーネントをレンダリング
    rootRef.current = createRoot(content);
    rootRef.current.render(
      <div 
        className={`
          relative cursor-pointer transition-all duration-200 
          ${isSelected ? 'scale-110' : 'hover:scale-105'}
        `}
        onClick={onClick}
      >
        {/* メインマーカー */}
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center
          shadow-lg border-3 border-white
          ${isSelected 
            ? 'bg-gradient-to-br from-green-500 to-green-600' 
            : 'bg-gradient-to-br from-orange-500 to-red-500'
          }
        `}>
          <span className="text-white font-bold text-lg">
            {index + 1}
          </span>
        </div>
        
        {/* 下部の三角形ポインター */}
        <div className={`
          absolute left-1/2 -translate-x-1/2 -bottom-2
          w-0 h-0 
          border-l-[8px] border-l-transparent
          border-r-[8px] border-r-transparent
          ${isSelected
            ? 'border-t-[10px] border-t-green-600'
            : 'border-t-[10px] border-t-red-500'
          }
        `} />
        
        {/* ラベル（ホバー時に表示） */}
        <div className={`
          absolute left-1/2 -translate-x-1/2 -top-8
          bg-gray-800 text-white text-xs px-2 py-1 rounded
          whitespace-nowrap opacity-0 hover:opacity-100 
          transition-opacity duration-200 pointer-events-none
        `}>
          {name}
        </div>
      </div>
    );

    // AdvancedMarkerElementを作成
    const { AdvancedMarkerElement } = google.maps.marker;
    
    markerRef.current = new AdvancedMarkerElement({
      map,
      position,
      content,
      zIndex: isSelected ? 1000 : index
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, [map, position, index, name, isSelected, onClick]);

  // 位置やスタイルが変更されたときに更新
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.position = position;
      markerRef.current.zIndex = isSelected ? 1000 : index;
    }
  }, [position, index, isSelected]);

  return null;
}