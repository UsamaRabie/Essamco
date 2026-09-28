'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { ShowcaseCard } from '../../../types';
import { uploadImageToCloudinary } from '../../../lib/api';

interface CardCrudModalProps {
  section: 'institutional' | 'privateLabel' | 'retail' | null;
  cardIndex: number | null;
  form: ShowcaseCard;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  onSave: () => void;
  token: string | null;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function CardCrudModal({
  section,
  cardIndex,
  form,
  setForm,
  onClose,
  onSave,
  token,
  showToast,
}: CardCrudModalProps) {
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  if (!section) return null;

  const sectionNameAr =
    section === 'institutional'
      ? 'الحلول المؤسسية'
      : section === 'privateLabel'
      ? 'التصنيع لحساب الغير'
      : 'منتجات التجزئة';

  return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase">
              {cardIndex !== null ? `تعديل تفاصيل الكارت في ${sectionNameAr}` : `إضافة كارت جديد إلى ${sectionNameAr}`}
            </h3>
            <p className="text-[11px] text-slate-500">
              {cardIndex !== null ? 'تعديل المعرض، الوصف الموسع، والمواصفات للصفحة المستقلة' : 'إضافة كارت جديد وتفاصيله'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم الكارت (العربية) *</label>
              <input
                type="text"
                dir="rtl"
                value={form.titleAr || ''}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                placeholder="مثال: مطهرات ومعقمات الأسطح"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Card Title (English) *</label>
              <input
                type="text"
                dir="ltr"
                value={form.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Surface Sanitizers"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Slug & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رابط المعرف (Slug)</label>
              <input
                type="text"
                dir="ltr"
                value={form.slug || ''}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. surface-sanitizers"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl"
              />
              <span className="text-[10px] text-slate-400">اتركه فارغاً للتوليد التلقائي</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الشارة الترويجية (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={form.badgeAr || ''}
                onChange={(e) => setForm({ ...form, badgeAr: e.target.value })}
                placeholder="مثال: معتمد ومطابق للمواصفات"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Tag (EN)</label>
              <input
                type="text"
                dir="ltr"
                value={form.badge || ''}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="e.g. ISO 9001 Certified"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Short Descriptions (Card display on home) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الوصف المختصر (العربية - بطاقة الرئيسية)</label>
              <textarea
                rows={2}
                dir="rtl"
                value={form.shortDescriptionAr || ''}
                onChange={(e) => setForm({ ...form, shortDescriptionAr: e.target.value })}
                placeholder="نبذة موجزة تظهر على كارت الصفحة الرئيسية..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Description (EN - Card Preview)</label>
              <textarea
                rows={2}
                dir="ltr"
                value={form.shortDescription || ''}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                placeholder="Brief 1-2 sentence overview shown on the homepage card..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Full Detailed Descriptions (For Dedicated Detail Page) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الوصف التفصيلي الكامل (العربية - الصفحة المستقلة)</label>
              <textarea
                rows={4}
                dir="rtl"
                value={form.descriptionAr || ''}
                onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                placeholder="شرح تفصيلي موسع عن الخدمة أو المنتج، المواصفات الفنية، والقطاعات المستهدفة..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Detailed Overview (EN - Detail Page)</label>
              <textarea
                rows={4}
                dir="ltr"
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="In-depth explanation of the service, standards, production capability, industrial sectors..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Key Features (line separated) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المميزات والنقاط (العربية - نقطة في كل سطر)</label>
              <textarea
                rows={3}
                dir="rtl"
                value={(form.featuresAr || []).join('\n')}
                onChange={(e) =>
                  setForm({
                    ...form,
                    featuresAr: e.target.value.split('\n').filter((l: string) => l.trim().length > 0),
                  })
                }
                placeholder="تركيبات ذات كفاءة معتمدة&#10;تعبئة وتغليف حسب الطلب&#10;مطابق لشهادات الأيزو العالمية"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Features / Bullet Points (EN - one per line)</label>
              <textarea
                rows={3}
                dir="ltr"
                value={(form.features || []).join('\n')}
                onChange={(e) =>
                  setForm({
                    ...form,
                    features: e.target.value.split('\n').filter((l: string) => l.trim().length > 0),
                  })
                }
                placeholder="Hospital-grade formulation&#10;Custom packaging available&#10;Compliant with global standards"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Primary Main Image */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-700">الصورة الرئيسية للغلاف (Cover Image)</label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-32 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                <Image
                  src={form.image || '/images/showcase/bulk_contracts.png'}
                  alt="Card Cover"
                  fill
                  className="object-cover"
                />
                {uploadingCover && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
                    جاري الرفع...
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  dir="ltr"
                  value={form.image || ''}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Image URL or upload"
                  className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <label className="inline-block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file || !token) return;
                      setUploadingCover(true);
                      const res = await uploadImageToCloudinary(file, token);
                      setUploadingCover(false);
                      if (res.success && res.url) {
                        setForm((prev: any) => ({
                          ...prev,
                          image: res.url!,
                          images:
                            prev.images && prev.images.length > 0
                              ? [res.url!, ...prev.images.slice(1)]
                              : [res.url!],
                        }));
                        showToast('تم رفع صورة الغلاف بنجاح');
                      } else {
                        showToast(res.message || 'فشل رفع الصورة', 'error');
                      }
                    }}
                    className="hidden"
                  />
                  <div className="py-1 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>رفع صورة غلاف جديدة إلى Cloudinary</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Multi-Image Gallery */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-slate-800 block">معرض الصور المتعددة (Multi-Photo Exhibition)</span>
                <span className="text-[10px] text-slate-500">صور إضافية تظهر في معرض الصفحة المستقلة للبطاقة</span>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !token) return;
                    setUploadingGallery(true);
                    const res = await uploadImageToCloudinary(file, token);
                    setUploadingGallery(false);
                    if (res.success && res.url) {
                      setForm((prev: any) => ({
                        ...prev,
                        images: [...(prev.images || []), res.url!],
                      }));
                      showToast('تمت إضافة الصورة للمعرض');
                    } else {
                      showToast(res.message || 'فشل رفع الصورة', 'error');
                    }
                  }}
                  className="hidden"
                />
                <div className="py-1 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  <span>{uploadingGallery ? 'جاري الرفع...' : 'إضافة صورة للمعرض'}</span>
                </div>
              </label>
            </div>

            {/* Thumbnails grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
              {(form.images || []).map((imgUrl: string, gIdx: number) => (
                <div
                  key={gIdx}
                  className="relative group h-16 rounded-lg overflow-hidden border border-slate-200 bg-white"
                >
                  <Image src={imgUrl} alt={`Gallery ${gIdx}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (form.images || []).filter((_: any, i: number) => i !== gIdx);
                      setForm({ ...form, images: updated });
                    }}
                    className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    title="حذف الصورة من المعرض"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!form.images || form.images.length === 0) && (
                <div className="col-span-full py-3 text-center text-[11px] text-slate-400">
                  لا توجد صور إضافية في المعرض. اضغط على الزر أعلاه لإضافة صور.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 sticky bottom-0 bg-white z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2 text-xs font-bold text-white bg-[#1E2D4A] hover:bg-[#152035] rounded-xl cursor-pointer shadow-xs"
          >
            {cardIndex !== null ? 'حفظ التعديلات' : 'إضافة الكارت'}
          </button>
        </div>
      </div>
    </div>
  );
}
