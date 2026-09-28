'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Trash2, Upload, MessageSquare, Save } from 'lucide-react';
import { SiteContent } from '../../../types';

interface SiteContentTabProps {
  siteContentData: SiteContent;
  setSiteContentData: React.Dispatch<React.SetStateAction<SiteContent | null>>;
  onOpenMetricModal: () => void;
  onDeleteMetric: (index: number) => void;
  onOpenPointModal: () => void;
  onDeletePoint: (index: number) => void;
  onWhyUsImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetWhyUsImage: () => void;
  onOpenBrandModal: () => void;
  onDeleteBrand: (index: number) => void;
  onBrandImageUpload: (index: number, file: File) => void;
  uploadingItem: string | null;
  onSaveContent: () => void;
  savingContent: boolean;
}

export default function SiteContentTab({
  siteContentData,
  setSiteContentData,
  onOpenMetricModal,
  onDeleteMetric,
  onOpenPointModal,
  onDeletePoint,
  onWhyUsImageUpload,
  onResetWhyUsImage,
  onOpenBrandModal,
  onDeleteBrand,
  onBrandImageUpload,
  uploadingItem,
  onSaveContent,
  savingContent,
}: SiteContentTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. STATS & METRICS (CRUD) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              المؤشرات الرقمية والإحصائيات (Stats & Metrics)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              إضافة أو تعديل الإحصائيات والأرقام المعروضة في شريط الأرقام القياسية بالموقع.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenMetricModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة مؤشر رقمي</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {(siteContentData.stats?.metrics || []).map((metric, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative group">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-500">المؤشر #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => onDeleteMetric(idx)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                  title="حذف المؤشر"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block">القيمة (مثال: +25، 1997)</label>
                <input
                  type="text"
                  value={metric.value}
                  onChange={(e) => {
                    const updated = [...(siteContentData.stats.metrics || [])];
                    updated[idx] = { ...updated[idx], value: e.target.value };
                    setSiteContentData({
                      ...siteContentData,
                      stats: { ...siteContentData.stats, metrics: updated },
                    });
                  }}
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-black"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block">التسمية (العربية)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={metric.labelAr || ''}
                  onChange={(e) => {
                    const updated = [...(siteContentData.stats.metrics || [])];
                    updated[idx] = { ...updated[idx], labelAr: e.target.value };
                    setSiteContentData({
                      ...siteContentData,
                      stats: { ...siteContentData.stats, metrics: updated },
                    });
                  }}
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block">Label (English)</label>
                <input
                  type="text"
                  dir="ltr"
                  value={metric.label}
                  onChange={(e) => {
                    const updated = [...(siteContentData.stats.metrics || [])];
                    updated[idx] = { ...updated[idx], label: e.target.value };
                    setSiteContentData({
                      ...siteContentData,
                      stats: { ...siteContentData.stats, metrics: updated },
                    });
                  }}
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. WHY CHOOSE US (CRUD) */}
      {siteContentData.whyChooseUs && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                لماذا تختار عصامكو؟ (مميزاتنا ومعايير الجودة)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                صورة المختبر ومزايا الجودة والاعتمادات القياسية والخبرة الصناعية.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenPointModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة ميزة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Photo Upload */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">صورة كيميائي المختبر</span>
              <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  src={siteContentData.whyChooseUs.image || '/images/showcase/why_us_scientist_hd.png'}
                  alt="Why Choose Us Preview"
                  fill
                  className="object-cover object-center"
                />
                {uploadingItem === 'why-us' && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 text-white">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold">جاري الرفع إلى Cloudinary...</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onWhyUsImageUpload}
                    className="hidden"
                  />
                  <div className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>رفع صورة المختبر</span>
                  </div>
                </label>

                <button
                  type="button"
                  onClick={onResetWhyUsImage}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                  title="استعادة الصورة الأصلية"
                >
                  استعادة
                </button>
              </div>
            </div>

            {/* Feature Points CRUD list */}
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-3">
                {siteContentData.whyChooseUs.points?.map((pt, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-700">ميزة #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => onDeletePoint(idx)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="حذف الميزة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        dir="rtl"
                        value={pt.titleAr}
                        placeholder="العنوان (عربي)"
                        onChange={(e) => {
                          const updated = [...siteContentData.whyChooseUs.points];
                          updated[idx] = { ...updated[idx], titleAr: e.target.value };
                          setSiteContentData({
                            ...siteContentData,
                            whyChooseUs: { ...siteContentData.whyChooseUs, points: updated },
                          });
                        }}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-semibold"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        value={pt.title}
                        placeholder="العنوان (English)"
                        onChange={(e) => {
                          const updated = [...siteContentData.whyChooseUs.points];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setSiteContentData({
                            ...siteContentData,
                            whyChooseUs: { ...siteContentData.whyChooseUs, points: updated },
                          });
                        }}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <textarea
                        rows={2}
                        dir="rtl"
                        value={pt.descAr}
                        placeholder="الوصف (عربي)"
                        onChange={(e) => {
                          const updated = [...siteContentData.whyChooseUs.points];
                          updated[idx] = { ...updated[idx], descAr: e.target.value };
                          setSiteContentData({
                            ...siteContentData,
                            whyChooseUs: { ...siteContentData.whyChooseUs, points: updated },
                          });
                        }}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                      <textarea
                        rows={2}
                        dir="ltr"
                        value={pt.desc}
                        placeholder="الوصف (English)"
                        onChange={(e) => {
                          const updated = [...siteContentData.whyChooseUs.points];
                          updated[idx] = { ...updated[idx], desc: e.target.value };
                          setSiteContentData({
                            ...siteContentData,
                            whyChooseUs: { ...siteContentData.whyChooseUs, points: updated },
                          });
                        }}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. OUR BRANDS (CRUD) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              العلامات التجارية الشريكة (Our Brands)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              إدارة شعارات العلامات التجارية المصنعة لدى عصامكو (بريللانت، سافون، ويف، باور 3).
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBrandModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة علامة تجارية</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {(siteContentData.brands || []).map((brand, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-700">ماركة #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => onDeleteBrand(idx)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                  title="حذف العلامة التجارية"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="relative h-20 w-full rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={120}
                  height={40}
                  className="object-contain max-h-12 w-auto"
                />
                {uploadingItem === `brand-${idx}` && (
                  <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-white text-xs font-bold">
                    جاري الرفع...
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">اسم الماركة (العربية)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={brand.nameAr || ''}
                  onChange={(e) => {
                    const updated = [...(siteContentData.brands || [])];
                    updated[idx] = { ...updated[idx], nameAr: e.target.value };
                    setSiteContentData({
                      ...siteContentData,
                      brands: updated,
                    });
                  }}
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">اسم الماركة (English)</label>
                <input
                  type="text"
                  dir="ltr"
                  value={brand.name}
                  onChange={(e) => {
                    const updated = [...(siteContentData.brands || [])];
                    updated[idx] = { ...updated[idx], name: e.target.value };
                    setSiteContentData({
                      ...siteContentData,
                      brands: updated,
                    });
                  }}
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <label className="block cursor-pointer pt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onBrandImageUpload(idx, file);
                  }}
                  className="hidden"
                />
                <div className="w-full py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors">
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>رفع الشعار</span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SUPPLY PARTNERSHIP CTA BANNER */}
      {siteContentData.partnershipCta && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            بانر دعوة الشراكة والتوريد (Partnership CTA)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العنوان الرئيسي (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={siteContentData.partnershipCta.titleAr}
                onChange={(e) =>
                  setSiteContentData({
                    ...siteContentData,
                    partnershipCta: { ...siteContentData.partnershipCta, titleAr: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العنوان الرئيسي (English)</label>
              <input
                type="text"
                dir="ltr"
                value={siteContentData.partnershipCta.title}
                onChange={(e) =>
                  setSiteContentData({
                    ...siteContentData,
                    partnershipCta: { ...siteContentData.partnershipCta, title: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العنوان الفرعي (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={siteContentData.partnershipCta.subtitleAr}
                onChange={(e) =>
                  setSiteContentData({
                    ...siteContentData,
                    partnershipCta: { ...siteContentData.partnershipCta, subtitleAr: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العنوان الفرعي (English)</label>
              <input
                type="text"
                dir="ltr"
                value={siteContentData.partnershipCta.subtitle}
                onChange={(e) =>
                  setSiteContentData({
                    ...siteContentData,
                    partnershipCta: { ...siteContentData.partnershipCta, subtitle: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. FOOTER SETTINGS */}
      {siteContentData.footerSettings && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            إعدادات الفوتر ونصوص التذييل
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">شعار الشركة في الفوتر (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={siteContentData.footerSettings.taglineAr}
                onChange={(e) =>
                  setSiteContentData({
                    ...siteContentData,
                    footerSettings: { ...siteContentData.footerSettings, taglineAr: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">شعار الشركة في الفوتر (English)</label>
              <input
                type="text"
                dir="ltr"
                value={siteContentData.footerSettings.tagline}
                onChange={(e) =>
                  setSiteContentData({
                    ...siteContentData,
                    footerSettings: { ...siteContentData.footerSettings, tagline: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">حقوق الملكية (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={siteContentData.footerSettings.copyrightAr}
                onChange={(e) =>
                  setSiteContentData({
                    ...siteContentData,
                    footerSettings: { ...siteContentData.footerSettings, copyrightAr: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">حقوق الملكية (English)</label>
              <input
                type="text"
                dir="ltr"
                value={siteContentData.footerSettings.copyright}
                onChange={(e) =>
                  setSiteContentData({
                    ...siteContentData,
                    footerSettings: { ...siteContentData.footerSettings, copyright: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. SOCIAL MEDIA & WHATSAPP LINKS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>روابط التواصل الاجتماعي وواتساب</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              المنصة التي تكتب لها رابطاً ستظهر أيقونتها في الفوتر وموقعك، والتي تتركها فارغة ستختفي تلقائياً.
            </p>
          </div>

          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            ظهور تلقائي عند الإدخال
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* WhatsApp */}
          <div className="sm:col-span-2 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>رقم أو رابط واتساب المباشر (WhatsApp)</span>
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                {siteContentData.socialLinks?.whatsapp?.trim() ? '✓ مفعّل' : 'مخفي'}
              </span>
            </div>
            <input
              type="text"
              dir="ltr"
              value={siteContentData.socialLinks?.whatsapp || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  socialLinks: {
                    ...siteContentData.socialLinks,
                    whatsapp: e.target.value,
                  },
                })
              }
              placeholder="e.g. +201012345678 or https://wa.me/201012345678"
              className="w-full px-3 py-2 text-xs bg-white border border-emerald-300 rounded-xl focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-emerald-700 mt-1">
              يظهر في الفوتر بالإضافة لزر شات واتساب عائم في زاوية الموقع. اتركه فارغاً لإخفائه تماماً.
            </p>
          </div>

          {/* Facebook */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">رابط فيسبوك (Facebook)</label>
              <span className="text-[10px] font-bold text-slate-400">
                {siteContentData.socialLinks?.facebook?.trim() ? '✓ مفعّل' : 'مخفي'}
              </span>
            </div>
            <input
              type="url"
              dir="ltr"
              value={siteContentData.socialLinks?.facebook || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  socialLinks: {
                    ...siteContentData.socialLinks,
                    facebook: e.target.value,
                  },
                })
              }
              placeholder="https://facebook.com/essamco"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Instagram */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">رابط انستغرام (Instagram)</label>
              <span className="text-[10px] font-bold text-slate-400">
                {siteContentData.socialLinks?.instagram?.trim() ? '✓ مفعّل' : 'مخفي'}
              </span>
            </div>
            <input
              type="url"
              dir="ltr"
              value={siteContentData.socialLinks?.instagram || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  socialLinks: {
                    ...siteContentData.socialLinks,
                    instagram: e.target.value,
                  },
                })
              }
              placeholder="https://instagram.com/essamco"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">رابط لينكد إن (LinkedIn)</label>
              <span className="text-[10px] font-bold text-slate-400">
                {siteContentData.socialLinks?.linkedin?.trim() ? '✓ مفعّل' : 'مخفي'}
              </span>
            </div>
            <input
              type="url"
              dir="ltr"
              value={siteContentData.socialLinks?.linkedin || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  socialLinks: {
                    ...siteContentData.socialLinks,
                    linkedin: e.target.value,
                  },
                })
              }
              placeholder="https://linkedin.com/company/essamco"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Twitter / X */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">رابط منصة إكس / تويتر (X)</label>
              <span className="text-[10px] font-bold text-slate-400">
                {siteContentData.socialLinks?.twitter?.trim() ? '✓ مفعّل' : 'مخفي'}
              </span>
            </div>
            <input
              type="url"
              dir="ltr"
              value={siteContentData.socialLinks?.twitter || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  socialLinks: {
                    ...siteContentData.socialLinks,
                    twitter: e.target.value,
                  },
                })
              }
              placeholder="https://x.com/essamco"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* YouTube */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">قناة يوتيوب (YouTube)</label>
              <span className="text-[10px] font-bold text-slate-400">
                {siteContentData.socialLinks?.youtube?.trim() ? '✓ مفعّل' : 'مخفي'}
              </span>
            </div>
            <input
              type="url"
              dir="ltr"
              value={siteContentData.socialLinks?.youtube || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  socialLinks: {
                    ...siteContentData.socialLinks,
                    youtube: e.target.value,
                  },
                })
              }
              placeholder="https://youtube.com/@channel (اختياري)"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* TikTok */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">حساب تيك توك (TikTok)</label>
              <span className="text-[10px] font-bold text-slate-400">
                {siteContentData.socialLinks?.tiktok?.trim() ? '✓ مفعّل' : 'مخفي'}
              </span>
            </div>
            <input
              type="url"
              dir="ltr"
              value={siteContentData.socialLinks?.tiktok || ''}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  socialLinks: {
                    ...siteContentData.socialLinks,
                    tiktok: e.target.value,
                  },
                })
              }
              placeholder="https://tiktok.com/@profile (اختياري)"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex justify-end p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={onSaveContent}
          disabled={savingContent}
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#1E2D4A] hover:bg-[#152035] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ ونشر التعديلات الحالية</span>
        </button>
      </div>
    </div>
  );
}
