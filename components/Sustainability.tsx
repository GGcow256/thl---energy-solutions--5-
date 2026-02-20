import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';
import { TextReveal } from './ui/TextReveal';
import { CheckCircle2, Leaf, Wind, Zap, HeartHandshake, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

export const Sustainability: React.FC = () => {
  const { language } = useLanguage();
  const t = content[language].sustainability;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null); 
  const bgWrapperRef = useRef<HTMLDivElement>(null);

  // Define section colors matching the theme (Increased contrast): 
  // 1. Policy (Green/Nature) - Emerald 100
  // 2. Env (Sky/Air) - Sky 100 (More distinct Blue)
  // 3. Product (Tech/Innovation) - Fuchsia 100 (Pinkish Purple to contrast with Blue)
  // 4. Society (Warm/Community) - Amber 100
  const bgColors = ["#ECFDF5", "#F0F9FF", "#FAF5FF", "#FFFBEB"];
  
  // Icons map for the 4 sections
  const sectionIcons = [Leaf, Wind, Zap, HeartHandshake];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      const images = gsap.utils.toArray<HTMLElement>(".pinned-image");
      const texts = gsap.utils.toArray<HTMLElement>(".content-block");
      
      ScrollTrigger.matchMedia({
        // --- DESKTOP ANIMATION (> 1024px) ---
        "(min-width: 1024px)": function () {
          
          // Initial Setup
          gsap.set(images, { 
            clipPath: "inset(0% 0% 0% 0%)", 
            zIndex: (i) => images.length - i 
          });

          // PRECISE SCROLL LOGIC
          images.forEach((img, i) => {
            if (i === images.length - 1) return; // Last image stays

            const nextText = texts[i + 1]; // Trigger is the NEXT text block

            if (!nextText) return;

            // 1. Image Wipe Animation
            gsap.to(img, {
              clipPath: "inset(0% 0% 100% 0%)", 
              ease: "none",
              scrollTrigger: {
                trigger: nextText, 
                start: "top 75%",     
                end: "top 25%", 
                scrub: true, 
                invalidateOnRefresh: true
              }
            });

            // 2. Background Color Transition
            gsap.fromTo(bgWrapperRef.current, 
              { backgroundColor: bgColors[i] }, 
              {
                backgroundColor: bgColors[i + 1],
                ease: "none",
                immediateRender: false,
                scrollTrigger: {
                  trigger: nextText,
                  start: "top 75%",
                  end: "top 25%",
                  scrub: true,
                  invalidateOnRefresh: true
                }
              }
            );
          });
        },

        // --- MOBILE ANIMATION (<= 1023px) ---
        "(max-width: 1023px)": function () {
          texts.forEach((text, i) => {
            ScrollTrigger.create({
              trigger: text,
              start: "top 60%", 
              end: "bottom center",
              onEnter: () => {
                gsap.to(bgWrapperRef.current, {
                  backgroundColor: bgColors[i],
                  duration: 0.5,
                  ease: "power2.out",
                  overwrite: true
                });
              },
              onEnterBack: () => {
                gsap.to(bgWrapperRef.current, {
                  backgroundColor: bgColors[i],
                  duration: 0.5,
                  ease: "power2.out",
                  overwrite: true
                });
              }
            });
          });
        }
      });

    }, containerRef);

    // --- REFRESH LOGIC ---
    ScrollTrigger.refresh();
    const timer = setTimeout(() => ScrollTrigger.refresh(), 100);
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);

    return () => {
      ctx.revert();
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, [language]);

  return (
    <div ref={containerRef} className="relative w-full bg-transparent min-h-screen">
      
      {/* Dynamic Background Wrapper */}
      <div className="fixed inset-0 -z-10 h-full w-full">
         <div 
           ref={bgWrapperRef} 
           className="absolute inset-0 will-change-[background-color]"
           style={{ backgroundColor: bgColors[0] }} 
         />
         <div className="absolute inset-0 opacity-[0.3] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none mix-blend-multiply" />
         <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden z-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={t.hero.image} 
            alt="Sustainability Hero" 
            className="w-full h-full object-cover"
          />
          {/* Lighter overlay for better visibility of AI images */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/20" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 font-light tracking-widest uppercase">
              {t.hero.subtitle}
            </p>
          </motion.div>
        </div>
        
        {/* Scroll Hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80 animate-bounce">
          <ArrowDown className="text-white" />
        </div>
      </section>

      {/* --- SPLIT LAYOUT CONTAINER --- */}
      <div className="relative max-w-[1600px] mx-auto">
        <div ref={wrapperRef} className="flex flex-col lg:flex-row items-start relative">
          
          {/* LEFT COLUMN: SCROLLABLE CONTENT */}
          <div className="w-full lg:w-1/2 flex flex-col z-10 px-6 md:px-12 lg:px-20 pt-20 pb-40 lg:pb-[50vh]">
            {t.sections.map((section, index) => {
              const SectionIcon = sectionIcons[index % sectionIcons.length];
              
              return (
                <div 
                  key={index} 
                  className={`content-block flex flex-col justify-center py-24 ${index === 0 ? 'mt-10' : ''}`}
                  style={{ minHeight: '120vh' }}
                >
                  <div className="max-w-xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 bg-white/50 backdrop-blur-md rounded-full shadow-sm text-slate-800 border border-slate-100/50">
                        <SectionIcon size={32} strokeWidth={1.5} />
                      </div>
                      <span className="text-sm font-bold tracking-[0.3em] uppercase text-slate-500 mix-blend-multiply">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                      <TextReveal text={section.title} />
                    </h2>

                    <div className="prose prose-lg text-slate-600 leading-8 font-light bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-sm transition-transform hover:scale-[1.01] duration-500">
                      {section.type.includes('list') ? (
                        <ul className="space-y-6">
                          {section.list?.map((item, i) => (
                            <li key={i} className="flex items-start gap-4">
                              <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-1" size={24} />
                              <span className="text-xl">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="whitespace-pre-line text-xl">{section.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: STICKY IMAGES */}
          <div className="hidden lg:flex w-full lg:w-1/2 h-screen sticky top-0 items-center justify-center overflow-hidden">
            <div className="relative w-[90%] h-[85%]">
              {t.sections.map((section, index) => (
                <div 
                  key={index} 
                  className="pinned-image absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white/40 bg-white"
                  style={{ zIndex: 10 - index }} 
                >
                  <img 
                    src={section.image} 
                    alt={section.title}
                    className="w-full h-full object-cover transform scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur px-6 py-2 rounded-full hidden lg:block shadow-lg z-20">
                    <span className="text-xs font-bold tracking-widest uppercase text-slate-900">
                      {language === 'cn' ? 'THL 可持续发展' : 'THL サステナビリティ'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      <div className="h-24 w-full" />
    </div>
  );
};