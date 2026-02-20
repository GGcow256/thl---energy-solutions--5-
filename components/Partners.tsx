import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';

export const Partners: React.FC = () => {
  const { language } = useLanguage();
  const t = content[language].partners;

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-4xl font-black text-thl-text uppercase tracking-tight leading-none mb-4">{t.title}</h2>
        <div className="w-20 h-1.5 bg-thl-blue" />
      </div>

      {/* Container padding adjusted for larger images */}
      <div className="relative w-full bg-white/50 backdrop-blur-sm border-y border-gray-200 py-20">
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-12 items-center flex-nowrap whitespace-nowrap"
            animate={{ x: [0, -1200] }} 
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 35, // Slower duration to accommodate larger width traversal
            }}
          >
             {/* 
                Drastically increased height to h-64 (256px) to make logos much larger.
                Added max-w-none to ensure the image expands to its full natural width based on height.
             */}
             <img src="https://leondou.com/wp-content/uploads/2025/06/Partner-Companies-scaled.png" alt="Partners" className="h-64 w-auto max-w-none object-contain opacity-90 hover:opacity-100 transition-all duration-300" />
             <img src="https://leondou.com/wp-content/uploads/2025/06/Partner-Companies-scaled.png" alt="Partners" className="h-64 w-auto max-w-none object-contain opacity-90 hover:opacity-100 transition-all duration-300" />
             <img src="https://leondou.com/wp-content/uploads/2025/06/Partner-Companies-scaled.png" alt="Partners" className="h-64 w-auto max-w-none object-contain opacity-90 hover:opacity-100 transition-all duration-300" />
             <img src="https://leondou.com/wp-content/uploads/2025/06/Partner-Companies-scaled.png" alt="Partners" className="h-64 w-auto max-w-none object-contain opacity-90 hover:opacity-100 transition-all duration-300" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};