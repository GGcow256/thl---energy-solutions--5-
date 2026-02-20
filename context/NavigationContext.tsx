import React, { createContext, useContext, useState, ReactNode } from 'react';

type Page = 'home' | 'business' | 'products' | 'news' | 'sustainability' | 'contact' | 'copyright' | 'privacy';

interface NavigationContextType {
  currentPage: Page;
  targetSection: string | null;
  navigateTo: (page: Page, sectionId?: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [targetSection, setTargetSection] = useState<string | null>(null);

  const navigateTo = (page: Page, sectionId?: string) => {
    setCurrentPage(page);
    if (sectionId) {
      setTargetSection(sectionId);
    } else {
      setTargetSection(null);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo, targetSection }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};