import React, { useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { content } from '../data/content';
import { Zap, Shield, Globe, Cpu, Activity, Anchor, ArrowDown, CheckCircle2, ArrowRight } from 'lucide-react';
import { THLButton } from './ui/P3Button';

gsap.registerPlugin(ScrollTrigger);

export const Products: React.FC = () => {
  const { language } = useLanguage();
  const { navigateTo, targetSection } = useNavigation();
  const t = content[language].productsPage;
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Hero Parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Background Images
  const productImages = [
    "/liu/images/product_container_bg.jpg", // Product 1
    "/liu/images/product_factory_bg.jpg",   // Product 2
    "/liu/images/product_portable_bg.jpg",  // Product 3 
    "/liu/images/product_family_bg.jpg",    // Product 4
    "/liu/images/product_charging_bg.jpg",  // Product 5 
    "/liu/images/product_solar_bg.jpg"      // Product 6
  ];

  // Card Detail Images (Pure Images or Videos)
  const detailImagesLeft = [
    "/liu/videos/product_container_detail.webm", // Product 1
    "/liu/videos/product_factory_detail.webm",   // Product 2
    "/liu/videos/product_portable_detail.webm",  // Product 3
    "/liu/videos/product_family_detail.webm",    // Product 4
    "/liu/videos/product_charging_detail.webm",  // Product 5
    "/liu/videos/product_solar_detail.webm",     // Product 6
  ];

  const detailImagesRight = [
    "/liu/videos/product_container_app.webm",    // Product 1
    "/liu/videos/product_factory_app.webm",      // Product 2
    "/liu/videos/product_portable_app.webm",     // Product 3 
    "/liu/videos/product_family_app.webm",       // Product 4
    "/liu/videos/product_charging_app.webm",     // Product 5
    "/liu/videos/product_solar_app.webm",        // Product 6
  ];

  const icons = [Zap, Shield, Globe, Cpu, Activity, Anchor];

  // Helper to check if source is video
  const isVideo = (src: string) => src.endsWith('.mp4') || src.endsWith('.webm');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Target our sticky wrappers
      const wrappers = gsap.utils.toArray<HTMLElement>('.product-stack-item');
      
      wrappers.forEach((wrapper) => {
        // Elements INSIDE the wrapper
        const overlay = wrapper.querySelector('.product-overlay');
        const content = wrapper.querySelector('.product-content');
        const cardLeft = wrapper.querySelector('.fly-card-left');
        const cardRight = wrapper.querySelector('.fly-card-right');
        const bgImage = wrapper.querySelector('.product-bg');

        // We create a ScrollTrigger that is linked to this specific wrapper's scroll life
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                start: "top top",     // When the top of the wrapper hits the top of viewport
                end: "+=150%",        // Animate based on 150% of viewport height (Speed of animation)
                scrub: 0.8,           // Slightly smoother scrub
                invalidateOnRefresh: true, // 修复：让每次刷新时重新计算位置，防止状态卡死
            }
        });

        // 1. Overlay opacity: 0 -> 0.95 (Fade to white)
        tl.fromTo(overlay, { opacity: 0 }, { opacity: 0.95, ease: "none" }, 0);
        
        // 2. Background Scale: 1 -> 1.1 (Subtle zoom)
        tl.fromTo(bgImage, { scale: 1 }, { scale: 1.1, ease: "none" }, 0);

        // 3. Text: Slide UP from bottom (y: 200 -> 0) and Fade In
        tl.fromTo(content, 
            { y: 300, opacity: 0 }, 
            { y: 0, opacity: 1, ease: "power2.out" }, 
            0 
        );

        // 4. Left Card: Fly In from Left (-100vw -> 0)
        tl.fromTo(cardLeft,
            { x: -window.innerWidth * 0.6, rotation: -45, opacity: 0 },
            { x: 0, rotation: -6, opacity: 1, ease: "back.out(1.2)" },
            0 
        );

        // 5. Right Card: Fly In from Right (100vw -> 0)
        tl.fromTo(cardRight,
            { x: window.innerWidth * 0.6, rotation: 45, opacity: 0 },
            { x: 0, rotation: 6, opacity: 1, ease: "back.out(1.2)" },
            0 
        );
      });
      
    }, mainRef);

    // 修复：强制在组件渲染且页脚滚动跳回顶部后刷新计算（处理Footer跳转瞬间时序错误）
    const timer1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const timer2 = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      ctx.revert();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [language]);

  // Handle Scroll to Specific Section (with offset for animation state)
  useEffect(() => {
    if (targetSection) {
      const element = document.getElementById(targetSection);
      if (element) {
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = rect.top + scrollTop;
          
          let offsetMultiplier = 1.3;
          if (targetSection === 'product-1') {
            offsetMultiplier = 1.8; 
          }

          const offset = window.innerHeight * offsetMultiplier; 
          
          window.scrollTo({
            top: elementTop + offset,
            behavior: 'smooth'
          });

          // 修复：滚动完成后强制更新 GSAP
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 500);
        }, 300);
      }
    } else {
      // 修复：即使是没有指定 targetSection（单纯从底部点进来），也进行一次刷新
      setTimeout(() => ScrollTrigger.refresh(), 300);
    }
  }, [targetSection]);

  return (
    <div ref={mainRef} className="bg-white relative min-h-screen text-slate-900">
      
      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="relative h-screen w-full flex flex-col justify-center z-0 overflow-hidden bg-slate-50">
         <div className="absolute inset-0 pointer-events-none">
             <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-blue-300/20 rounded-full blur-[100px]" />
             <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] bg-cyan-300/20 rounded-full blur-[80px]" />
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.08]" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-slate-200/80 whitespace-nowrap select-none">
               FUTURE ENERGY
             </div>
         </div>

         <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 h-full items-center">
            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="lg:col-span-8 flex flex-col justify-center h-full pt-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex items-center gap-4 mb-6">
                    <div className="h-[2px] w-16 bg-gradient-to-r from-thl-blue to-transparent" />
                    <span className="text-thl-blue font-serif italic text-xl md:text-2xl tracking-wide">
                        {t.hero.title}
                    </span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} className="text-7xl md:text-9xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
                  {language === 'cn' ? '产品' : '製品'} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-thl-blue to-cyan-500">
                    {language === 'cn' ? '介绍' : '情報'}
                  </span>
                </motion.h1>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="relative pl-8 border-l-4 border-slate-200">
                   <p className="text-2xl md:text-3xl text-slate-600 font-light tracking-widest font-serif italic">
                    {t.hero.subtitle}
                   </p>
                </motion.div>
            </motion.div>
            
            <div className="hidden lg:block lg:col-span-4 relative h-full">
               <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[400px] h-[400px] border border-slate-300 rounded-full animate-spin-slow absolute opacity-60" style={{ animationDuration: '30s' }} />
                  <div className="w-[300px] h-[300px] border border-dashed border-thl-blue/30 rounded-full animate-reverse-spin absolute opacity-80" style={{ animationDuration: '40s' }} />
                  <div className="w-[150px] h-[150px] bg-gradient-to-br from-thl-blue/20 to-transparent rounded-full blur-3xl absolute" />
               </motion.div>
            </div>
         </div>
         
         <motion.div className="absolute bottom-12 left-6 md:left-24 z-20 flex flex-col items-start gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ delay: 1.5, duration: 2, repeat: Infinity }}>
            <span className="text-slate-400 text-xs tracking-widest uppercase font-bold writing-mode-vertical">Scroll Down</span>
            <ArrowDown className="text-thl-blue" size={24} />
         </motion.div>
      </section>

      {/* 2. PRODUCT STACK */}
      <div className="relative w-full">
        {t.items.map((item, index) => {
          const Icon = icons[index % icons.length];
          const detailLeft = detailImagesLeft[index % detailImagesLeft.length];
          const detailRight = detailImagesRight[index % detailImagesRight.length];
          
          return (
            <div 
                id={`product-${item.id}`}
                key={item.id} 
                className="product-stack-item sticky top-0 w-full overflow-hidden border-t border-white/20 shadow-[0_-50px_120px_rgba(0,0,0,0.5)] h-[300vh]"
                // 修复：添加 minHeight: '100vh'，防止页脚跳转由于布局过快塌陷，触发计算错误
                style={{ zIndex: index + 10, minHeight: '100vh' }} 
            >
              
              <div className="relative w-full h-screen bg-white overflow-hidden">
                
                <div className="absolute inset-0 w-full h-full">
                    <img 
                        src={productImages[index % productImages.length]} 
                        alt={item.title}
                        className="product-bg w-full h-full object-cover"
                    />
                </div>

                <div className="product-overlay absolute inset-0 bg-white/95 z-10" />

                <div className="product-content relative z-30 container mx-auto px-6 h-full flex flex-col items-center justify-center text-center max-w-5xl">
                      
                      <div className="mb-6">
                          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-thl-blue to-cyan-500 text-white shadow-xl mb-4 border-4 border-white/50">
                             <Icon size={32} />
                          </div>
                          <div className="text-thl-blue font-bold tracking-[0.3em] uppercase text-xs">Series 0{index + 1}</div>
                      </div>
                      
                      <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 uppercase tracking-tight drop-shadow-sm leading-none">
                         {item.title}
                      </h2>

                      <div className="flex flex-wrap justify-center gap-6 mb-8 w-full">
                         <div className="flex flex-col items-center px-4 py-2 border-r border-slate-200 last:border-0">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Efficiency</span>
                            <span className="text-3xl font-black text-slate-800">98.5%</span>
                         </div>
                         <div className="flex flex-col items-center px-4 py-2 border-r border-slate-200 last:border-0">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Life Cycle</span>
                            <span className="text-3xl font-black text-slate-800">15 Yrs</span>
                         </div>
                         <div className="flex flex-col items-center px-4 py-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</span>
                            <span className="text-3xl font-black text-emerald-600 flex items-center gap-2">
                              Ready <CheckCircle2 size={20}/>
                            </span>
                         </div>
                      </div>
                      
                      <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light max-w-3xl mx-auto">
                         {item.description}
                      </p>
                </div>

                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-between px-4 md:px-12 w-full h-full">
                    
                    <div className="fly-card-left hidden lg:block w-[280px] h-[380px] relative">
                        <div className="absolute inset-0 bg-white p-2 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-slate-100 transform transition-transform duration-500 hover:scale-105 pointer-events-auto rotate-[-3deg] overflow-hidden">
                            {isVideo(detailLeft) ? (
                              <video 
                                src={detailLeft} 
                                autoPlay 
                                muted 
                                loop 
                                playsInline 
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <img src={detailLeft} alt="Detail" className="w-full h-full object-cover rounded-xl" />
                            )}
                        </div>
                    </div>
                    
                    <div className="fly-card-right hidden lg:block w-[280px] h-[380px] relative">
                        <div className="absolute inset-0 bg-white p-2 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-slate-100 transform transition-transform duration-500 hover:scale-105 pointer-events-auto rotate-[3deg] overflow-hidden">
                             {isVideo(detailRight) ? (
                              <video 
                                src={detailRight} 
                                autoPlay 
                                muted 
                                loop 
                                playsInline 
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <img src={detailRight} alt="Scenario" className="w-full h-full object-cover rounded-xl" />
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="absolute bottom-[-5%] right-[-2%] z-10 text-slate-900/5 font-black text-[15rem] leading-none select-none pointer-events-none">
                    0{index + 1}
                </div>

              </div>
            </div>
          );
        })}

        <div className="sticky top-0 w-full h-screen bg-slate-50 flex items-center justify-center z-[50] border-t border-white/20 shadow-[0_-50px_120px_rgba(0,0,0,0.5)]">
             <div className="max-w-4xl px-6 text-center">
                 <div className="inline-block mb-6 p-4 rounded-full bg-blue-50 text-thl-blue">
                     <ArrowRight size={48} />
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
                    {t.cta?.title || "Interested in our products?"}
                 </h2>
                 <div className="flex justify-center">
                    <THLButton 
                       text={t.cta?.button || "Contact Us"} 
                       onClick={() => navigateTo('contact')}
                       variant="primary"
                    />
                 </div>
             </div>
        </div>
      </div>
      
    </div>
  );
};