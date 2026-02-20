import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { content } from '../data/content';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const { navigateTo } = useNavigation();
  const t = content[language].footer;

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigateTo(href as any);
  };

  return (
    <footer className="relative bg-[#0F172A] pt-16 pb-10 overflow-hidden border-t border-thl-blue z-50">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-thl-blue/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          
          {/* Logo & Address */}
          <div className="md:w-1/3">
            <img 
              src="https://leondou.com/wp-content/uploads/2025/06/ChatGPT-Image-2025年6月28日-23_20_50.png" 
              alt="THL Logo" 
              className="w-40 mb-6 brightness-0 invert" 
            />
            <address className="not-italic text-gray-400 text-sm leading-7">
              {t.address.zip}<br/>
              {t.address.line1}<br/>
              <span className="text-thl-highlight font-bold mt-2 block">{t.address.tel}</span>
            </address>
          </div>

          {/* Links Grid */}
          <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div className="flex flex-col gap-3">
              {t.links.col1.map((link) => (
                <a 
                  key={link.label} 
                  href={`#${link.href}`} 
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-gray-300 hover:text-thl-highlight transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {t.links.col2.map((link) => (
                <a 
                  key={link.label} 
                  href={`#${link.href}`} 
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-gray-300 hover:text-thl-highlight transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
               {t.links.col3.map((link) => (
                <a 
                  key={link.label} 
                  href={`#${link.href}`} 
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-gray-400 hover:text-white transition-colors text-xs"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-mono">{t.copyright}</p>
          <div className="flex gap-4">
             {/* Social placeholders could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};