import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface THLButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}

export const THLButton: React.FC<THLButtonProps> = ({ text, href, onClick, variant = 'primary' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isPrimary = variant === 'primary';

  const containerVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 }
  };

  const bgVariants = {
    initial: { x: '-101%' },
    hover: { x: '0%' }
  };

  // Unique random animation for each button
  const anim = useMemo(() => ({
    duration: 4 + Math.random() * 3, // 4s - 7s
    skewX: 2 + Math.random() * 3,
    skewY: 1 + Math.random() * 2,
    move: 2 + Math.random() * 2
  }), []);

  return (
    <motion.a
      href={href}
      onClick={onClick}
      className="relative inline-block group cursor-pointer no-underline"
      initial="initial"
      whileHover="hover"
      animate="initial"
      variants={containerVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Fluid BG */}
      <motion.div 
        className={`absolute top-1 left-1 w-full h-full -z-10 transition-colors duration-300 ${isPrimary ? 'bg-thl-blue/20' : 'bg-thl-dim/10 group-hover:bg-thl-blue/10'}`}
        animate={{ 
          skewX: [-anim.skewX, anim.skewX, -1, -anim.skewX],
          skewY: [anim.skewY, -anim.skewY, 2, anim.skewY],
          x: [0, anim.move, -1, 0],
          y: [0, anim.move, 1, 0]
        }}
        transition={{
          duration: anim.duration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Rectangular Button */}
      <div className={`relative flex items-center justify-center h-12 px-10 overflow-hidden font-bold tracking-wider uppercase border-2 transition-colors duration-300
        ${isPrimary 
          ? 'border-thl-blue text-thl-blue bg-white' 
          : 'border-thl-text/30 text-thl-text bg-white/50 group-hover:border-thl-blue'}
      `}>
        
        {/* Fill Animation */}
        <motion.div
          className={`absolute inset-0 z-0 ${isPrimary ? 'bg-thl-blue' : 'bg-thl-text'}`}
          variants={bgVariants}
          transition={{ type: "tween", ease: "circInOut", duration: 0.3 }}
        />

        {/* Text & Icon */}
        <div className={`relative z-10 flex items-center gap-2 transition-colors duration-300
            ${isPrimary ? 'group-hover:text-white' : 'group-hover:text-white'}
          `}>
          <span>{text}</span>
          <ArrowRight size={18} className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
        </div>
      </div>
    </motion.a>
  );
};