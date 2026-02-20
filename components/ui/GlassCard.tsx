import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', delay = 0 }) => {
  // Randomize animation parameters to prevent synchronization
  const anim = useMemo(() => ({
    duration: 6 + Math.random() * 4, // 6s - 10s
    delay: Math.random() * 2,
    xOffset: 4 + Math.random() * 4, // 4px - 8px movement
    yOffset: 4 + Math.random() * 4,
    skew: 2 + Math.random() * 2 // 2deg - 4deg skew
  }), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 15, 
        delay: delay * 0.1 
      }}
      className={`relative group ${className}`}
    >
      {/* Animated Water-like Background */}
      <motion.div 
        className="absolute top-2 left-2 w-full h-full bg-thl-blue/5 border border-thl-blue/10 -z-10" 
        animate={{ 
          skewX: [0, anim.skew, -anim.skew * 0.5, 0],
          skewY: [0, anim.skew * 0.5, -anim.skew, 0],
          x: [0, anim.xOffset, -anim.xOffset * 0.5, 0],
          y: [0, -anim.yOffset, anim.yOffset * 0.5, 0],
          borderRadius: ["0%", "2% 1% 2% 1%", "1% 2% 1% 3%", "0%"]
        }}
        transition={{
          duration: anim.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: anim.delay
        }}
      />

      {/* Main Glass Layer (Rectangular) */}
      <div className="relative h-full backdrop-blur-xl bg-thl-glass border border-thl-glassBorder shadow-glass p-8 transition-transform duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1">
        {/* Subtle Inner Highlight */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/80 to-transparent opacity-60" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
};