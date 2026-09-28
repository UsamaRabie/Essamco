'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { SiteContent, ShowcaseCard } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ShowcasePrivateLabelProps {
  content?: SiteContent['privateLabel'];
  onOpenQuote?: () => void;
}

export const ShowcasePrivateLabel: React.FC<ShowcasePrivateLabelProps> = ({
  content,
}) => {
  const { language } = useLanguage();
  const router = useRouter();
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const title = isAr
    ? content?.titleAr || 'التصنيع للغير'
    : content?.title || 'Private Label';

  const subtitle = isAr
    ? content?.subtitleAr ||
      'من التركيبة وحتى التغليف النهائي، نقدم نفس معايير التصنيع لخط إنتاجك الخاص.'
    : content?.subtitle ||
      'From formulation to final packaging, we bring the same manufacturing standards to your private label line.';

  const cards: ShowcaseCard[] = content?.cards || [];

  const handleCardClick = (slug: string) => {
    router.push(`/${language}/private-label/${slug}`);
  };

  const handleViewMore = () => {
    router.push(`/${language}/private-label`);
  };

  return (
    <section id="private-label" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <ScrollReveal type="up">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="text-start">
            <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-normal">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleViewMore}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#1E2D4A] hover:text-blue-700 transition-colors group cursor-pointer"
          >
            <span>{isAr ? 'عرض كافة خدمات التصنيع' : 'View All Manufacturing Services'}</span>
            <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </ScrollReveal>

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card, idx) => {
          const cardTitle = isAr && card.titleAr ? card.titleAr : card.title;
          const cardSlug = card.slug || `service-${idx + 1}`;

          return (
            <ScrollReveal key={idx} type="up" delay={idx * 120}>
              <div
                onClick={() => handleCardClick(cardSlug)}
                className="group relative h-52 sm:h-56 rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 cursor-pointer bg-slate-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-end"
              >
                {/* Background Card Image */}
                <Image
                  src={card.image}
                  alt={cardTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
                />

                {/* Gradient Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:via-slate-950/50 transition-colors" />

                {/* Bottom Card Content */}
                <div className="relative z-10 p-5 flex items-end justify-between gap-3">
                  <div>
                    {card.badge && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[10px] font-bold mb-1.5 backdrop-blur-xs">
                        {isAr && card.badgeAr ? card.badgeAr : card.badge}
                      </span>
                    )}
                    <h3 className="text-white font-bold text-sm sm:text-base leading-snug drop-shadow-sm line-clamp-2">
                      {cardTitle}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium mt-1 flex items-center gap-1 group-hover:text-white transition-colors">
                      <span>{isAr ? 'عرض المواصفات والصور' : 'View Specs & Gallery'}</span>
                      <ArrowIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[#1E2D4A] group-hover:scale-110 transition-all">
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* View More Button */}
      <ScrollReveal type="up" delay={250}>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleViewMore}
            className="bg-[#1E2D4A] hover:bg-[#152035] text-white px-10 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-98 cursor-pointer flex items-center gap-2"
          >
            <span>{isAr ? 'عرض المزيد من خدمات التصنيع للغير' : 'View More Private Label Services'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
};
