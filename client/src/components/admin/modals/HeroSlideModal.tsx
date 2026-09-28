'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';
import { HeroSlide } from '../../../types';
import { uploadImageToCloudinary } from '../../../lib/api';

interface HeroSlideModalProps {
  isOpen: boolean;
  slideIndex: number | null;
  form: HeroSlide;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  onSave: () => void;
  token: string | null;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function HeroSlideModal({
  isOpen,
  slideIndex,
  form,
  setForm,
  onClose,
  onSave,
  token,
  showToast,
}: HeroSlideModalProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  if (!isOpen) return null;

  return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase">
              {slideIndex !== null ? 'تعديل شريحة الهيرو' : 'إضافة شريحة جديدة لسلايدر الهيرو'}
            </h3>
            <p className="text-[11px] text-slate-500">
              سلايدر الهيرو يتغير كل 10 ثوانٍ تلقائياً مع إمكانية التقليب اليدوي بالأسهم
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
              <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الشريحة (العربية) *</label>
              <input
                type="text"
                dir="rtl"
                value={form.titleAr || ''}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                placeholder="مثال: حلول كيميائية صناعية متقدمة"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Slide Title (English) *</label>
              <input
                type="text"
                dir="ltr"
                value={form.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Advanced Chemical Solutions"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Subtitles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الوصف الفرعي (العربية)</label>
              <textarea
                rows={2}
                dir="rtl"
                value={form.subtitleAr || ''}
                onChange={(e) => setForm({ ...form, subtitleAr: e.target.value })}
                placeholder="وصف أو شعار الشريحة..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle (English)</label>
              <textarea
                rows={2}
                dir="ltr"
                value={form.subtitle || ''}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Description or slogan..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الشارة الترويجية (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={form.badgeAr || ''}
                onChange={(e) => setForm({ ...form, badgeAr: e.target.value })}
                placeholder="مثال: ريادة التصنيع الكيميائي"
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
                placeholder="e.g. Industrial Excellence"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Slide Image */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-700">صورة الشريحة (Slide Image)</label>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-36 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                <Image
                  src={form.image || '/images/showcase/hero_scientist_clean.png'}
                  alt="Slide Preview"
                  fill
                  className="object-cover"
                />
                {uploadingImage && (
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
                      setUploadingImage(true);
                      const res = await uploadImageToCloudinary(file, token);
                      setUploadingImage(false);
                      if (res.success && res.url) {
                        setForm((prev: any) => ({ ...prev, image: res.url! }));
                        showToast('تم رفع صورة الشريحة بنجاح');
                      } else {
                        showToast(res.message || 'فشل رفع الصورة', 'error');
                      }
                    }}
                    className="hidden"
                  />
                  <div className="py-1 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>رفع صورة للشريحة إلى Cloudinary</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Primary Button */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="col-span-full text-xs font-bold text-slate-800">الزر الرئيسي (Primary Button)</div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">نص الزر (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={form.primaryBtnTextAr || ''}
                onChange={(e) => setForm({ ...form, primaryBtnTextAr: e.target.value })}
                className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Button Text (EN)</label>
              <input
                type="text"
                dir="ltr"
                value={form.primaryBtnText || ''}
                onChange={(e) => setForm({ ...form, primaryBtnText: e.target.value })}
                className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">الرابط / الوجهة</label>
              <input
                type="text"
                dir="ltr"
                value={form.primaryBtnLink || ''}
                onChange={(e) => setForm({ ...form, primaryBtnLink: e.target.value })}
                placeholder="products, institutional..."
                className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Secondary Button */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="col-span-full text-xs font-bold text-slate-800">الزر الثانوي (Secondary Button)</div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">نص الزر (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={form.secondaryBtnTextAr || ''}
                onChange={(e) => setForm({ ...form, secondaryBtnTextAr: e.target.value })}
                className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Button Text (EN)</label>
              <input
                type="text"
                dir="ltr"
                value={form.secondaryBtnText || ''}
                onChange={(e) => setForm({ ...form, secondaryBtnText: e.target.value })}
                className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">الرابط / الوجهة</label>
              <input
                type="text"
                dir="ltr"
                value={form.secondaryBtnLink || ''}
                onChange={(e) => setForm({ ...form, secondaryBtnLink: e.target.value })}
                placeholder="quote, contact..."
                className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg font-mono"
              />
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
            {slideIndex !== null ? 'حفظ تعديلات الشريحة' : 'إضافة الشريحة للسلايدر'}
          </button>
        </div>
      </div>
    </div>
  );
}
