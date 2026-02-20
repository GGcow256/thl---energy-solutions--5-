import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { content } from '../data/content';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const { navigateTo } = useNavigation();
  const t = content[language].navbar;

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    // Cast string to Page type safely
    navigateTo(href as any); 
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative flex justify-between items-center">
          
          {/* Logo Container - Click to go home */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="relative z-20 cursor-pointer"
            onClick={() => navigateTo('home')}
          >
             <img 
               src="https://leondou.com/wp-content/uploads/2025/06/ChatGPT-Image-2025年6月28日-23_20_50.png" 
               alt="THL Logo" 
               className="h-20 w-auto block object-contain" 
             />
          </motion.div>

          {/* Desktop Nav - Clean Rectangle */}
          <div className="hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-md px-6 py-3 border border-white/40 shadow-sm relative">
             {/* Decorative line top */}
             <div className="absolute top-0 left-0 w-full h-[2px] bg-thl-blue/10" />

            {t.items.map((item, index) => (
              <motion.a
                key={item.label}
                href={`#${item.href}`}
                onClick={(e) => handleLinkClick(e, item.href)}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="relative px-4 py-1 text-sm font-semibold text-thl-text hover:text-thl-blue transition-colors group cursor-pointer"
              >
                <span className="relative z-10">{item.label}</span>
                {/* Hover Underline */}
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-thl-blue origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </motion.a>
            ))}
            
            <div className="w-px h-5 bg-gray-300 mx-3" />

            <motion.button 
               onClick={toggleLanguage}
               initial={{ x: 50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="relative px-5 py-1.5 bg-thl-blue text-white text-xs font-bold hover:bg-thl-text transition-all duration-300 cursor-pointer"
            >
              <span>{t.langButton}</span>
              {/* Language Button Faster Water Background */}
              <motion.div 
                className="absolute top-1 left-1 w-full h-full border border-thl-blue/50 -z-10"
                animate={{ 
                  skewX: [3, -3, 2],
                  y: [-2, 2, -2],
                  x: [1, -1, 1]
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-thl-text bg-white/80 p-2 border border-gray-200 backdrop-blur z-20"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-0 bg-white/95 backdrop-blur-xl z-10 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-8">
            {t.items.map((item) => (
              <a 
                key={item.label} 
                href={`#${item.href}`}
                className="text-2xl font-bold text-thl-text hover:text-thl-blue transition-all cursor-pointer"
                onClick={(e) => handleLinkClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
            <button onClick={() => { toggleLanguage(); setIsOpen(false); }} className="mt-8 text-thl-blue border-b border-thl-blue pb-1 font-bold">
              {t.langButton}
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};