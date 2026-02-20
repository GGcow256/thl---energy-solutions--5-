import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { THLButton } from './ui/P3Button';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { content } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

export const HomeProducts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { navigateTo } = useNavigation();
  const t = content[language].homeProducts;
  const products = t.items;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      const cards = gsap.utils.toArray<HTMLElement>('.product-3d-card');
      const totalCards = cards.length;
      
      // We want to pin the container for a while
      const scrollHeight = totalCards * 100; // Multiplier for scroll distance

      const tl = gsap.timeline({
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${scrollHeight}%`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
        }
      });

      // Z-Axis Animation Logic
      // Initially, all cards are deep in Z space (except the first one maybe)
      // As we scroll, they move forward (Z increases), fade in, then fade out as they pass camera
      
      // Let's set initial positions manually
      // Card 0: Visible
      // Card 1: Far back
      // Card 2: Further back
      
      // Better approach: Distribute them along a timeline
      cards.forEach((card, i) => {
        // Initial state
        gsap.set(card, { 
            z: -1000 * i,  // Start further back for each subsequent card
            scale: 1 - (i * 0.4), // Smaller as they are further
            opacity: i === 0 ? 1 : 0,
            filter: 'blur(0px)',
            y: 0
        });
      });

      // Animate the whole group moving "forward"
      // We essentially shift the Z of ALL cards forward by a huge amount
      
      // Card specific animations
      cards.forEach((card, i) => {
          // Calculation for when this card is "Active"
          // We want card i to come from Z:-1000 to Z:0 (Active) to Z:500 (Gone)
          
          tl.to(card, {
              z: 1000,          // Move way past the camera
              scale: 1.5,       // Grow large
              opacity: 0,       // Fade out at end
              filter: 'blur(20px)', // Blur as it gets too close
              duration: 10,     // Relative duration
              ease: "none",     // Linear movement
              
              // Custom motion path for opacity/visibility
              onUpdate: function() {
                  const progress = this.progress();
                  // Manually tweak opacity for a smooth "Appear -> Focus -> Disappear"
                  // Focus point is around progress 0.5 (Z=0ish)
                  let opacity = 0;
                  const currentZ = gsap.getProperty(card, "z") as number;
                  
                  // Approaching (Z < 0)
                  if (currentZ < -200) {
                      opacity = gsap.utils.mapRange(-1000, -200, 0, 1, currentZ);
                  } 
                  // Active zone (Z -200 to 200)
                  else if (currentZ >= -200 && currentZ <= 200) {
                      opacity = 1;
                  }
                  // Leaving (Z > 200)
                  else {
                      opacity = gsap.utils.mapRange(200, 800, 1, 0, currentZ);
                  }
                  card.style.opacity = Math.max(0, Math.min(1, opacity)).toString();
                  
                  // Pointer events only on active
                   if (currentZ >= -100 && currentZ <= 100) {
                      card.style.pointerEvents = 'auto';
                   } else {
                      card.style.pointerEvents = 'none';
                   }
              }
          }, i * 8); // Stagger start times so they overlap like a tunnel
      });

    }, containerRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#0F172A] overflow-hidden perspective-[1000px]">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] to-[#1e293b] -z-20" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 -z-10" />
      
      {/* Tunnel Guidelines (Optional Visuals) */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
         <div className="w-[200vw] h-[1px] bg-thl-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45" />
         <div className="w-[200vw] h-[1px] bg-thl-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
         <div className="w-[800px] h-[800px] border border-thl-blue rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0 animate-[ping_4s_linear_infinite]" />
      </div>

      <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
         
         {products.map((product, index) => (
             <div 
                key={product.id}
                className="product-3d-card absolute top-1/2 left-1/2 w-[85vw] max-w-[1200px] h-[70vh] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center will-change-transform"
             >
                <div className="w-full h-full relative grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                    
                    {/* Content Side */}
                    <div className="p-8 md:p-16 flex flex-col justify-center relative z-10 order-2 md:order-1">
                        <div className="text-thl-highlight font-mono mb-4 tracking-widest">SERIES 0{product.id}</div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase leading-tight">
                            {product.title}
                        </h2>
                        <p className="text-gray-300 text-lg mb-10 font-light leading-relaxed">
                            {product.description}
                        </p>
                        <div>
                             <THLButton 
                                text={index % 2 === 0 ? t.buttonPrimary : t.buttonOutline} 
                                variant="primary"
                                onClick={() => navigateTo('products', `product-${product.id}`)}
                              />
                        </div>
                        
                        {/* Background Giant Number */}
                        <div className="absolute bottom-0 left-0 text-[12rem] font-black text-white/5 leading-none pointer-events-none -z-10">
                            {product.id}
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="relative h-full w-full order-1 md:order-2 overflow-hidden bg-black">
                        <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-transparent to-transparent opacity-80" />
                    </div>

                </div>
             </div>
         ))}

      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-10 right-10 flex flex-col gap-2 z-50">
          <div className="text-white/50 text-xs font-mono text-right mb-2">SCROLL TO EXPLORE</div>
          <div className="w-1 h-20 bg-white/10 mx-auto relative overflow-hidden rounded-full">
               <div className="absolute top-0 left-0 w-full h-1/2 bg-thl-highlight animate-[moveDown_2s_linear_infinite]" />
          </div>
      </div>
      <style>{`
        @keyframes moveDown {
            0% { top: -50%; }
            100% { top: 100%; }
        }
      `}</style>

    </div>
  );
};