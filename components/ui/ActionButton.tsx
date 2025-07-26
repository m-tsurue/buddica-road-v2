import { motion } from 'framer-motion';
import { ANIMATIONS } from '@/lib/constants';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

export function ActionButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className = ""
}: ActionButtonProps) {
  const baseClasses = "font-medium rounded-full transition-colors flex items-center justify-center gap-2";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    outline: "border-2 border-gray-200 hover:border-orange-300 bg-white text-gray-800",
    danger: "bg-red-50 hover:bg-red-100 text-red-600"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: ANIMATIONS.SCALE_HOVER }}
      whileTap={disabled ? {} : { scale: ANIMATIONS.SCALE_TAP }}
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
}