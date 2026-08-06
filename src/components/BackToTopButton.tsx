// ============================================================
// components/BackToTopButton.tsx
// ============================================================
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface BackToTopButtonProps {
  threshold?: number; // Scroll threshold in pixels to show button
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  threshold = 500,
  position = 'bottom-right',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > threshold);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
    'top-left': 'top-8 left-8',
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: 0.2 }}
      onClick={scrollToTop}
      className={`fixed z-50 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full backdrop-blur-sm cursor-pointer hover:bg-emerald-500/30 transition-all group ${positionClasses[position]} ${className}`}
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
    </motion.button>
  );
};

export default BackToTopButton;