import React from 'react';
import { motion } from 'framer-motion';
import { THLButton } from './ui/P3Button';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { content } from '../data/content';

export const News: React.FC = () => {
  const { language } = useLanguage();
  const { navigateTo } = useNavigation();
  const t = content[language].news;
  const newsItems = t.items;

  return (
    <section className="py-20 max-w-7xl mx-auto px-6 relative z-10">
       {/* Title Section - Standard Layout */}
       <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-thl-text uppercase tracking-tight leading-none">
              {t.title} <span className="text-thl-blue">{t.titleHighlight}</span>
            </h2>
            <div className="h-1 w-24 bg-thl-blue mt-6" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <THLButton 
              text={t.button} 
              onClick={() => navigateTo('news')} 
              variant="outline" 
            />
          </motion.div>
       </div>

       {/* News List - Vertical Flow */}
       <div className="grid grid-cols-1 gap-4">
          {newsItems.map((item, index) => (
            <motion.div
               key={item.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="group relative bg-white/60 backdrop-blur-md border border-thl-glassBorder hover:border-thl-blue/30 p-6 md:p-8 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
            >
               {/* Left Accent Bar on Hover */}
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-thl-blue transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
               
               <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between relative z-10 pl-2 md:pl-0 transition-all duration-300 group-hover:pl-4">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                     <span className="font-mono text-thl-cyan font-bold text-lg tracking-wider">{item.date}</span>
                     <p className="text-thl-text font-medium text-lg leading-relaxed max-w-4xl group-hover:text-thl-blue transition-colors">
                        {item.content}
                     </p>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="hidden md:block opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-thl-blue">
                     <ArrowUpRight size={28} />
                  </div>
               </div>
            </motion.div>
          ))}
       </div>
    </section>
  );
};