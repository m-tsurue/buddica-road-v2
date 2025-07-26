import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ANIMATIONS } from '@/lib/constants';

interface Area {
  name: string;
  spots: number;
  image: string;
}

interface AreaGridProps {
  onAreaSearch: (areaName: string) => void;
}

const recommendedAreas: Area[] = [
  { name: '湘南', spots: 45, image: 'https://images.unsplash.com/photo-1544967882-71b4fe52e0b3?w=200&h=120&fit=crop' },
  { name: '箱根', spots: 38, image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=200&h=120&fit=crop' },
  { name: '鎌倉', spots: 52, image: 'https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?w=200&h=120&fit=crop' },
  { name: '富士五湖', spots: 29, image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=200&h=120&fit=crop' }
];

export function AreaGrid({ onAreaSearch }: AreaGridProps) {
  return (
    <div>
      <h4 className="text-lg font-bold mb-4">おすすめエリア</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendedAreas.map((area) => (
          <motion.div
            key={area.name}
            whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
            whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
            onClick={() => onAreaSearch(area.name)}
            className="cursor-pointer"
          >
            <div className="relative rounded-xl overflow-hidden mb-2 border-2 border-transparent hover:border-orange-300 transition-colors">
              <img
                src={area.image}
                alt={area.name}
                className="w-full h-24 object-cover transition-transform hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-2 left-2 text-white">
                <div className="font-bold">{area.name}</div>
                <div className="text-xs">{area.spots}スポット</div>
              </div>
              
              {/* クリック可能であることを示すアイコン */}
              <div className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Search className="w-3 h-3 text-gray-600" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}