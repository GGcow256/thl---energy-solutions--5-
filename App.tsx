import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Products } from './components/Products';
import { NewsPage } from './components/NewsPage';
import { Sustainability } from './components/Sustainability';
import { Contact } from './components/Contact';
import { Copyright } from './components/Copyright';
import { Privacy } from './components/Privacy';
import { Footer } from './components/Footer';
import { Business } from './components/Business';
import { BackgroundParticles } from './components/BackgroundParticles';
import { LanguageProvider } from './context/LanguageContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { AnimatePresence, motion } from 'framer-motion';

// --- 新增：充满设计感的蓝白渐变玻璃态加载屏 ---
const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }} // 略微加快淡出速度，更干脆
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* 动态背景光晕 (流体模糊效果) */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-200/50 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000" />
      
      {/* 居中毛玻璃卡片 */}
      <div className="relative z-10 flex flex-col items-center p-12 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
        
        {/* 动态圆环 */}
        <div className="relative flex flex-col items-center mb-8">
          <div className="absolute -inset-6 border-2 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
          <div className="absolute -inset-3 border-2 border-cyan-400/20 border-b-cyan-500 rounded-full animate-reverse-spin" style={{ animationDuration: '1s' }} />
          {/* 中心能量核心 */}
          <div className="w-4 h-4 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)] animate-pulse" />
        </div>
        
        {/* 文字与进度条 */}
        <div className="flex flex-col items-center gap-4">
           <span className="font-mono tracking-[0.4em] text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">
             SYSTEM INITIALIZING
           </span>
           <div className="w-48 h-1.5 bg-blue-900/10 rounded-full overflow-hidden shadow-inner">
              {/* 进度条动画时间调整为 1.5s 配合全局超时 */}
              <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 animate-[loadingBar_1.5s_ease-out_forwards]" />
           </div>
        </div>
      </div>

      {/* 内联动画关键帧 */}
      <style>{`
        @keyframes loadingBar {
          0% { width: 0%; }
          40% { width: 60%; }
          100% { width: 100%; }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </motion.div>
  );
};

// Wrapper component to handle scroll reset on mount
const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={className}>
      {children}
    </div>
  );
};

const MainContent: React.FC = () => {
  const { currentPage } = useNavigation();

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'business' ? (
        <motion.div
          key="business"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <PageWrapper className="relative z-10 flex flex-col gap-0 pb-0">
            <Navbar />
            <Business />
            <Footer />
          </PageWrapper>
        </motion.div>
      ) : currentPage === 'products' ? (
        <motion.div
          key="products"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <PageWrapper className="relative z-10 flex flex-col gap-0 pb-0">
            <Navbar />
            <Products />
            <Footer />
          </PageWrapper>
        </motion.div>
      ) : currentPage === 'news' ? (
        <motion.div
          key="news"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <PageWrapper className="relative z-10 flex flex-col gap-0 pb-0">
            <Navbar />
            <NewsPage />
            <Footer />
          </PageWrapper>
        </motion.div>
      ) : currentPage === 'sustainability' ? (
        <motion.div
          key="sustainability"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <PageWrapper className="relative z-10 flex flex-col gap-0 pb-0">
            <Navbar />
            <Sustainability />
            <Footer />
          </PageWrapper>
        </motion.div>
      ) : currentPage === 'contact' ? (
        <motion.div
          key="contact"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <PageWrapper className="relative z-10 flex flex-col gap-0 pb-0">
            <Navbar />
            <Contact />
            <Footer />
          </PageWrapper>
        </motion.div>
      ) : currentPage === 'copyright' ? (
        <motion.div
          key="copyright"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <PageWrapper className="relative z-10 flex flex-col gap-0 pb-0">
            <Navbar />
            <Copyright />
            <Footer />
          </PageWrapper>
        </motion.div>
      ) : currentPage === 'privacy' ? (
        <motion.div
          key="privacy"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <PageWrapper className="relative z-10 flex flex-col gap-0 pb-0">
            <Navbar />
            <Privacy />
            <Footer />
          </PageWrapper>
        </motion.div>
      ) : (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <PageWrapper className="relative z-10 flex flex-col gap-0 pb-0">
            <Navbar />
            <Hero />
          </PageWrapper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // 遮罩时间调整为 1.5 秒
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationProvider>
      <LanguageProvider>
        
        {/* 加载屏 */}
        <AnimatePresence>
          {isAppLoading && <LoadingScreen />}
        </AnimatePresence>

        {/* 网站主体内容 */}
        <div className="relative min-h-screen bg-[#020617] font-sans selection:bg-cyan-500 selection:text-white text-slate-200">
          <BackgroundParticles />
          <MainContent />
        </div>
        
      </LanguageProvider>
    </NavigationProvider>
  );
};

export default App;