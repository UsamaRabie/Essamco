'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { SiteContent } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ShowcaseStatsProps {
  stats?: SiteContent['stats'];
}

export const ShowcaseStats: React.FC<ShowcaseStatsProps> = ({ stats }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const defaultMetrics = [
    {
      value: stats?.founded || '1997',
      label: stats?.foundedLabel || 'Founded',
      labelAr: stats?.foundedLabelAr || 'سنة التأسيس',
    },
    {
      value: stats?.years || '+25',
      label: stats?.yearsLabel || 'Years',
      labelAr: stats?.yearsLabelAr || 'عاماً',
    },
    {
      value: stats?.categories || '7',
      label: stats?.categoriesLabel || 'Categories',
      labelAr: stats?.categoriesLabelAr || 'تصنيفات',
    },
  ];

  const metrics = stats?.metrics && stats.metrics.length > 0 ? stats.metrics : defaultMetrics;

  const isoBadges = [
    { name: 'ISO 9001', src: '/images/showcase/iso_9001.svg' },
    { name: 'ISO 14001:2015', src: '/images/showcase/iso_14001.svg' },
    { name: 'ISO 45001:2018', src: '/images/showcase/iso_45001.svg' },
  ];

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-10">
        
        {/* Metric Statistics Row - Centered on Mobile */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 sm:gap-14 w-full sm:w-auto text-center sm:text-start">
          {metrics.map((metric, idx) => {
            const label = isAr && metric.labelAr ? metric.labelAr : metric.label;
            return (
              <ScrollReveal key={idx} type="up" delay={idx * 100}>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-start group cursor-default transition-transform duration-300 hover:-translate-y-1">
                  <span className="text-2xl sm:text-[28px] font-black text-[#0F172A] tracking-tight group-hover:text-blue-600 transition-colors">
                    {metric.value}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#64748B] mt-0.5 group-hover:text-slate-800 transition-colors">
                    {label}
                  </span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* 3 Prominently Sized ISO Seal Badges - Centered on Mobile */}
        <ScrollReveal type="scale" delay={250}>
          <div className="flex items-center justify-center gap-5 sm:gap-7 lg:gap-9 w-full sm:w-auto">
            {isoBadges.map((badge, idx) => (
              <div
                key={idx}
                className="relative w-20 h-24 sm:w-24 sm:h-28 lg:w-28 lg:h-32 flex items-center justify-center transition-all duration-300 hover:scale-108 hover:-translate-y-1 drop-shadow-xs hover:drop-shadow-md cursor-pointer"
                title={badge.name}
              >
                <Image
                  src={badge.src}
                  alt={badge.name}
                  width={112}
                  height={128}
                  className="object-contain w-full h-full max-h-32 select-none"
                  priority
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
