import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Page = 'home' | 'business' | 'products' | 'news' | 'sustainability' | 'contact' | 'copyright' | 'privacy';

interface NavigationContextType {
  currentPage: Page;
  targetSection: string | null;
  navigateTo: (page: Page, sectionId?: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// 你的项目的基础路径 (比如 localhost:3000/liu/)
const BASE_PATH = '/liu';

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  // 1. 初始化时，根据当前网址的 URL 决定显示哪个页面
  const getInitialPage = (): Page => {
    // 获取当前路径并去掉基础路径和斜杠
    let path = window.location.pathname.replace(BASE_PATH, '').replace(/\//g, '');
    const validPages: Page[] = ['home', 'business', 'products', 'news', 'sustainability', 'contact', 'copyright', 'privacy'];
    
    // 如果 URL 中有合法的页面名称，则返回该名称；否则默认返回 'home'
    return validPages.includes(path as Page) ? (path as Page) : 'home';
  };

  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage());
  const [targetSection, setTargetSection] = useState<string | null>(null);

  // 2. 切换页面时，同步修改浏览器的网址 URL
  const navigateTo = (page: Page, sectionId?: string) => {
    setCurrentPage(page);
    setTargetSection(sectionId || null);
    
    // 构造新的 URL。如果是 home，就直接回到 /liu/，否则变成 /liu/xxx/
    const newPath = page === 'home' ? `${BASE_PATH}/` : `${BASE_PATH}/${page}/`;
    
    // 使用 HTML5 History API 无刷新修改网址
    window.history.pushState({ page }, '', newPath);
    
    // 每次切换页面时，滚动到顶部
    window.scrollTo(0, 0);
  };

  // 3. 监听浏览器的“前进/后退”按钮，实现网页真正的返回功能
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 当用户点击浏览器返回按钮时，获取上一个状态的页面名称
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
      } else {
        // 如果没有状态，则重新解析 URL
        setCurrentPage(getInitialPage());
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPage, targetSection, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};