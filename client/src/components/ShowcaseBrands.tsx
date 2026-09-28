'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { BrandItem } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ShowcaseBrandsProps {
  content?: BrandItem[];
  onSelectBrand?: (brandSlug?: string) => void;
}

export const ShowcaseBrands: React.FC<ShowcaseBrandsProps> = ({
  content,
  onSelectBrand,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const brandLogos = content || [];

  return (
    <section id="brands" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Title */}
      <ScrollReveal type="up">
        <div className="mb-8 text-start">
          <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
            {isAr ? 'علاماتنا التجارية' : 'Our Brands'}
          </h2>
        </div>
      </ScrollReveal>

      {/* Logos Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 items-center justify-items-center py-4 px-2">
        {brandLogos.map((brand, idx) => (
          <ScrollReveal key={idx} type="scale" delay={idx * 100} className="w-full">
            <button
              type="button"
              onClick={() => {
                if (onSelectBrand) onSelectBrand(brand.slug);
              }}
              className="group relative w-full h-16 sm:h-20 flex items-center justify-center p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-300 hover:shadow-xs hover:-translate-y-0.5 cursor-pointer"
              title={isAr && brand.nameAr ? brand.nameAr : brand.name}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={140}
                  height={52}
                  className="object-contain max-h-12 w-auto filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 drop-shadow-2xs group-hover:scale-105"
                />
              </div>
            </button>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
