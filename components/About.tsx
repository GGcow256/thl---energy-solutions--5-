import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { THLButton } from './ui/P3Button';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { content } from '../data/content';

export const About: React.FC = () => {
  const { language } = useLanguage();
  const { navigateTo } = useNavigation();
  const t = content[language].about;

  return (
    <section className="relative py-20 px-6 max-w-7xl mx-auto">
      {/* Decorative Background Elements */}
      <div className="absolute -left-20 top-20 w-96 h-96 bg-thl-blue/5 rounded-full blur-3xl -z-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Content Side */}
        <div className="space-y-8">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-thl-text mb-8 border-l-4 border-thl-blue pl-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {t.title}
            <span className="block text-lg font-light text-thl-dim mt-2 tracking-widest">{t.subtitle}</span>
          </motion.h2>

          <GlassCard className="min-h-[300px]" delay={1}>
            <div className="space-y-6 text-thl-dim leading-relaxed font-normal">
              <p>
                <strong className="text-thl-text">{t.p1_strong}</strong>{t.p1_text}
              </p>
              <p>
                {t.p2}
              </p>
              <p>
                {t.p3}
              </p>
            </div>
            <div className="mt-8 flex justify-end">
              <THLButton 
                text={t.button} 
                onClick={() => navigateTo('business')}
              />
            </div>
          </GlassCard>
        </div>

        {/* Image Side - Rectangular with offset */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="relative group"
        >
          {/* Fluid Water Background - Large slow movement */}
          <motion.div 
            className="absolute top-4 left-4 w-full h-full bg-thl-blue/10 -z-10"
            animate={{ 
               skewX: [0, 2, -2, 0],
               skewY: [0, -2, 2, 0],
               x: [0, 6, -4, 0],
               y: [0, -6, 4, 0],
               borderRadius: ["0%", "3% 1% 4% 2%", "1% 4% 2% 3%", "0%"]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Main Image Container */}
          <div className="relative overflow-hidden shadow-2xl shadow-gray-200 border border-white">
            <img 
              src="https://leondou.com/wp-content/uploads/2025/06/kubio-image-128-1024x683.png" 
              alt="THL Engineers" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};