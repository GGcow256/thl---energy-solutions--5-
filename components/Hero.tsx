import React, { useRef, useLayoutEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows, Stars, Grid } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import * as THREE from 'three';
import { BatteryModel } from './BatteryModel';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { content } from '../data/content';
import { ChevronDown } from 'lucide-react';
import { THLButton } from './ui/P3Button';

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

// Add type definitions for R3F elements to satisfy TypeScript compiler
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      spotLight: any;
      fog: any;
    }
  }
}

// --- Types ---
interface SceneProps {
  scrollProgress: React.MutableRefObject<number>;
}

// --- 3D Scene Component ---
const Scene: React.FC<SceneProps> = ({ scrollProgress }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  
  // Camera Waypoints
  const cameraPoints = [
    { pos: new THREE.Vector3(0, 1, 14), target: new THREE.Vector3(0, 0, 0) },       // 0% - Intro (Slightly higher)
    { pos: new THREE.Vector3(6, -2, 6), target: new THREE.Vector3(0, -2, 0) },      // 20% - Business
    { pos: new THREE.Vector3(-5, 0, 5), target: new THREE.Vector3(0, 0, 0) },       // 40% - Products
    { pos: new THREE.Vector3(5, 2, 8), target: new THREE.Vector3(0, 0, 0) },        // 60% - News
    { pos: new THREE.Vector3(0, 6, 4), target: new THREE.Vector3(0, 0, 0) },        // 80% - Sustainability
    { pos: new THREE.Vector3(0, 0, 8), target: new THREE.Vector3(0, 0, 0) },        // 100% - Contact
  ];

  useFrame((state) => {
    if (!cameraRef.current) return;

    const p = scrollProgress.current;
    
    const segmentLength = 1 / (cameraPoints.length - 1);
    const currentSegment = Math.floor(p / segmentLength);
    const nextSegment = Math.min(cameraPoints.length - 1, currentSegment + 1);
    const segmentProgress = (p - currentSegment * segmentLength) / segmentLength; 

    const start = cameraPoints[Math.min(cameraPoints.length - 1, currentSegment)];
    const end = cameraPoints[nextSegment];

    // Interpolate Position
    const currentPos = new THREE.Vector3().lerpVectors(start.pos, end.pos, segmentProgress);
    cameraRef.current.position.lerp(currentPos, 0.08); // Smoother damping

    // Interpolate LookAt Target
    const currentTarget = new THREE.Vector3().lerpVectors(start.target, end.target, segmentProgress);
    
    // Smooth LookAt
    const dummyVec = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dummyVec);
    const currentLookAt = new THREE.Vector3().copy(cameraRef.current.position).add(dummyVec);
    const smoothedLookAt = new THREE.Vector3().lerpVectors(currentLookAt, currentTarget, 0.08);
    
    cameraRef.current.lookAt(smoothedLookAt);

    // Dynamic Light movement - Rotate around the model
    if (spotLightRef.current) {
        spotLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 8;
        spotLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 8;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={40} near={0.1} far={100} />
      
      {/* --- Lighting Setup (Studio / Sci-Fi) --- */}
      <ambientLight intensity={0.5} color="#e0f2fe" />
      
      {/* Main Key Light */}
      <directionalLight 
        ref={lightRef} 
        position={[5, 10, 5]} 
        intensity={1.5} 
        color="#ffffff" 
        castShadow 
      />
      
      {/* Moving Rim Light for cool reflections */}
      <spotLight 
        ref={spotLightRef}
        position={[8, 0, 8]}
        intensity={5}
        color="#06b6d4" // Cyan rim light
        angle={0.5}
        penumbra={1}
        distance={20}
      />

      {/* Fill Light */}
      <pointLight position={[-5, -2, -5]} intensity={1} color="#3b82f6" />
      
      {/* --- Environment & Atmosphere --- */}
      {/* Use 'studio' preset for better metal/glass reflections */}
      <Environment preset="studio" blur={0.8} /> 
      
      {/* Fog to blend floor into background color */}
      {/* Color matches the tailwind slate-100/200 gradient bottom */}
      <fog attach="fog" args={['#e2e8f0', 5, 25]} /> 

      {/* --- Objects --- */}
      <BatteryModel />

      {/* --- Floor --- */}
      <group position={[0, -4, 0]}>
        <Grid 
          args={[30, 30]} 
          cellColor="#94a3b8" 
          sectionColor="#3b82f6" 
          fadeDistance={20} 
          fadeStrength={1}
          cellThickness={0.5}
          sectionThickness={1}
          infiniteGrid
        />
        <ContactShadows opacity={0.5} scale={20} blur={2.5} far={4} color="#1e293b" />
      </group>
      
      {/* --- Background Particles --- */}
      <Stars radius={40} depth={20} count={3000} factor={3} saturation={0} fade speed={0.5} />
    </>
  );
};

// --- Main Hero Component ---
export const Hero: React.FC = () => {
  const { language } = useLanguage();
  const { navigateTo } = useNavigation();
  const t = content[language];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const [activeSection, setActiveSection] = useState(0);

  // Content Data
  const sections = [
    {
      id: 'home',
      label: 'Welcome',
      title: t.hero.label,
      subtitle: t.hero.subtitle,
      desc: language === 'cn' ? '探索未来能源的无限可能' : '未来のエネルギーの可能性を探る',
      btn: t.hero.scroll,
      action: () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    },
    {
      id: 'business',
      label: 'Business',
      title: language === 'cn' ? '公司简介' : '企業情報', 
      subtitle: 'Corporate Philosophy',
      desc: t.business.philosophy.items[0].desc,
      btn: language === 'cn' ? '了解业务' : '事業紹介',
      action: () => navigateTo('business')
    },
    {
      id: 'products',
      label: 'Products',
      title: language === 'cn' ? '产品介绍' : '製品情報',
      subtitle: 'Advanced Battery Tech',
      desc: t.homeProducts.items[0].description,
      btn: language === 'cn' ? '查看产品' : '製品一覧',
      action: () => navigateTo('products')
    },
    {
      id: 'news',
      label: 'News',
      title: language === 'cn' ? '公司动态' : 'ニュース', 
      subtitle: 'Global Updates',
      desc: t.news.items[0].content,
      btn: language === 'cn' ? '阅读新闻' : 'ニュースを読む',
      action: () => navigateTo('news')
    },
    {
      id: 'sustainability',
      label: 'SDGs',
      title: language === 'cn' ? '可持续发展' : 'サステナビリティ',
      subtitle: 'Green Energy',
      desc: t.sustainability.sections[0].content.substring(0, 50) + '...',
      btn: language === 'cn' ? '可持续发展' : 'サステナビリティ',
      action: () => navigateTo('sustainability')
    },
    {
      id: 'contact',
      label: 'Contact',
      title: language === 'cn' ? '联系我们' : 'お問い合わせ', 
      subtitle: 'Get in Touch',
      desc: language === 'cn' ? '准备好开启您的能源转型之旅了吗？' : 'エネルギー変革の旅を始める準備はできましたか？',
      btn: language === 'cn' ? '联系我们' : 'お問い合わせ',
      action: () => navigateTo('contact')
    }
  ];

  useLayoutEffect(() => {
    // 1. 初始化 Lenis 平滑滚动
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1, 
    });

    // 2. 将 Lenis 挂载到 GSAP 的 Ticker 上
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    // 3. 告诉 ScrollTrigger 页面在滚动
    lenis.on('scroll', ScrollTrigger.update);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
          const index = Math.min(
            sections.length - 1, 
            Math.floor(self.progress * sections.length + 0.1)
          );
          setActiveSection(index);
        }
      });
    }, containerRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  return (
    // Replaced solid background with a radial gradient for depth
    <div 
      ref={containerRef} 
      className="relative w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-200 to-slate-300" 
      style={{ height: '600vh' }}
    >
      
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Canvas 
            events={null}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          >
             <Scene scrollProgress={scrollProgress} />
          </Canvas>
        </div>

        {/* Improved Vignette Overlay for focus */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-radial-gradient from-transparent via-transparent to-slate-400/30 mix-blend-multiply" />

        {/* Text/UI Layer */}
        <div className="absolute inset-0 z-20 pointer-events-none">
           <div className="max-w-7xl mx-auto h-full px-6 md:px-12 relative">
              
              {sections.map((section, index) => {
                const isActive = index === activeSection;
                const isLeft = index % 2 === 0; 
                
                return (
                  <div 
                    key={index}
                    className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center transition-all duration-700 ease-out
                      ${isActive ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-10 blur-sm pointer-events-none'}
                    `}
                  >
                     <div className={`max-w-xl ${isLeft ? 'mr-auto' : 'ml-auto text-right'}`}>
                        <div className={`inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/60 backdrop-blur-md border border-white/50 rounded-full shadow-sm
                           ${isLeft ? 'flex-row' : 'flex-row-reverse'}
                        `}>
                           <div className="w-2 h-2 rounded-full bg-thl-blue animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                           <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-widest">
                              0{index + 1} / {section.label}
                           </span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-2 leading-tight tracking-tight drop-shadow-sm">
                           {section.title}
                        </h2>
                        <h3 className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-thl-blue to-cyan-500 font-serif italic mb-6">
                           {section.subtitle}
                        </h3>

                        <div className={`h-1 w-24 bg-gradient-to-r from-thl-blue to-cyan-400 mb-6 rounded-full ${isLeft ? '' : 'ml-auto'}`} />

                        <p className="text-lg text-slate-600 font-light leading-relaxed mb-10 max-w-md">
                           {section.desc}
                        </p>

                        {/* 核心修复：只在当前激活的面版开启指针事件 */}
                        <div className={`inline-block ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                           <THLButton 
                              text={section.btn} 
                              onClick={section.action} 
                              variant="primary" 
                           />
                        </div>
                     </div>
                  </div>
                );
              })}

              {/* Progress Indicator */}
              <div className="absolute bottom-12 left-6 right-6 flex justify-between items-end pointer-events-none">
                  <div className="flex flex-col gap-2">
                     <span className="text-xs font-mono text-slate-500 tracking-widest">SCROLL PROGRESS</span>
                     <div className="w-48 h-1 bg-slate-300 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-thl-blue to-cyan-400 transition-all duration-300 ease-out" 
                          style={{ width: `${(activeSection / (sections.length - 1)) * 100}%` }}
                        />
                     </div>
                  </div>

                  <div className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${activeSection === sections.length - 1 ? 'opacity-0' : 'opacity-100'}`}>
                     <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest writing-mode-vertical">Scroll</span>
                     <ChevronDown className="text-thl-blue animate-bounce" size={20} />
                  </div>
              </div>

           </div>
        </div>

      </div>

    </div>
  );
};