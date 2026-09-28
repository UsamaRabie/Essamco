'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { SiteContent, SiteSocialLinks } from '../types';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface ShowcaseFooterProps {
  content?: SiteContent['footerSettings'];
  socialLinks?: SiteSocialLinks;
  onOpenAdmin?: () => void;
}

export const ShowcaseFooter: React.FC<ShowcaseFooterProps> = ({
  content,
  socialLinks,
  onOpenAdmin,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const tagline = isAr
    ? content?.taglineAr || 'تصنيع حلول كيميائية ومنظفات موثوقة منذ عام 1997.'
    : content?.tagline || 'Manufacturing trusted chemical solutions since 1997.';

  const newsletterTitle = isAr
    ? content?.newsletterTitleAr || 'اشترك في النشرة البريدية'
    : content?.newsletterTitle || 'Subscribe to Newsletter';

  const copyright = isAr
    ? content?.copyrightAr || '© جميع الحقوق محفوظة لشركة عصامكو 2026'
    : content?.copyright || '© Copyright 2026, All Rights Reserved by Essamco';

  // Format WhatsApp Link
  const rawWa = socialLinks?.whatsapp?.trim();
  const whatsappUrl = rawWa
    ? rawWa.startsWith('http')
      ? rawWa
      : `https://wa.me/${rawWa.replace(/[^0-9]/g, '')}`
    : '';

  const fbUrl = socialLinks?.facebook?.trim();
  const twUrl = socialLinks?.twitter?.trim();
  const liUrl = socialLinks?.linkedin?.trim();
  const igUrl = socialLinks?.instagram?.trim();
  const ytUrl = socialLinks?.youtube?.trim();
  const ttUrl = socialLinks?.tiktok?.trim();

  const hasAnySocial = fbUrl || twUrl || liUrl || igUrl || whatsappUrl || ytUrl || ttUrl;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="bg-[#F8FAFC] border-t border-slate-200/80 text-[#334155] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <ScrollReveal type="up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12">
          
          {/* Left Side: Logo, Tagline, Socials, Newsletter (col-span-7) */}
          <div className="md:col-span-7 space-y-5 text-start">
            {/* Logo */}
            <div className="relative w-44 h-12">
              <Image
                src="/images/brands/logo-essamco.png"
                alt="ESSAMCO International Chemicals Co."
                fill
                className="object-contain object-left rtl:object-right"
              />
            </div>

            {/* Tagline */}
            <p className="text-xs sm:text-[13px] text-[#64748B] max-w-sm leading-relaxed">
              {tagline}
            </p>

            {/* Dynamic Social Icons - Only rendered if link is provided */}
            {hasAnySocial && (
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {/* WhatsApp */}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    title="WhatsApp"
                    className="w-8 h-8 rounded-full bg-[#1E2D4A] hover:bg-[#25D366] text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.19.53-1.11 1.04-1.53 1.1-.38.06-.87.08-1.4-.09-.32-.1-.73-.24-1.26-.47-2.22-.96-3.67-3.21-3.78-3.36-.11-.15-.9-1.2-0.9-2.29 0-1.09.57-1.62.77-1.84.2-.22.44-.28.59-.28.15 0 .3 0 .43.01.14.01.32-.05.5.38.19.45.64 1.56.7 1.68.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-0.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.13 1.11z" />
                    </svg>
                  </a>
                )}

                {/* Facebook */}
                {fbUrl && (
                  <a
                    href={fbUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    title="Facebook"
                    className="w-8 h-8 rounded-full bg-[#1E2D4A] hover:bg-[#1877F2] text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                )}

                {/* Twitter / X */}
                {twUrl && (
                  <a
                    href={twUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Twitter"
                    title="X / Twitter"
                    className="w-8 h-8 rounded-full bg-[#1E2D4A] hover:bg-black text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}

                {/* LinkedIn */}
                {liUrl && (
                  <a
                    href={liUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                    className="w-8 h-8 rounded-full bg-[#1E2D4A] hover:bg-[#0A66C2] text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                )}

                {/* Instagram */}
                {igUrl && (
                  <a
                    href={igUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="w-8 h-8 rounded-full bg-[#1E2D4A] hover:bg-[#E4405F] text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  >
                    <svg className="w-4 h-4 fill-none stroke-white stroke-2" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                )}

                {/* YouTube */}
                {ytUrl && (
                  <a
                    href={ytUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    title="YouTube"
                    className="w-8 h-8 rounded-full bg-[#1E2D4A] hover:bg-[#FF0000] text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}

                {/* TikTok */}
                {ttUrl && (
                  <a
                    href={ttUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok"
                    title="TikTok"
                    className="w-8 h-8 rounded-full bg-[#1E2D4A] hover:bg-black text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Newsletter Subscription */}
            <div className="pt-2 space-y-2 max-w-sm">
              <span className="text-xs font-bold text-[#0F172A] block">
                {newsletterTitle}
              </span>

              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'شكراً لاشتراكك في النشرة البريدية!' : 'Thank you for subscribing!'}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'Enter email address'}
                    required
                    className="flex-1 bg-white border border-slate-300 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E2D4A]"
                  />
                  <button
                    type="submit"
                    className="bg-[#1E2D4A] hover:bg-[#152035] text-white px-5 py-2 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    {isAr ? 'انضم' : 'Join'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Side: Navigation Links in 2 Columns (col-span-5) */}
          <div className="md:col-span-5 flex sm:justify-end gap-14 text-xs font-medium text-[#475569]">
            {/* Column 1 */}
            <div className="space-y-3.5">
              <div>
                <Link href="/" className="hover:text-[#0F172A] transition-colors">
                  {isAr ? 'الرئيسية' : 'Home'}
                </Link>
              </div>
              <div>
                <a href="#why-us" className="hover:text-[#0F172A] transition-colors">
                  {isAr ? 'من نحن' : 'About Us'}
                </a>
              </div>
              <div>
                <a href="#products" className="hover:text-[#0F172A] transition-colors">
                  {isAr ? 'المنتجات' : 'Products'}
                </a>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-3.5">
              <div>
                <a href="#contact" className="hover:text-[#0F172A] transition-colors">
                  {isAr ? 'تواصل معنا' : 'Contact Us'}
                </a>
              </div>
              <div className="flex items-center gap-1 hover:text-[#0F172A] cursor-pointer transition-colors">
                <span>{isAr ? 'المزيد' : 'More'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

        {/* Bottom Bar: Divider line & Copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#94A3B8]">
          <p className="text-center sm:text-start">
            {copyright}
          </p>
        </div>

      </div>
    </footer>
  );
};
