'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onOpenQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuote }) => {
  const { language, toggleLanguage, t, direction } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: language === 'ar' ? 'الرئيسية' : 'Home', href: `/${language}` },
    { label: language === 'ar' ? 'الحلول المؤسسية' : 'Institutional', href: `/${language}/institutional` },
    { label: language === 'ar' ? 'التصنيع للغير' : 'Private Label', href: `/${language}/private-label` },
    { label: language === 'ar' ? 'المنتجات' : 'Products', href: `/${language}/products` },
    { label: language === 'ar' ? 'من نحن' : 'About Us', href: `/${language}#why-us` },
    { label: language === 'ar' ? 'تواصل معنا' : 'Contact Us', href: `/${language}#partnership-cta` },
  ];

  return (
    <header
      className={`w-full sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80 py-0'
          : 'bg-white/90 backdrop-blur-sm shadow-xs border-b border-slate-100 py-0.5'
      }`}
    >
      {/* Main Navigation Bar - Directly at top with zero extra bars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <a
            href={`/${language}`}
            className="flex items-center gap-3 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/brands/logo-essamco.png"
                alt="ESSAMCO"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
          </a>

          {/* Desktop Nav Links Matching Screenshot */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#0F172A] hover:text-blue-700 transition-colors py-2"
              >
                {link.label}
              </a>
            ))}

            {/* More Dropdown link */}
            <div className="flex items-center gap-1 text-sm font-semibold text-[#0F172A] hover:text-blue-700 cursor-pointer transition-colors">
              <span>{language === 'ar' ? 'المزيد' : 'More'}</span>
              <span className="text-xs">▾</span>
            </div>
          </nav>

          {/* Actions: Integrated Language Switcher + Quote CTA */}
          <div className="hidden sm:flex items-center gap-5">
            {/* Integrated Language Switcher Matching Screenshot */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] hover:text-blue-700 transition-colors cursor-pointer"
              title={language === 'en' ? 'التحويل إلى اللغة العربية' : 'Switch to English'}
              aria-label="Toggle language"
            >
              <span>{language === 'en' ? 'English' : 'العربية'}</span>
              <span className="text-xs">▾</span>
            </button>

            {/* Request Quotation CTA Button (Navy Pill) */}
            <button
              onClick={onOpenQuote}
              type="button"
              className="relative inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all duration-200 bg-[#1E2D4A] hover:bg-[#152035] rounded-full shadow-sm active:scale-95 focus:outline-none cursor-pointer"
            >
              <span>{language === 'ar' ? 'طلب عرض سعر' : 'Request a Quote'}</span>
            </button>
          </div>

          {/* Mobile Right Controls: Language Switcher + Dark Circle Menu Toggle */}
          <div className="flex items-center sm:hidden gap-2">
            <button
              onClick={toggleLanguage}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200"
              aria-label="Toggle language"
            >
              <span>{language === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="w-10 h-10 rounded-full bg-[#1E2D4A] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Tablet Hamburger (when sm but below lg) */}
          <div className="hidden sm:flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2.5 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors flex justify-between items-center"
              >
                <span>{link.label}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
              </a>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                type="button"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-center shadow-md shadow-blue-700/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('nav.requestQuote')}</span>
              </button>

              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                type="button"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold rounded-xl text-center text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'en' ? 'التحويل إلى اللغة العربية (Arabic)' : 'Switch to English'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
