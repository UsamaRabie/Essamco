'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';
import { BrandItem } from '../../../types';
import { uploadImageToCloudinary } from '../../../lib/api';

interface BrandModalProps {
  isOpen: boolean;
  form: BrandItem;
  setForm: React.Dispatch<React.SetStateAction<BrandItem>>;
  onClose: () => void;
  onSave: () => void;
  token: string | null;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function BrandModal({
  isOpen,
  form,
  setForm,
  onClose,
  onSave,
  token,
  showToast,
}: BrandModalProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  if (!isOpen) return null;

  return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase">إضافة علامة تجارية جديدة</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم العلامة التجارية (العربية)</label>
            <input
              type="text"
              dir="rtl"
              value={form.nameAr || ''}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
              placeholder="مثال: باور"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم العلامة التجارية (English)</label>
            <input
              type="text"
              dir="ltr"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Bauer"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">صورة شعار العلامة التجارية</label>
            {form.image && (
              <div className="relative h-16 w-full rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 mb-2">
                <Image
                  src={form.image}
                  alt="Brand Preview"
                  width={120}
                  height={40}
                  className="object-contain max-h-12 w-auto"
                />
              </div>
            )}

            <label className="block cursor-pointer">
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
                    setForm((prev) => ({ ...prev, image: res.url! }));
                    showToast('تم رفع شعار الماركة إلى Cloudinary');
                  } else {
                    showToast(res.message || 'فشل رفع الشعار', 'error');
                  }
                }}
                className="hidden"
              />
              <div className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors">
                {uploadingImage ? (
                  <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>رفع الشعار إلى Cloudinary</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
            className="px-5 py-2 text-xs font-bold text-white bg-[#1E2D4A] hover:bg-[#152035] rounded-xl cursor-pointer"
          >
            إضافة العلامة التجارية
          </button>
        </div>
      </div>
    </div>
  );
}
