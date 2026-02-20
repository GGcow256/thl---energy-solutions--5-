import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';

export const Privacy: React.FC = () => {
  const { language } = useLanguage();
  const t = content[language].privacy;

  return (
    <div className="relative w-full bg-slate-50 min-h-screen pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={t.hero.image} 
            alt="Privacy Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/50" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-lg">
              {t.hero.subtitle}
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 font-light tracking-widest uppercase">
              {t.hero.title}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. CONTENT CONTAINER */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20 space-y-12">
        
        {/* Intro Card */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100"
        >
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
                {t.intro}
            </p>
        </motion.div>

        {/* Sections */}
        {t.sections.map((section, index) => (
            <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (index * 0.05) }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100"
            >
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 font-serif border-l-4 border-thl-blue pl-4">
                    {section.title}
                </h2>
                
                <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-slate-600 leading-relaxed">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </motion.div>
        ))}

      </div>

    </div>
  );
};