'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SiteContent } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ShowcaseCtaBannerProps {
  content?: SiteContent['partnershipCta'];
  onOpenQuote: () => void;
}

export const ShowcaseCtaBanner: React.FC<ShowcaseCtaBannerProps> = ({
  content,
  onOpenQuote,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const title = isAr
    ? content?.titleAr || 'جاهز لمناقشة شراكة توريد؟'
    : content?.title || 'Ready to discuss a supply partnership';

  const subtitle = isAr
    ? content?.subtitleAr || 'هل لديك مشروع أو متطلبات خاصة؟ نحن هنا لمساعدتك ودعمك.'
    : content?.subtitle || "Have a project in mind? We're ready to help.";

  const btnText = isAr
    ? content?.btnTextAr || 'تواصل معنا'
    : content?.btnText || 'Contact Us';

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onOpenQuote();
    }
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ScrollReveal type="scale" delay={100}>
        <div className="bg-[#1E2D4A] rounded-[24px] py-12 sm:py-14 px-6 sm:px-10 text-center text-white shadow-sm relative overflow-hidden transition-transform duration-300 hover:shadow-lg">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10 space-y-3">
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-white">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              {subtitle}
            </p>

            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={scrollToContact}
                className="border border-white/70 hover:border-white hover:bg-white/10 text-white rounded-full px-8 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-98 cursor-pointer hover:scale-105"
              >
                {btnText}
              </button>
            </div>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
};
