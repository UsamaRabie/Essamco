'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SiteContent, HeroSlide } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ShowcaseHeroProps {
  content?: SiteContent['hero'];
  slides?: HeroSlide[];
  onOpenQuote: () => void;
  onExploreProducts: () => void;
}

const defaultSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: 'Certified Chemical Excellence',
    badgeAr: 'تميز كيميائي معتمد',
    title: 'Quality you can certify.\nSupply you can count on.',
    titleAr: 'جودة يمكنك توثيقها.\nإمداد يمكنك الاعتماد عليه.',
    subtitle:
      'Industrial detergents and disinfectants, engineered to ISO standards — from formulation to production line.',
    subtitleAr:
      'المنظفات والمطهرات الصناعية، مصممة وفقاً لمعايير الآيزو - من التركيبة إلى خط الإنتاج.',
    image: '/images/showcase/hero_scientist_clean.png',
    primaryBtnText: 'Explore Our Products',
    primaryBtnTextAr: 'استكشف منتجاتنا',
    primaryBtnLink: 'products',
    secondaryBtnText: 'Request a Quote',
    secondaryBtnTextAr: 'طلب عرض سعر',
    secondaryBtnLink: 'quote',
  },
  {
    id: 'slide-2',
    badge: 'Healthcare & Hospital Bio-Security',
    badgeAr: 'الأمان الحيوي للمستشفيات والمنشآت الصحية',
    title: 'Medical-Grade Disinfection.\nMaximum Bio-Security.',
    titleAr: 'تطهير طبي معتمد.\nأعلى درجات الأمان الحيوي.',
    subtitle:
      'Certified quaternary and hospital disinfectants trusted by top healthcare facilities and institutions across Egypt.',
    subtitleAr:
      'مطهرات كواترناري ومحاليل تعقيم طبية معتمدة تثق بها كبرى المستشفيات والمنشآت الصحية في مصر.',
    image: '/images/categories/hospital.jpg',
    primaryBtnText: 'Institutional Solutions',
    primaryBtnTextAr: 'الحلول المؤسسية',
    primaryBtnLink: 'institutional',
    secondaryBtnText: 'Request Quotation',
    secondaryBtnTextAr: 'طلب تسعير جملة',
    secondaryBtnLink: 'quote',
  },
  {
    id: 'slide-3',
    badge: 'Heavy Industry & Fleet Operations',
    badgeAr: 'الصناعات الثقيلة وأساطيل النقل',
    title: 'Heavy-Duty Chemical Power.\nUncompromising Performance.',
    titleAr: 'قوة كيميائية فائقة للصناعات الشاقة.\nأداء بلا مساومة.',
    subtitle:
      'Specialized engine degreasers, high-foam snow car shampoos, and industrial scale removers for heavy operations.',
    subtitleAr:
      'مزيلات شحوم المحركات، شامبوهات رغوية فائقة للسيارات، ومذيبات ترسبات صناعية للمصانع والورش الكبرى.',
    image: '/images/categories/car-care.jpg',
    primaryBtnText: 'Explore Heavy Formulations',
    primaryBtnTextAr: 'استكشف المنظفات الشاقة',
    primaryBtnLink: 'products',
    secondaryBtnText: 'Custom Formulation',
    secondaryBtnTextAr: 'طلب عينة خاصة',
    secondaryBtnLink: 'quote',
  },
  {
    id: 'slide-4',
    badge: 'Turnkey Contract Manufacturing',
    badgeAr: 'تصنيع كيميائي وتعبئة لحساب الغير',
    title: 'Your Brand, Powered by\nEssamco Chemical Engineering.',
    titleAr: 'علامتك التجارية بقوة\nالهندسة الكيميائية من عصامكو.',
    subtitle:
      'Turnkey private-label manufacturing, custom formulation, ISO-certified bottling, and regulatory licensing support.',
    subtitleAr:
      'تصنيع شامل لحساب الغير، تركيبات كيميائية مخصصة، تعبئة بمعايير الآيزو ودعم كامل للتراخيص والمطابقة.',
    image: '/images/showcase/branding_manufacturing.png',
    primaryBtnText: 'Private Label Services',
    primaryBtnTextAr: 'خدمات التصنيع للغير',
    primaryBtnLink: 'private-label',
    secondaryBtnText: 'Partner With Us',
    secondaryBtnTextAr: 'شراكة التصنيع',
    secondaryBtnLink: 'quote',
  },
];

export const ShowcaseHero: React.FC<ShowcaseHeroProps> = ({
  content,
  slides,
  onOpenQuote,
  onExploreProducts,
}) => {
  const { language } = useLanguage();
  const router = useRouter();
  const isAr = language === 'ar';

  // Compute active slides list
  const slidesList: HeroSlide[] =
    slides && slides.length > 0
      ? slides
      : content
      ? [
          {
            id: 'slide-main',
            title: content.title || defaultSlides[0].title,
            titleAr: content.titleAr || defaultSlides[0].titleAr,
            subtitle: content.subtitle || defaultSlides[0].subtitle,
            subtitleAr: content.subtitleAr || defaultSlides[0].subtitleAr,
            image: content.image || defaultSlides[0].image,
            primaryBtnText: content.primaryBtnText || defaultSlides[0].primaryBtnText,
            primaryBtnTextAr: content.primaryBtnTextAr || defaultSlides[0].primaryBtnTextAr,
            primaryBtnLink: 'products',
            secondaryBtnText: content.secondaryBtnText || defaultSlides[0].secondaryBtnText,
            secondaryBtnTextAr: content.secondaryBtnTextAr || defaultSlides[0].secondaryBtnTextAr,
            secondaryBtnLink: 'quote',
          },
          ...defaultSlides.slice(1),
        ]
      : defaultSlides;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance slides every 10 seconds (10,000 ms) as explicitly requested
  useEffect(() => {
    if (slidesList.length <= 1) return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, 10000);

    return () => clearInterval(timer);
  }, [currentSlide, slidesList.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentSlide) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 450);
    },
    [currentSlide]
  );

  const handleNextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slidesList.length);
    setTimeout(() => setIsTransitioning(false), 450);
  }, [slidesList.length]);

  const handlePrevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slidesList.length) % slidesList.length);
    setTimeout(() => setIsTransitioning(false), 450);
  }, [slidesList.length]);

  const activeSlide = slidesList[currentSlide] || slidesList[0];

  const title = isAr
    ? activeSlide.titleAr || activeSlide.title
    : activeSlide.title || activeSlide.titleAr;

  const subtitle = isAr
    ? activeSlide.subtitleAr || activeSlide.subtitle
    : activeSlide.subtitle || activeSlide.subtitleAr;

  const badgeText = isAr ? activeSlide.badgeAr || activeSlide.badge : activeSlide.badge;

  const primaryBtn = isAr
    ? activeSlide.primaryBtnTextAr || 'استكشف منتجاتنا'
    : activeSlide.primaryBtnText || 'Explore Our Products';

  const secondaryBtn = isAr
    ? activeSlide.secondaryBtnTextAr || 'طلب عرض سعر'
    : activeSlide.secondaryBtnText || 'Request a Quote';

  const heroImage = activeSlide.image || '/images/showcase/hero_scientist_clean.png';
  const titleLines = (title || '').split('\n');

  const handlePrimaryClick = () => {
    if (activeSlide.primaryBtnLink === 'institutional') {
      router.push(`/${language}/institutional`);
    } else if (activeSlide.primaryBtnLink === 'private-label') {
      router.push(`/${language}/private-label`);
    } else if (activeSlide.primaryBtnLink === 'products') {
      router.push(`/${language}/products`);
    } else {
      onExploreProducts();
    }
  };

  const handleSecondaryClick = () => {
    if (activeSlide.secondaryBtnLink === 'quote' || !activeSlide.secondaryBtnLink) {
      onOpenQuote();
    } else {
      router.push(`/${language}/${activeSlide.secondaryBtnLink}`);
    }
  };

  return (
    <section id="hero" className="pt-4 sm:pt-6 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Main Hero Card Container with Scale Animation */}
      <ScrollReveal type="scale" delay={50}>
        <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] bg-[#EEF3F7] border border-[#E2EAF0] shadow-sm">
          
          {/* DESKTOP & TABLET LAYOUT */}
          <div className="hidden sm:grid sm:grid-cols-12 items-center min-h-[460px] relative">
            {/* Content Column */}
            <div
              className={`sm:col-span-7 p-8 sm:p-12 lg:p-14 z-10 text-start transition-all duration-500 ${
                isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {badgeText && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#1E2D4A] border border-blue-200/60 text-xs font-bold mb-4 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{badgeText}</span>
                </div>
              )}

              <h1 className="text-3xl lg:text-[42px] font-black text-[#0F172A] leading-[1.18] tracking-tight">
                {titleLines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              <p className="mt-5 text-sm lg:text-[15px] text-[#475569] leading-relaxed max-w-lg font-normal">
                {subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex items-center gap-4">
                <button
                  type="button"
                  onClick={handlePrimaryClick}
                  className="bg-[#1E2D4A] hover:bg-[#152035] text-white px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm active:scale-98 cursor-pointer"
                >
                  {primaryBtn}
                </button>

                <button
                  type="button"
                  onClick={handleSecondaryClick}
                  className="border border-[#1E2D4A] text-[#1E2D4A] bg-white/70 hover:bg-white px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 active:scale-98 cursor-pointer"
                >
                  {secondaryBtn}
                </button>
              </div>
            </div>

            {/* Hero Image Column */}
            <div className="sm:col-span-5 h-full relative min-h-[460px] flex items-end justify-center overflow-hidden">
              <div
                key={`img-${currentSlide}`}
                className={`relative w-full h-full min-h-[460px] transition-all duration-700 ${
                  isTransitioning ? 'opacity-40 scale-102' : 'opacity-100 scale-100'
                }`}
              >
                <Image
                  src={heroImage}
                  alt={title || 'Essamco Laboratory Quality Testing'}
                  fill
                  sizes="(max-width: 1024px) 50vw, 40vw"
                  className="object-cover object-center lg:object-right"
                  priority
                />
              </div>
            </div>
          </div>

          {/* MOBILE LAYOUT */}
          <div className="sm:hidden flex flex-col relative">
            {/* Top Photo */}
            <div className="relative w-full h-[240px] overflow-hidden">
              <Image
                key={`mob-img-${currentSlide}`}
                src={heroImage}
                alt={title || 'Essamco Laboratory Quality Testing'}
                fill
                sizes="100vw"
                className={`object-cover object-top transition-opacity duration-500 ${
                  isTransitioning ? 'opacity-60' : 'opacity-100'
                }`}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#EEF3F7]" />
            </div>

            {/* Mobile Content below photo */}
            <div
              className={`px-5 pt-3 pb-6 text-center flex flex-col items-center transition-all duration-500 ${
                isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {badgeText && (
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100/90 text-[#1E2D4A] text-[11px] font-bold mb-2.5">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>{badgeText}</span>
                </div>
              )}

              <h1 className="text-[22px] font-black text-[#0F172A] leading-[1.25] tracking-tight text-center">
                {titleLines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              <p className="mt-3 text-xs text-[#475569] leading-relaxed font-normal text-center max-w-sm mx-auto">
                {subtitle}
              </p>

              <div className="mt-5 flex flex-col gap-2.5 w-full items-center">
                <button
                  type="button"
                  onClick={handlePrimaryClick}
                  className="w-full bg-[#1E2D4A] hover:bg-[#152035] text-white py-3 rounded-full text-xs font-bold text-center transition-colors shadow-xs cursor-pointer"
                >
                  {primaryBtn}
                </button>

                <button
                  type="button"
                  onClick={handleSecondaryClick}
                  className="w-full border border-[#1E2D4A] text-[#1E2D4A] bg-white/70 hover:bg-white py-3 rounded-full text-xs font-bold text-center transition-colors cursor-pointer"
                >
                  {secondaryBtn}
                </button>
              </div>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* Carousel Navigation Controls Below Card */}
      <ScrollReveal type="up" delay={150}>
        <div className="mt-5 flex items-center justify-center gap-3">
          {/* Prev Arrow */}
          <button
            type="button"
            onClick={isAr ? handleNextSlide : handlePrevSlide}
            aria-label="Previous Slide"
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {slidesList.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === currentSlide
                    ? 'w-7 h-2 bg-[#1E2D4A]'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={isAr ? handlePrevSlide : handleNextSlide}
            aria-label="Next Slide"
            className="w-8 h-8 rounded-full bg-[#1E2D4A] hover:bg-[#152035] flex items-center justify-center text-white transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
};
