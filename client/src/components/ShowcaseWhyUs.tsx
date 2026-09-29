'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';
import { SiteContent } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ShowcaseWhyUsProps {
  content?: SiteContent['whyChooseUs'];
  onOpenQuote: () => void;
}

export const ShowcaseWhyUs: React.FC<ShowcaseWhyUsProps> = ({
  content,
  onOpenQuote,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const title = isAr
    ? content?.titleAr || 'لماذا تختارنا'
    : content?.title || 'Why Choose Us';

  const subtitle = isAr
    ? content?.subtitleAr || 'صُممنا لنقدم أكثر من مجرد منتجات'
    : content?.subtitle || 'Built to Deliver More Than Just Products';

  const btnText = isAr
    ? content?.btnTextAr || 'طلب عرض سعر'
    : content?.btnText || 'Request a Quote';

  const image = content?.image || '/images/showcase/why_us_scientist_hd.png';
  const points = content?.points || [];

  return (
    <section id="why-us" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Big Image Card with Scientist & Overlay Text */}
        <div className="lg:col-span-6">
          <ScrollReveal type="scale" delay={50}>
            <div className="relative h-[360px] sm:h-[440px] rounded-[24px] overflow-hidden shadow-sm border border-slate-100 group">
              {/* Background Scientist Image */}
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />

              {/* Dark gradient at top for text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/30" />

              {/* Top Text on Card */}
              <div className="relative z-10 p-6 sm:p-8 text-start">
                <h3 className="text-2xl sm:text-[28px] font-black text-white tracking-tight leading-snug drop-shadow-sm">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1.5 font-medium drop-shadow-sm">
                  {subtitle}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: 4 Feature Points with Blue Checkmarks + CTA Button */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 text-start">
          <div className="space-y-5">
            {points.map((pt, idx) => {
              const ptTitle = isAr && pt.titleAr ? pt.titleAr : pt.title;
              const ptDesc = isAr && pt.descAr ? pt.descAr : pt.desc;

              return (
                <ScrollReveal key={idx} type="up" delay={idx * 100}>
                  <div className="flex items-start gap-3.5 p-2.5 rounded-2xl transition-all duration-200 hover:bg-blue-50/40 hover:translate-x-1 group">
                    {/* Blue Checkmark Icon */}
                    <div className="mt-0.5 shrink-0 group-hover:scale-115 transition-transform duration-200">
                      <CheckCircle2 className="w-5 h-5 text-[#3B82F6]" />
                    </div>

                    {/* Point Text */}
                    <div>
                      <h4 className="text-sm sm:text-[15px] font-bold text-[#0F172A] leading-tight group-hover:text-blue-700 transition-colors">
                        {ptTitle}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-[#475569] mt-1 leading-relaxed">
                        {ptDesc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Request a Quote Button */}
          <ScrollReveal type="up" delay={300}>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenQuote}
                className="btn-hover-shine w-full sm:w-auto bg-[#1E2D4A] hover:bg-[#152035] text-white px-9 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:scale-102 active:scale-98 cursor-pointer"
              >
                {btnText}
              </button>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
};
