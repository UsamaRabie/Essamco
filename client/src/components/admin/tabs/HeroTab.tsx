'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Sliders, Trash2, Upload } from 'lucide-react';
import { SiteContent, HeroSlide } from '../../../types';

interface HeroTabProps {
  siteContentData: SiteContent;
  setSiteContentData: React.Dispatch<React.SetStateAction<SiteContent | null>>;
  onOpenAddHeroSlide: () => void;
  onOpenEditHeroSlide: (index: number) => void;
  onDeleteHeroSlide: (index: number) => void;
  uploadingHero: boolean;
  onHeroImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetHeroImage: () => void;
}

export default function HeroTab({
  siteContentData,
  setSiteContentData,
  onOpenAddHeroSlide,
  onOpenEditHeroSlide,
  onDeleteHeroSlide,
  uploadingHero,
  onHeroImageUpload,
  onResetHeroImage,
}: HeroTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. HERO MULTI-SLIDER (10S AUTOPLAY) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                10s Autoplay
              </span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                شرائح سلايدر الهيرو الرئيسي (Multi-Slider)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              الشرائح الديناميكية المعروضة في الهيرو التي تتغير كل 10 ثوانٍ تلقائياً مع أزرار التقليب اليدوية.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAddHeroSlide}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة شريحة جديدة للسلايدر</span>
          </button>
        </div>

        {/* Slides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(siteContentData.heroSlides || []).map((slide, idx) => (
            <div
              key={slide.id || idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3 relative group hover:border-blue-300 transition-colors"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-blue-700">شريحة #{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onOpenEditHeroSlide(idx)}
                      className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-100/60 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="تعديل الشريحة"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteHeroSlide(idx)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="حذف الشريحة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-200 mb-2">
                  <Image
                    src={slide.image || '/images/showcase/hero_scientist_clean.png'}
                    alt={slide.title || 'Slide'}
                    fill
                    className="object-cover"
                  />
                  {slide.badge && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#1E2D4A]/80 text-white backdrop-blur-xs">
                      {slide.badge}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {slide.title || 'Untitled Slide'}
                  </h4>
                  {slide.titleAr && (
                    <h4 dir="rtl" className="text-xs font-bold text-slate-700 line-clamp-1 font-arabic">
                      {slide.titleAr}
                    </h4>
                  )}
                  <p className="text-[11px] text-slate-500 line-clamp-2">{slide.subtitle}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 flex justify-between items-center">
                <span className="font-mono truncate max-w-[120px]">{slide.primaryBtnLink || 'products'}</span>
                <span className="font-mono truncate max-w-[120px]">{slide.secondaryBtnLink || 'quote'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. HERO SCIENTIST & BANNER STATIC SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              القسم الترحيبي الثابت (الهيرو وكيميائي المختبر)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              صورة كيميائي المختبر، العناوين الترويجية، وأزرار اتخاذ القرار.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Hero Image */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">صورة كيميائي المختبر</span>
            <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={siteContentData.hero.image || '/images/showcase/hero_scientist_clean.png'}
                alt="Hero Preview"
                fill
                className="object-cover object-center"
              />
              {uploadingHero && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 text-white">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold">جاري رفع الصورة...</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onHeroImageUpload}
                  disabled={uploadingHero}
                  className="hidden"
                />
                <div className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع صورة جديدة</span>
                </div>
              </label>

              <button
                type="button"
                onClick={onResetHeroImage}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                title="استعادة الصورة الأصلية"
              >
                استعادة
              </button>
            </div>
          </div>

          {/* Hero Texts */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">العنوان الرئيسي (العربية)</label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={siteContentData.hero.titleAr}
                  onChange={(e) =>
                    setSiteContentData({
                      ...siteContentData,
                      hero: { ...siteContentData.hero, titleAr: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">العنوان الرئيسي (English)</label>
                <textarea
                  rows={2}
                  dir="ltr"
                  value={siteContentData.hero.title}
                  onChange={(e) =>
                    setSiteContentData({
                      ...siteContentData,
                      hero: { ...siteContentData.hero, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الوصف الفرعي (العربية)</label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={siteContentData.hero.subtitleAr}
                  onChange={(e) =>
                    setSiteContentData({
                      ...siteContentData,
                      hero: { ...siteContentData.hero, subtitleAr: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الوصف الفرعي (English)</label>
                <textarea
                  rows={2}
                  dir="ltr"
                  value={siteContentData.hero.subtitle}
                  onChange={(e) =>
                    setSiteContentData({
                      ...siteContentData,
                      hero: { ...siteContentData.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">زر استعراض المنتجات (عربي / إنجليزي)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    dir="rtl"
                    value={siteContentData.hero.primaryBtnTextAr}
                    onChange={(e) =>
                      setSiteContentData({
                        ...siteContentData,
                        hero: { ...siteContentData.hero, primaryBtnTextAr: e.target.value },
                      })
                    }
                    placeholder="النص بالعربي"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={siteContentData.hero.primaryBtnText}
                    onChange={(e) =>
                      setSiteContentData({
                        ...siteContentData,
                        hero: { ...siteContentData.hero, primaryBtnText: e.target.value },
                      })
                    }
                    placeholder="EN Text"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">زر طلب عرض السعر (عربي / إنجليزي)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    dir="rtl"
                    value={siteContentData.hero.secondaryBtnTextAr}
                    onChange={(e) =>
                      setSiteContentData({
                        ...siteContentData,
                        hero: { ...siteContentData.hero, secondaryBtnTextAr: e.target.value },
                      })
                    }
                    placeholder="النص بالعربي"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={siteContentData.hero.secondaryBtnText}
                    onChange={(e) =>
                      setSiteContentData({
                        ...siteContentData,
                        hero: { ...siteContentData.hero, secondaryBtnText: e.target.value },
                      })
                    }
                    placeholder="EN Text"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
