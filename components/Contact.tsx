import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { content } from '../data/content';
import { TextReveal } from './ui/TextReveal';
import { ArrowDown, Send, CheckCircle2 } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
// 引入 emailjs
import emailjs from '@emailjs/browser';

export const Contact: React.FC = () => {
  const { language } = useLanguage();
  const { navigateTo } = useNavigation(); 
  const t = content[language].contact;
  
  const [formData, setFormData] = useState({
    type: 'corporate', // Default
    company: '',
    department: '',
    name: '',
    email: '',
    phone: '',
    interest: [] as string[],
    message: '',
    privacy: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (option: string) => {
    setFormData(prev => {
      const current = prev.interest;
      if (current.includes(option)) {
        return { ...prev, interest: current.filter(item => item !== option) };
      } else {
        return { ...prev, interest: [...current, option] };
      }
    });
  };

  const handlePrivacyLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault();  
    navigateTo('privacy');
  };

  // --- 核心修改：接入 EmailJS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacy) return;
    
    setIsSubmitting(true);
    
    const serviceID = 'your_serviceID';   
    const templateID = 'your_templateID'; 
    const publicKey = 'your_publicKey';   

    // 组织需要发送给邮箱的数据变量
    const templateParams = {
      type: formData.type === 'personal' ? '个人' : '企业',
      company: formData.company || '未填写',
      department: formData.department || '未填写',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      interest: formData.interest.length > 0 ? formData.interest.join(', ') : '未选择',
      message: formData.message || '未填写留言',
    };

    try {
      // 发送邮件请求
      await emailjs.send(serviceID, templateID, templateParams, publicKey);
      
      console.log('邮件发送成功!');
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // 可选：重置表单内容
      // setFormData({ type: 'corporate', company: '', department: '', name: '', email: '', phone: '', interest: [], message: '', privacy: false });
    } catch (error) {
      console.error('发送邮件失败:', error);
      setIsSubmitting(false);
      alert(language === 'cn' ? '发送失败，请稍后重试或检查网络设置。' : '送信に失敗しました。後でもう一度お試しください。');
    }
  };

  return (
    <div className="relative w-full bg-slate-50 min-h-screen pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={t.hero.image} 
            alt="Contact Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {t.hero.title}
            </h1>
            <p className="text-xl text-emerald-100 font-light tracking-widest uppercase">
              {t.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. CONTENT CONTAINER */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
        
        {/* INTRO CARD */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 mb-12 text-center"
        >
            <h2 className="text-3xl font-bold text-slate-800 mb-6 font-serif">{t.intro.title}</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                {t.intro.text}
            </p>
        </motion.div>

        {/* FORM */}
        {isSubmitted ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-12 shadow-xl border border-emerald-100 flex flex-col items-center text-center"
            >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                    <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{t.form.success}</h3>
                <p className="text-slate-500">
                   {language === 'cn' ? '我们会尽快与您联系。' : '担当者より折り返しご連絡させていただきます。'}
                </p>
            </motion.div>
        ) : (
            <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                onSubmit={handleSubmit}
            >
                <div className="h-2 w-full bg-gradient-to-r from-thl-blue to-cyan-500" />
                
                <div className="p-8 md:p-12 space-y-8">
                    
                    {/* Inquiry Type */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">{t.form.type.label}</label>
                        <div className="flex gap-6">
                            {t.form.type.options.map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.type === (option === '个人' || option === '個人' ? 'personal' : 'corporate') ? 'border-thl-blue' : 'border-slate-300 group-hover:border-thl-blue'}`}>
                                        {(formData.type === (option === '个人' || option === '個人' ? 'personal' : 'corporate')) && <div className="w-2.5 h-2.5 bg-thl-blue rounded-full" />}
                                    </div>
                                    <input 
                                        type="radio" 
                                        name="type" 
                                        value={option === '个人' || option === '個人' ? 'personal' : 'corporate'}
                                        checked={formData.type === (option === '个人' || option === '個人' ? 'personal' : 'corporate')}
                                        onChange={() => setFormData(prev => ({...prev, type: option === '个人' || option === '個人' ? 'personal' : 'corporate'}))}
                                        className="hidden" 
                                    />
                                    <span className="text-slate-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Company */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">{t.form.company} <span className="text-red-500">*</span></label>
                            <input 
                                required
                                type="text" 
                                name="company" 
                                value={formData.company}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-thl-blue focus:ring-2 focus:ring-thl-blue/20 outline-none transition-all"
                            />
                        </div>
                        {/* Dept */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">{t.form.department}</label>
                            <input 
                                type="text" 
                                name="department" 
                                value={formData.department}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-thl-blue focus:ring-2 focus:ring-thl-blue/20 outline-none transition-all"
                            />
                        </div>
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">{t.form.name} <span className="text-red-500">*</span></label>
                            <input 
                                required
                                type="text" 
                                name="name" 
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-thl-blue focus:ring-2 focus:ring-thl-blue/20 outline-none transition-all"
                            />
                        </div>
                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">{t.form.phone} <span className="text-red-500">*</span></label>
                            <input 
                                required
                                type="tel" 
                                name="phone" 
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-thl-blue focus:ring-2 focus:ring-thl-blue/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Email - Full Width */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700">{t.form.email} <span className="text-red-500">*</span></label>
                        <input 
                            required
                            type="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-thl-blue focus:ring-2 focus:ring-thl-blue/20 outline-none transition-all"
                        />
                    </div>

                    {/* Interest Checkboxes */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700">{t.form.interest.label}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {t.form.interest.options.map((option) => (
                                <label key={option} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.interest.includes(option) ? 'bg-thl-blue border-thl-blue' : 'border-slate-300 bg-white group-hover:border-thl-blue'}`}>
                                        {formData.interest.includes(option) && <div className="text-white"><CheckCircle2 size={14} /></div>}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        value={option}
                                        checked={formData.interest.includes(option)}
                                        onChange={() => handleCheckboxChange(option)}
                                        className="hidden"
                                    />
                                    <span className="text-slate-600 group-hover:text-slate-900 text-sm font-medium">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700">{t.form.message.label}</label>
                        <textarea 
                            name="message" 
                            rows={5}
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder={t.form.message.placeholder}
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-thl-blue focus:ring-2 focus:ring-thl-blue/20 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Privacy & Submit */}
                    <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-6">
                        <label className="flex items-center gap-3 cursor-pointer group select-none">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${formData.privacy ? 'bg-thl-blue border-thl-blue' : 'border-slate-300 bg-white group-hover:border-thl-blue'}`}>
                                {formData.privacy && <div className="text-white"><CheckCircle2 size={14} /></div>}
                            </div>
                            <input 
                                type="checkbox" 
                                checked={formData.privacy}
                                onChange={(e) => setFormData(prev => ({...prev, privacy: e.target.checked}))}
                                className="hidden"
                            />
                            <span className="text-sm text-slate-600 group-hover:text-thl-text transition-colors">
                                {/* Use structured data if available, fallback to string if type mismatch (though data is updated) */}
                                {typeof t.form.privacy === 'object' ? (
                                  <>
                                    {t.form.privacy.prefix}
                                    <span 
                                      className="text-thl-blue hover:underline cursor-pointer font-semibold mx-1"
                                      onClick={handlePrivacyLinkClick}
                                    >
                                      {t.form.privacy.link}
                                    </span>
                                    {t.form.privacy.suffix}
                                  </>
                                ) : (
                                  <span>{t.form.privacy}</span>
                                )}
                            </span>
                        </label>

                        <button 
                            type="submit"
                            disabled={!formData.privacy || isSubmitting}
                            className={`
                                relative px-12 py-4 rounded-full font-bold text-white tracking-widest uppercase transition-all duration-300 flex items-center gap-2
                                ${!formData.privacy || isSubmitting 
                                    ? 'bg-slate-300 cursor-not-allowed' 
                                    : 'bg-thl-blue hover:bg-slate-900 hover:shadow-lg hover:-translate-y-1'}
                            `}
                        >
                            {isSubmitting ? t.form.sending : t.form.submit}
                            {!isSubmitting && <Send size={18} />}
                        </button>
                    </div>

                </div>
            </motion.form>
        )}

      </div>

    </div>
  );
};