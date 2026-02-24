import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    navigateTo(href as any); 
  };

  // 优化体验：菜单打开时锁定背景，禁止用户在底层滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative flex justify-between items-center">
          
          {/* Logo Container */}
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-md px-6 py-3 border border-white/40 shadow-sm relative">
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

          {/* 原先的移动端汉堡菜单按钮 */}
          <button 
            className="md:hidden text-thl-text bg-white/80 p-2 border border-gray-200 backdrop-blur z-20"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={32} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - 使用 Portal 挂载到 body，确保绝对参照浏览器屏幕视口 */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: '-10px' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-10px' }}
              transition={{ duration: 0.3 }}
              // 强制高度为 100dvh，无论多长的页面都只占据当前屏幕大小
              className="fixed top-0 left-0 w-full h-[100dvh] bg-white/95 backdrop-blur-xl z-[9999] flex flex-col items-center justify-center"
            >
              {/* 独立的关闭按钮，保持在原来的右上角位置 */}
              <button 
                className="absolute top-4 right-6 text-thl-text bg-white/80 p-2 border border-gray-200 backdrop-blur z-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <X size={32} />
              </button>

              <div className="flex flex-col items-center gap-8 w-full px-6">
                {t.items.map((item, index) => (
                  <motion.a 
                    key={item.label} 
                    href={`#${item.href}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-2xl font-bold text-thl-text hover:text-thl-blue transition-all cursor-pointer text-center w-full"
                    onClick={(e) => handleLinkClick(e, item.href)}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: t.items.length * 0.05 }}
                  onClick={() => { toggleLanguage(); setIsOpen(false); }} 
                  className="mt-8 text-xl text-thl-blue border-b-2 border-thl-blue pb-1 font-bold"
                >
                  {t.langButton}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </nav>
  );
};