'use client';

import React from 'react';
import { X } from 'lucide-react';
import { FeaturePoint } from '../../../types';

interface FeaturePointModalProps {
  isOpen: boolean;
  form: FeaturePoint;
  setForm: React.Dispatch<React.SetStateAction<FeaturePoint>>;
  onClose: () => void;
  onSave: () => void;
}

export default function FeaturePointModal({
  isOpen,
  form,
  setForm,
  onClose,
  onSave,
}: FeaturePointModalProps) {
  if (!isOpen) return null;

  return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase">إضافة ميزة ونقطة تميز</h3>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الميزة (العربية)</label>
            <input
              type="text"
              dir="rtl"
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              placeholder="مثال: اختبارات معملية صارمة"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الميزة (English)</label>
            <input
              type="text"
              dir="ltr"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Strict Laboratory Testing"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الوصف (العربية)</label>
            <textarea
              rows={2}
              dir="rtl"
              value={form.descAr}
              onChange={(e) => setForm({ ...form, descAr: e.target.value })}
              placeholder="مثال: تخضع كل دفعة إنتاجية لفحوصات دقيقة للتحقق من الفعالية والمطابقة."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الوصف (English)</label>
            <textarea
              rows={2}
              dir="ltr"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="e.g. Every batch undergoes comprehensive GCMS and titration verification."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              required
            />
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
            إضافة الميزة
          </button>
        </div>
      </div>
    </div>
  );
}
