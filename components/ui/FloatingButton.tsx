'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ANIMATIONS } from '@/lib/constants';

interface FloatingButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingButton({ 
  onClick, 
  icon: Icon, 
  label, 
  className = '',
  position = 'bottom-right'
}: FloatingButtonProps) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: ANIMATIONS.SCALE_HOVER }}
      whileTap={{ scale: ANIMATIONS.SCALE_TAP }}
      className={`
        fixed z-30 
        flex items-center gap-2 
        px-4 py-3
        bg-gradient-to-r from-orange-600 to-red-600 
        text-white font-medium text-sm
        rounded-full shadow-lg
        hover:from-orange-700 hover:to-red-700
        transition-all duration-200
        ${positionClasses[position]}
        ${className}
      `}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>
      
      {/* モバイル用ツールチップ */}
      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none sm:hidden group-hover:opacity-100 transition-opacity">
        {label}
      </div>
    </motion.button>
  );
}