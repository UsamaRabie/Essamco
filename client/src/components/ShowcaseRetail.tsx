'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, Sparkles, Eye } from 'lucide-react';
import { SiteContent, ShowcaseCard, Product } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ShowcaseRetailProps {
  content?: SiteContent['retail'];
  products?: Product[];
  onExploreProducts?: () => void;
  onOpenQuote?: () => void;
}

export const ShowcaseRetail: React.FC<ShowcaseRetailProps> = ({
  content,
  products,
}) => {
  const { language } = useLanguage();
  const router = useRouter();
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const title = isAr
    ? content?.titleAr || 'منتجات التجزئة والاستهلاك'
    : content?.title || 'Retail & Consumer Products';

  const subtitle = isAr
    ? content?.subtitleAr || 'تشكيلة متطورة للمنزل، العناية بالملابس والأسطح والسيارات بمعايير كيميائية عالمية.'
    : content?.subtitle || 'Advanced formulations for home, fabric care, surface hygiene and vehicle detailing.';

  const btnText = isAr
    ? content?.btnTextAr || 'استكشف كافة المنتجات'
    : content?.btnText || 'Explore All Products';

  // Dynamic cards: derived directly from database SiteContent.retail.cards or Product collection
  const cards: ShowcaseCard[] = React.useMemo(() => {
    if (content?.cards && content.cards.length > 0) {
      return content.cards;
    }
    if (products && products.length > 0) {
      return products.map((p) => ({
        id: p._id,
        slug: p.slug,
        title: p.name,
        titleAr: p.nameAr,
        shortDescription: p.description ? p.description.slice(0, 120) + '...' : '',
        shortDescriptionAr: p.descriptionAr ? p.descriptionAr.slice(0, 120) + '...' : '',
        image: p.image || '/images/products/disinfectant-jerrycan.jpg',
        badge: p.isFeatured ? 'Featured' : 'In Stock',
        badgeAr: p.isFeatured ? 'منتج مميز' : 'متوفر بالمخزون',
      }));
    }
    return [];
  }, [content?.cards, products]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Smooth continuous advertising ticker / auto-scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let animId: number;
    const speed = 0.8; // px per tick

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += isAr ? -speed : speed;
        // Infinite wrap around
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 5) {
          el.scrollLeft = 0;
        } else if (el.scrollLeft <= 0 && isAr) {
          el.scrollLeft = el.scrollWidth - el.clientWidth;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, isAr]);

  const scrollLeftManual = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: isAr ? 320 : -320, behavior: 'smooth' });
    }
  };

  const scrollRightManual = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: isAr ? -320 : 320, behavior: 'smooth' });
    }
  };

  const handleProductClick = (slug: string) => {
    router.push(`/${language}/products/${slug}`);
  };

  const handleExplore = () => {
    router.push(`/${language}/products`);
  };

  return (
    <section id="retail" className="py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/60 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {/* Header with Navigation Arrows */}
        <ScrollReveal type="up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="text-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-[#1E2D4A] text-xs font-bold mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{isAr ? 'عروض وكتالوج التجزئة' : 'Retail Showcase Reel'}</span>
              </div>
              <h2 className="text-2xl sm:text-[28px] font-bold text-[#0F172A] tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-normal max-w-2xl">
                {subtitle}
              </p>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={scrollLeftManual}
                aria-label="Previous"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-blue-700 flex items-center justify-center shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={scrollRightManual}
                aria-label="Next"
                className="w-9 h-9 rounded-full bg-[#1E2D4A] hover:bg-[#152035] text-white flex items-center justify-center shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* FULL-WIDTH ADVERTISING SLIDER TRACK */}
      {cards.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <p className="text-sm font-medium">
            {isAr ? 'جاري تحميل منتجات التجزئة من قاعدة البيانات...' : 'Loading retail products from database...'}
          </p>
        </div>
      ) : (
        <div
          className="w-full relative py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-8 cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cards.map((card, idx) => {
              const cardTitle = isAr && card.titleAr ? card.titleAr : card.title;
              const cardBadge = isAr && card.badgeAr ? card.badgeAr : card.badge;
              const cardDesc = isAr && card.shortDescriptionAr ? card.shortDescriptionAr : card.shortDescription;
              const cardSlug = card.slug || `product-${idx}`;

              return (
                <div
                  key={`${cardSlug}-${idx}`}
                  onClick={() => handleProductClick(cardSlug)}
                className="w-[280px] sm:w-[320px] shrink-0 group relative rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Product Image Stage */}
                <div className="relative w-full h-52 bg-gradient-to-b from-slate-100 to-slate-50 flex items-center justify-center overflow-hidden p-3">
                  <Image
                    src={card.image}
                    alt={cardTitle}
                    fill
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Top Badge */}
                  {cardBadge && (
                    <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-[#1E2D4A]/90 text-white text-[10px] font-bold shadow-md backdrop-blur-xs">
                      {cardBadge}
                    </span>
                  )}

                  {/* Hover Quick Action */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-4 py-2 rounded-full bg-white/95 text-[#1E2D4A] font-bold text-xs shadow-lg flex items-center gap-1.5 scale-90 group-hover:scale-100 transition-transform">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isAr ? 'عرض التفاصيل والصور' : 'View Specs & Photos'}</span>
                    </span>
                  </div>
                </div>

                {/* Card Info Details */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white text-start">
                  <div>
                    <h3 className="font-bold text-sm sm:text-[15px] text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                      {cardTitle}
                    </h3>
                    {cardDesc && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-normal leading-relaxed">
                        {cardDesc}
                      </p>
                    )}
                  </div>

                  {/* Bottom Action strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1E2D4A]">
                    <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-[11px] text-blue-700">
                      <span>{isAr ? 'طلب تسعير ومواصفات' : 'Specs & Quotation'}</span>
                    </span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#1E2D4A] group-hover:text-white text-slate-700 flex items-center justify-center transition-colors">
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Main Explore Catalog Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <ScrollReveal type="up" delay={200}>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleExplore}
              className="bg-[#1E2D4A] hover:bg-[#152035] text-white px-10 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-98 cursor-pointer flex items-center gap-2.5"
            >
              <span>{btnText}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
