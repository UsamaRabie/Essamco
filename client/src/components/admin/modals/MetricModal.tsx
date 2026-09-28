'use client';

import React from 'react';
import { X } from 'lucide-react';
import { StatMetric } from '../../../types';

interface MetricModalProps {
  isOpen: boolean;
  form: StatMetric;
  setForm: React.Dispatch<React.SetStateAction<StatMetric>>;
  onClose: () => void;
  onSave: () => void;
}

export default function MetricModal({
  isOpen,
  form,
  setForm,
  onClose,
  onSave,
}: MetricModalProps) {
  if (!isOpen) return null;

  return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase">إضافة مؤشر رقمي جديد</h3>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">القيمة الرقمية (مثال: +25، 99.9%)</label>
            <input
              type="text"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="مثال: +25"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">التسمية (العربية)</label>
            <input
              type="text"
              dir="rtl"
              value={form.labelAr}
              onChange={(e) => setForm({ ...form, labelAr: e.target.value })}
              placeholder="مثال: عاماً من الخبرة الصناعية"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Label (English)</label>
            <input
              type="text"
              dir="ltr"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g. Years of Experience"
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
            إضافة المؤشر
          </button>
        </div>
      </div>
    </div>
  );
}
