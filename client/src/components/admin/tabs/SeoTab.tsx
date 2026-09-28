'use client';

import React from 'react';
import Image from 'next/image';
import { Globe, Save, Upload } from 'lucide-react';
import { SiteContent, SiteSeo } from '../../../types';

interface SeoTabProps {
  siteContentData: SiteContent;
  setSiteContentData: React.Dispatch<React.SetStateAction<SiteContent | null>>;
  onResetSeoDefaults: () => void;
  onSaveContent: () => void;
  savingContent: boolean;
  onSeoImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingItem: string | null;
}

export default function SeoTab({
  siteContentData,
  setSiteContentData,
  onResetSeoDefaults,
  onSaveContent,
  savingContent,
  onSeoImageUpload,
  uploadingItem,
}: SeoTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>تحسين محركات البحث (SEO) والبيانات الوصفية</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            إعدادات ظهور الموقع في جوجل، العناوين الوصفية، ومعاينة بطاقات التواصل الاجتماعي.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetSeoDefaults}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            استعادة الافتراضيات
          </button>

          <button
            type="button"
            onClick={onSaveContent}
            disabled={savingContent}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#1E2D4A] hover:bg-[#152035] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ إعدادات السيو</span>
          </button>
        </div>
      </div>

      {/* Google Search Result Simulator */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          محاكاة شكل ظهور الموقع في نتائج بحث جوجل (Google Search Preview)
        </span>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-2xl font-sans text-right" dir="rtl">
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
            <div className="w-4 h-4 rounded-full bg-slate-300 flex items-center justify-center text-[9px] font-bold">
              E
            </div>
            <span className="text-[11px] text-slate-700 font-mono" dir="ltr">
              {siteContentData.seo?.canonicalUrl || 'https://essamco.com'}
            </span>
          </div>
          <h4 className="text-base font-medium text-blue-800 hover:underline cursor-pointer leading-snug">
            {siteContentData.seo?.metaTitleAr ||
              siteContentData.seo?.metaTitle ||
              'عصامكو | مصنع الكيماويات والمطهرات الصناعية والتوريدات المؤسسية'}
          </h4>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {siteContentData.seo?.metaDescriptionAr ||
              siteContentData.seo?.metaDescription ||
              'شركة عصامكو لصناعة المنظفات الصناعية، المطهرات والمعقمات، وحلول النظافة المؤسسية، والتصنيع لحساب الغير منذ 1997.'}
          </p>
        </div>
      </div>

      {/* SEO Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Titles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الموقع لمحركات البحث (العربية)</label>
            <input
              type="text"
              dir="rtl"
              value={siteContentData.seo?.metaTitleAr || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  seo: {
                    ...(siteContentData.seo as SiteSeo),
                    metaTitleAr: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الموقع لمحركات البحث (English)</label>
            <input
              type="text"
              dir="ltr"
              value={siteContentData.seo?.metaTitle || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  seo: {
                    ...(siteContentData.seo as SiteSeo),
                    metaTitle: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">وصف الموقع لمحركات البحث (العربية)</label>
            <textarea
              rows={3}
              dir="rtl"
              value={siteContentData.seo?.metaDescriptionAr || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  seo: {
                    ...(siteContentData.seo as SiteSeo),
                    metaDescriptionAr: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">وصف الموقع لمحركات البحث (English)</label>
            <textarea
              rows={3}
              dir="ltr"
              value={siteContentData.seo?.metaDescription || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  seo: {
                    ...(siteContentData.seo as SiteSeo),
                    metaDescription: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
            />
          </div>
        </div>

        {/* Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الكلمات المفتاحية (العربية - مفصولة بفواصل)</label>
            <input
              type="text"
              dir="rtl"
              value={siteContentData.seo?.keywordsAr || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  seo: {
                    ...(siteContentData.seo as SiteSeo),
                    keywordsAr: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الكلمات المفتاحية (English - comma separated)</label>
            <input
              type="text"
              dir="ltr"
              value={siteContentData.seo?.keywords || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  seo: {
                    ...(siteContentData.seo as SiteSeo),
                    keywords: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {/* Canonical & OG Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الرابط الأساسي المعتمد (Canonical URL)</label>
            <input
              type="url"
              dir="ltr"
              value={siteContentData.seo?.canonicalUrl || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  seo: {
                    ...(siteContentData.seo as SiteSeo),
                    canonicalUrl: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />

            {/* Indexing Checkboxes */}
            <div className="mt-4 space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-700 block">توجيهات الفهرسة وعناكب البحث (Robots Directives)</span>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={siteContentData.seo?.robotsIndex !== false}
                  onChange={(e) =>
                    setSiteContentData({
                      ...siteContentData,
                      seo: {
                        ...(siteContentData.seo as SiteSeo),
                        robotsIndex: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span>السماح لمحركات البحث بفهرسة الموقع في نتائج البحث (index)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={siteContentData.seo?.robotsFollow !== false}
                  onChange={(e) =>
                    setSiteContentData({
                      ...siteContentData,
                      seo: {
                        ...(siteContentData.seo as SiteSeo),
                        robotsFollow: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span>السماح لمحركات البحث بتتبع الروابط الداخلية والخارجية (follow)</span>
              </label>
            </div>
          </div>

          {/* Social Share Image */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">صورة بطاقة المشاركة على منصات التواصل (OpenGraph - 1200x630)</span>
            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={siteContentData.seo?.ogImage || '/images/showcase/hero_scientist_clean.png'}
                alt="OG Image Preview"
                fill
                className="object-cover"
              />
              {uploadingItem === 'seo-og' && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                  جاري الرفع إلى Cloudinary...
                </div>
              )}
            </div>

            <label className="block cursor-pointer pt-1">
              <input
                type="file"
                accept="image/*"
                onChange={onSeoImageUpload}
                className="hidden"
              />
              <div className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>رفع صورة المشاركة الاجتماعية</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
