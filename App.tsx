import React, { useEffect } from 'react';
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

// Wrapper component to handle scroll reset on mount
const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  useEffect(() => {
    // Instantly scroll to top when this component enters the DOM
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
            {/* The Hero is now the only component on the Home page */}
            <Hero />
          </PageWrapper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <LanguageProvider>
        <div className="relative min-h-screen bg-[#020617] font-sans selection:bg-cyan-500 selection:text-white text-slate-200">
          <BackgroundParticles />
          <MainContent />
        </div>
      </LanguageProvider>
    </NavigationProvider>
  );
};

export default App;