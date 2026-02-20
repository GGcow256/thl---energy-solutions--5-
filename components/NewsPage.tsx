import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';
import { ArrowLeft, X, Calendar } from 'lucide-react';

// --- Types ---
interface NewsItem {
  id: number;
  date: string;
  image: string;
  title: string;
  content: string;
}

// --- Helpers ---
const getDateParts = (dateStr: string) => {
  // Assuming date format YYYY.MM.DD
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    return {
      year: parts[0],
      month: parts[1],
      day: parts[2]
    };
  }
  return { year: '', month: '', day: '' };
};

const formatDate = (dateStr: string) => {
  const { month, day } = getDateParts(dateStr);
  if (month && day) return `${month}-${day}`;
  return dateStr;
};

export const NewsPage: React.FC = () => {
  const { language } = useLanguage();
  // Sort items by date descending (Newest first)
  const rawItems = content[language].newsPage.items;
  const items = useMemo(() => {
    return [...rawItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rawItems]);

  // --- Animation State ---
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number | null>(null);
  
  // Physics variables
  const state = useRef({
    progress: 50,
    startX: 0,
    active: 0,
    isDown: false,
    isDragging: false,
    clickStartX: 0,
    clickStartY: 0,
    speedWheel: 0.05,
    speedDrag: -0.15,
    targetProgress: 50, // For smooth easing
  });

  // Modal State
  const [modalData, setModalData] = useState<NewsItem | null>(null);

  // --- 3D Logic ---
  const getZindex = (array: any[], index: number) => {
    return array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i));
  };

  const displayItems = () => {
    const { progress } = state.current;
    
    // Constrain progress 0-100
    const constrainedProgress = Math.max(0, Math.min(progress, 100));
    state.current.progress = constrainedProgress;

    // Calculate active index based on progress
    const activeIndex = Math.floor(constrainedProgress / 100 * (items.length - 1));
    state.current.active = activeIndex;

    // Calculate z-indexes
    const zIndexes = getZindex(items, activeIndex);

    itemsRef.current.forEach((item, index) => {
      if (!item) return;
      
      const active = (index - activeIndex) / items.length;
      const zIndex = zIndexes[index];
      
      // Update CSS Variables directly for performance
      item.style.setProperty('--zIndex', zIndex.toString());
      item.style.setProperty('--active', active.toString());
      
      // Calculate opacity based on z-index logic from reference
      // Formula: calc(var(--zIndex) / var(--items) * 3 - 2);
      const opacity = (zIndex / items.length) * 3 - 2;
      item.style.opacity = Math.max(0, opacity).toString();
    });
  };

  const animate = () => {
    // Basic lerp for smoothness if needed, but direct mapping is snappier for this effect
    displayItems();
    // requestRef.current = requestAnimationFrame(animate); // Only needed if we had momentum physics
  };

  // Initialize
  useEffect(() => {
    // Initial render
    animate();
    
    // cleanup
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [items]);

  // --- Event Handlers ---

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (modalData) return;
    
    state.current.isDown = true;
    state.current.isDragging = false;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    state.current.startX = clientX;
    state.current.clickStartX = clientX;
    state.current.clickStartY = clientY;
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!state.current.isDown || modalData) return;

    // Prevent scrolling while dragging
    if (e.cancelable) {
      e.preventDefault();
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Check drag threshold to distinguish click vs drag
    const moveX = Math.abs(clientX - state.current.clickStartX);
    const moveY = Math.abs(clientY - state.current.clickStartY);
    
    if (moveX > 5 || moveY > 5) {
      state.current.isDragging = true;
    }

    const x = clientX;
    const mouseProgress = (x - state.current.startX) * state.current.speedDrag;
    state.current.progress += mouseProgress;
    state.current.startX = x;
    
    animate();
  };

  const handleMouseUp = () => {
    state.current.isDown = false;
  };

  const handleWheel = (e: WheelEvent) => {
    if (modalData) return;
    
    // Prevent default scroll behavior
    e.preventDefault();

    const wheelProgress = e.deltaY * state.current.speedWheel;
    state.current.progress += wheelProgress;
    animate();
  };

  // Attach global listeners for drag/wheel
  useEffect(() => {
    // Passive: false is required to use preventDefault on wheel/touchmove
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [modalData, items]); // Added items dependency to ensure handlers have fresh closure if items change

  const handleItemClick = (index: number) => {
    if (state.current.isDragging) return;
    
    // Center the clicked item
    // Logic: progress = (i / total) * 100 + offset
    // The offset '10' is from the reference code to center it perfectly
    state.current.progress = (index / (items.length - 1)) * 100;
    animate();

    setModalData(items[index]);
  };

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden text-slate-900 font-sans selection:bg-thl-blue selection:text-white">
      
      {/* --- INLINE STYLES FOR 3D TRANSFORM --- */}
      <style>{`
        .carousel-item {
          --width: clamp(260px, 30vw, 400px);
          --height: clamp(340px, 45vw, 520px);
          --x: calc(var(--active) * 800%);
          --y: calc(var(--active) * 200%);
          --rot: calc(var(--active) * 120deg);
          
          position: absolute;
          width: var(--width);
          height: var(--height);
          top: 50%;
          left: 50%;
          transform: translate(calc(var(--x) - 50%), calc(var(--y) - 50%)) rotate(var(--rot));
          z-index: var(--zIndex);
          transition: transform 0.8s cubic-bezier(0, 0.02, 0, 1), opacity 0.8s cubic-bezier(0, 0.02, 0, 1);
          cursor: pointer;
          user-select: none;
          box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .carousel-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(255,255,255,0.9) 100%);
          z-index: 1;
        }
      `}</style>

      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-0 h-full w-[1px] bg-slate-200" />
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-thl-blue/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-thl-highlight/10 rounded-full blur-3xl -z-10" />
        
        <div className="absolute bottom-10 left-10 text-slate-400 text-xs font-bold tracking-[0.3em] uppercase">
          Latest Headlines<br />Global Updates<br />Timeline View
        </div>
      </div>

      {/* --- 3D CAROUSEL --- */}
      <div 
        ref={carouselRef}
        className="relative w-full h-full perspective-[1000px] z-10"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {items.map((item, i) => {
          const { year, month, day } = getDateParts(item.date);
          
          return (
            <div
              key={item.id}
              ref={(el) => { itemsRef.current[i] = el; }}
              className="carousel-item group"
              onClick={() => handleItemClick(i)}
            >
              {/* Image & Gradient */}
              <div className="carousel-box w-full h-full relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                />
                
                {/* Date Badge - Premium Redesign */}
                <div className="absolute top-6 left-6 z-20 bg-white shadow-xl shadow-blue-900/5 p-4 flex flex-col items-center justify-center rounded-lg min-w-[80px] border border-slate-50">
                  <span className="text-3xl font-serif font-black text-slate-900 leading-none mb-2">
                    {month}<span className="text-thl-blue">.</span>{day}
                  </span>
                  <div className="w-full h-px bg-slate-100 mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-400 tracking-[0.25em]">
                    {year}
                  </span>
                </div>

                {/* Title */}
                <div className="absolute bottom-8 left-6 right-6 z-20">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight text-slate-900 drop-shadow-sm">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- DETAIL MODAL --- */}
      <AnimatePresence>
        {modalData && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-white/80 backdrop-blur-md"
              onClick={() => setModalData(null)}
            />

            {/* Content Card - Visually pushed up significantly */}
            <motion.div 
              className="relative w-full max-w-5xl h-[70vh] max-h-[600px] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-200 mb-40 md:mb-72"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setModalData(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-slate-100 backdrop-blur rounded-full text-slate-800 transition-colors shadow-sm border border-slate-200"
              >
                <X size={20} />
              </button>

              {/* Left: Image */}
              <div className="md:w-5/12 h-1/3 md:h-full relative overflow-hidden bg-slate-100">
                <img 
                  src={modalData.image} 
                  alt={modalData.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent md:hidden" />
              </div>

              {/* Right: Content */}
              <div className="md:w-7/12 h-2/3 md:h-full p-8 md:p-12 overflow-y-auto bg-gradient-to-br from-white to-slate-50">
                <div className="flex items-center gap-3 mb-4 text-thl-blue">
                  <Calendar size={16} />
                  <span className="font-mono text-xs tracking-widest font-bold">
                    {getDateParts(modalData.date).month}-{getDateParts(modalData.date).day}, {getDateParts(modalData.date).year}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                  {modalData.title}
                </h2>

                <div className="w-16 h-1 bg-thl-blue mb-8" />

                <div className="prose prose-sm md:prose-base text-slate-600 font-light leading-relaxed">
                  <p>{modalData.content}</p>
                  {/* Placeholder text for fuller body since data might be short */}
                  <p className="mt-6">
                    {language === 'cn' 
                      ? '随着技术的不断进步，我们致力于在这一领域持续创新。该项目不仅代表了我们在能源技术上的突破，更展示了我们对未来可持续发展的坚定承诺。通过与全球合作伙伴的紧密协作，我们将继续探索清洁能源的无限可能，为构建绿色地球贡献力量。'
                      : '技術の進歩に伴い、私たちはこの分野での革新を続けています。このプロジェクトは、エネルギー技術における当社のブレークスルーを表すだけでなく、持続可能な未来への確固たるコミットメントを示しています。グローバルパートナーとの緊密な協力を通じて、クリーンエネルギーの無限の可能性を探求し続け、緑豊かな地球の構築に貢献します。'}
                  </p>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};