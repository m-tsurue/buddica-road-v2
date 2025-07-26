import { motion } from 'framer-motion';
import { ANIMATIONS } from '@/lib/constants';

interface Category {
  name: string;
  icon: string;
  count: number;
}

interface CategoryGridProps {
  onCategorySearch: (category: string) => void;
}

const popularCategories: Category[] = [
  { name: '温泉', icon: '♨️', count: 234 },
  { name: '絶景', icon: '🌅', count: 189 },
  { name: 'グルメ', icon: '🍽️', count: 156 },
  { name: '歴史', icon: '🏯', count: 98 },
  { name: 'アート', icon: '🎨', count: 87 },
  { name: 'カフェ', icon: '☕', count: 145 }
];

export function CategoryGrid({ onCategorySearch }: CategoryGridProps) {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-bold mb-4">人気のカテゴリ</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {popularCategories.map((category) => (
          <motion.button
            key={category.name}
            whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
            whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
            onClick={() => onCategorySearch(category.name)}
            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors text-left"
          >
            <span className="text-2xl">{category.icon}</span>
            <div>
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-gray-500">{category.count}件</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}