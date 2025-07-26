'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Spot } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation2, Sparkles } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!mapboxToken) {
  console.warn('Mapbox token not found. Map functionality will be limited.');
}

mapboxgl.accessToken = mapboxToken || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

interface MapViewProps {
  spots: Spot[];
  className?: string;
}

export default function MapView({ spots, className = '' }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [139.6503, 35.6762], // 東京
      zoom: 9,
      pitch: 45,
      bearing: -17.6
    });

    map.current.on('load', () => {
      // 3D建物を追加
      const layers = map.current?.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      map.current?.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || spots.length === 0) return;

    // 既存のマーカーを削除
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // 新しいマーカーを追加
    spots.forEach((spot, index) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.innerHTML = `
        <div class="relative">
          <div class="absolute -inset-2 bg-orange-500 rounded-full blur-md opacity-60 animate-pulse"></div>
          <div class="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            ${index + 1}
          </div>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([spot.location.lng, spot.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-3">
              <h3 class="font-bold text-gray-900">${spot.name}</h3>
              <p class="text-sm text-gray-600 mt-1">${spot.duration}</p>
            </div>
          `)
        )
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // ルートラインを描画
    if (spots.length > 1) {
      const coordinates = spots.map(spot => [spot.location.lng, spot.location.lat]);
      
      if (map.current.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates
          }
        });
      } else {
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates
            }
          }
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#F97316',
            'line-width': 4,
            'line-opacity': 0.75
          }
        });
      }

      // 全てのスポットが見えるように調整
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord as [number, number]));
      map.current.fitBounds(bounds, { padding: 100 });
    } else if (spots.length === 1) {
      // 1つの場合はそこにズーム
      map.current.flyTo({
        center: [spots[0].location.lng, spots[0].location.lat],
        zoom: 14,
        pitch: 60
      });
    }
  }, [spots]);

  // アニメーション効果
  useEffect(() => {
    if (!map.current || spots.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSpotIndex((prev) => (prev + 1) % spots.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [spots.length]);

  useEffect(() => {
    if (!map.current || spots.length === 0) return;

    const spot = spots[currentSpotIndex];
    map.current.flyTo({
      center: [spot.location.lng, spot.location.lat],
      zoom: 15,
      pitch: 60,
      bearing: Math.random() * 90 - 45,
      duration: 3000
    });

    // マーカーをバウンス
    const marker = markers.current[currentSpotIndex];
    if (marker) {
      const el = marker.getElement();
      el.classList.add('animate-card-bounce');
      setTimeout(() => el.classList.remove('animate-card-bounce'), 500);
    }
  }, [currentSpotIndex, spots]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-2xl overflow-hidden" />
      
      {/* 現在のスポット情報 */}
      <AnimatePresence mode="wait">
        {spots.length > 0 && (
          <motion.div
            key={currentSpotIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                {currentSpotIndex + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{spots[currentSpotIndex].name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Navigation2 className="w-3 h-3" />
                  <span>{spots[currentSpotIndex].duration}</span>
                  <Sparkles className="w-3 h-3 ml-2" />
                  <span>{spots[currentSpotIndex].vibes[0]}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}