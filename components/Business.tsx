import React, { useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';
import { MapPin, Train } from 'lucide-react';
import { TextReveal } from './ui/TextReveal';

gsap.registerPlugin(ScrollTrigger);

export const Business: React.FC = () => {
  const { language } = useLanguage();
  const t = content[language].business;
  const { scrollY } = useScroll();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);

  // Parallax for Hero
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  useLayoutEffect(() => {
    let ctx: gsap.Context;

    // --- 核心修复：添加延迟，等待路由跳转的 window.scrollTo(0, 0) 和页面过渡动画彻底完成 ---
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // 先清理可能残余的触发器
        ScrollTrigger.getAll().forEach(t => t.kill());

        // 获取两个图层容器
        const founders = document.querySelector('.founders-stack');
        const rd = document.querySelector('.rd-stack');
        const track = trackRef.current;

        if (track && founders && rd) {
          
          // =========================================================
          // 1. 初始状态 (Initial State) 
          // =========================================================
          
          // 创始团队：完全展开，轴心在左下角 (0% 100%)
          gsap.set(founders, { 
            scale: 1, 
            rotationX: 0,
            rotationY: 0,
            filter: 'brightness(1)',
            opacity: 1,
            transformOrigin: "0% 100%" 
          });

          // 研发团队：完全折叠，轴心在右上角 (100% 0%)
          gsap.set(rd, { 
            scale: 0, 
            rotationX: 10,  
            rotationY: 70,  
            filter: 'brightness(0.2)', 
            opacity: 0,
            transformOrigin: "100% 0%" 
          });

          // =========================================================
          // 2. 动画序列 (Timeline) - 绑定滚动条
          // =========================================================
          
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: track,        
              start: "top top",      
              end: "bottom bottom",  
              scrub: 1, 
              invalidateOnRefresh: true, // 核心修复：强制在刷新或滚动重置时重新计算起点
            }
          });

          // 第一步：创始团队折叠离场 
          tl.to(founders, {
            scale: 0,           
            rotationX: 10,      
            rotationY: 70,      
            filter: 'brightness(0.2)', 
            opacity: 0,
            ease: "none",       
            duration: 1 
          });

          // 第二步：研发团队展开入场 
          tl.to(rd, {
            scale: 1,           
            rotationX: 0,       
            rotationY: 0,       
            filter: 'brightness(1)', 
            opacity: 1,
            ease: "none",
            duration: 1
          }, "<"); 
        }

        // 初始化完成后强制重新计算所有的滚动触发点
        ScrollTrigger.refresh();
      }, containerRef);
    }, 300); // 延迟 300ms 避开布局抖动期

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [language]);

  return (
    <div ref={containerRef} className="relative bg-thl-bg">
      
      {/* 1. Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <motion.div 
          style={{ y: yHero, opacity: opacityHero, scale: 1.1 }} 
          className="absolute inset-0 z-0"
        >
          <img 
            src={t.hero.image} 
            alt="Business Hero" 
            className="w-full h-full object-cover filter brightness-[0.9]"
          />
        </motion.div>
        
        {/* Enhanced Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-20">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 leading-[1.1] drop-shadow-xl">
              <TextReveal text={t.hero.title} delay={2} />
            </h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ delay: 1, duration: 1.5, ease: "circOut" }}
              className="h-[1px] bg-thl-highlight mb-8"
            />
            <p className="text-xl md:text-3xl text-gray-100 font-light tracking-widest uppercase pl-1 drop-shadow-lg">
              <TextReveal text={t.hero.subtitle} delay={8} />
            </p>
          </div>
        </div>
      </section>

      {/* 2. Philosophy Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative bg-white z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24">
           <motion.h2 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 0.1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
             className="text-8xl md:text-[10rem] font-serif font-bold text-thl-text absolute -top-10 -left-10 z-0 pointer-events-none select-none"
           >
             Philosophy
           </motion.h2>
           <div className="relative z-10 ml-auto md:w-2/3">
             <h3 className="text-4xl font-serif text-thl-text mb-12 border-l-4 border-thl-blue pl-6">
                <TextReveal text={t.philosophy.title} />
             </h3>
           </div>
        </div>
        <div className="space-y-32">
          {t.philosophy.items.map((item, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}>
               <motion.div 
                 initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }}
                 whileInView={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 1, ease: "circOut" }}
                 className="w-full md:w-1/2 h-64 md:h-80 relative overflow-hidden group shadow-lg"
               >
                  {/* 使用真实的图片 */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* 装饰性遮罩，增加文字可读性或氛围感 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                  <div className={`absolute top-0 bottom-0 w-2 bg-thl-blue transition-all duration-700 ${index % 2 === 0 ? 'left-0 group-hover:w-full group-hover:opacity-20' : 'right-0 group-hover:w-full group-hover:opacity-20'}`} />
                  <span className="absolute bottom-4 right-6 text-9xl font-serif font-bold text-white/10 select-none">
                    0{index + 1}
                  </span>
               </motion.div>
               <div className="w-full md:w-1/2">
                 <h4 className="text-2xl md:text-3xl font-bold text-thl-text mb-6 font-serif">
                   {item.title}
                 </h4>
                 <div className="text-thl-dim text-lg leading-relaxed font-light">
                   {item.desc}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TEAM 3D ANIMATION SECTION (Fixed) */}
      <section 
        ref={trackRef}
        className="relative h-[250vh] bg-slate-900"
      >
         {/* STICKY VIEWPORT */}
         <div 
           ref={cameraRef}
           className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center"
           style={{ perspective: '1200px' }} 
         >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
             
             {/* GRID STACKING CONTAINER */}
             <div className="w-full max-w-7xl px-6 grid grid-cols-1 grid-rows-1 place-items-center">

                {/* --- LAYER 1: FOUNDERS (Exit Animation) --- */}
                <div className="founders-stack col-start-1 row-start-1 w-full flex flex-col items-center z-20 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                    <div className="text-center mb-12">
                      <span className="text-thl-blue font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Leadership</span>
                      <h2 className="text-5xl md:text-6xl font-serif font-bold text-white">
                        {t.team.foundersTitle}
                      </h2>
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                      {t.team.founders.map((person, index) => (
                        <div 
                          key={index} 
                          className="relative h-[50vh] min-h-[400px] w-full bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-white/10"
                        >
                          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${person.image})` }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                          
                          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                            <div className="w-12 h-1 bg-thl-blue mb-6 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                            <h3 className="text-4xl font-serif font-bold text-white mb-2 drop-shadow-md">{person.name}</h3>
                            <p className="text-thl-blue font-bold uppercase tracking-widest text-sm mb-4 drop-shadow-md">{person.role}</p>
                            <p className="text-gray-200 text-sm leading-relaxed opacity-90 line-clamp-4 font-light">{person.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                </div>

                {/* --- LAYER 2: R&D (Entry Animation) --- */}
                <div className="rd-stack col-start-1 row-start-1 w-full flex flex-col items-center z-20 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                    <div className="text-center mb-12">
                       <div className="w-16 h-1 bg-gray-700 mx-auto mb-8" />
                       <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-400">
                          {t.team.rdTitle}
                       </h2>
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
                      {t.team.rd.map((person, index) => (
                        <div 
                          key={index} 
                          className="relative h-[45vh] min-h-[350px] w-full bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-white/5"
                        >
                          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${person.image})` }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
                          
                          <div className="absolute bottom-0 left-0 w-full p-6">
                            <h3 className="text-2xl font-bold text-white mb-1 font-serif drop-shadow-md">{person.name}</h3>
                            <p className="text-[10px] text-thl-blue uppercase tracking-wider font-bold mb-3 drop-shadow-sm">{person.role}</p>
                            <p className="text-xs text-gray-300 leading-relaxed border-t border-white/10 pt-3 opacity-90 drop-shadow-sm">{person.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                </div>

             </div>
         </div>
      </section>

      {/* 4. Access Section */}
      <section className="py-24 bg-gray-50 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row bg-white shadow-xl overflow-hidden">
            <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <MapPin size={200} className="text-thl-text" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-10 relative z-10">{t.access.title}</h2>
              <div className="space-y-8 relative z-10">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t.access.addressLabel}</p>
                  <p className="text-xl font-medium text-thl-text">{t.access.address}</p>
                </div>
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  {t.access.trains.map((train, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <Train size={18} className="text-thl-blue flex-shrink-0" />
                      <div>
                        <span className="font-bold text-thl-text mr-2">{train.line}</span>
                        <span className="text-thl-dim text-sm">{train.station}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 h-96 lg:h-auto bg-gray-200">
               <iframe 
                 src="https://maps.google.com/maps?q=%E6%9D%B1%E4%BA%AC%E9%83%BD%E6%B8%8B%E8%B0%B7%E5%8C%BA%E9%81%93%E7%8E%84%E5%9D%821-18-3%E3%80%80+%E3%83%97%E3%83%AC%E3%83%9F%E3%82%A2%E9%81%93%E7%8E%84%E5%9D%82%E3%83%93%E3%83%AB7%E9%9A%8E&z=17&t=m&output=embed" 
                 className="w-full h-full border-0 transition-all duration-700" 
                 title="Location"
                 allowFullScreen 
                 loading="lazy" 
               />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};