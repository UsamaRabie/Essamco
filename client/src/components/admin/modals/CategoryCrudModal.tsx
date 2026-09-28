'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { Category } from '../../../types';

interface CategoryCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (categoryData: Partial<Category>) => Promise<void>;
  onUploadImage: (file: File) => Promise<string | null>;
  isUploading: boolean;
}

const COMMON_ICONS = [
  { value: 'Car', label: 'سيارة (Car)' },
  { value: 'Building2', label: 'مبنى / منشآت (Building)' },
  { value: 'Hospital', label: 'مستشفى / طبي (Hospital)' },
  { value: 'Shirt', label: 'أقمشة / ملابس (Textiles)' },
  { value: 'Factory', label: 'مصنع / صناعي (Factory)' },
  { value: 'Sparkles', label: 'نظافة ولمعان (Sparkles)' },
  { value: 'Droplets', label: 'سوائل / كيميائي (Droplets)' },
  { value: 'ShieldCheck', label: 'تطهير وحماية (Shield)' },
];

export default function CategoryCrudModal({
  isOpen,
  onClose,
  category,
  onSave,
  onUploadImage,
  isUploading,
}: CategoryCrudModalProps) {
  const isEditing = !!category;

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    nameAr: '',
    slug: '',
    description: '',
    descriptionAr: '',
    icon: 'Building2',
    image: '/images/categories/housekeeping.jpg',
    order: 1,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        ...category,
      });
    } else {
      setFormData({
        name: '',
        nameAr: '',
        slug: '',
        description: '',
        descriptionAr: '',
        icon: 'Building2',
        image: '/images/categories/housekeeping.jpg',
        order: 1,
      });
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug:
        !prev.slug || !isEditing
          ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : prev.slug,
    }));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await onUploadImage(e.target.files[0]);
      if (url) {
        setFormData((prev) => ({ ...prev, image: url }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B132B] text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold">
              {isEditing ? `تعديل التصنيف: ${formData.nameAr || formData.name}` : 'إضافة تصنيف منتجات جديد'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              إدارة فئات وتصنيفات المنتجات الكيميائية في قاعدة البيانات
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم التصنيف (بالعربية) *</label>
              <input
                type="text"
                required
                value={formData.nameAr || ''}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="مثال: العناية بالسيارات والمحركات"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم التصنيف (English) *</label>
              <input
                type="text"
                required
                dir="ltr"
                value={formData.name || ''}
                onChange={handleNameChange}
                placeholder="e.g. Car Care & Automotive"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الرابط الفريد (Slug) *</label>
              <input
                type="text"
                required
                dir="ltr"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="automotive-car-care"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">أيقونة التصنيف</label>
              <select
                value={formData.icon || 'Building2'}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                {COMMON_ICONS.map((ic) => (
                  <option key={ic.value} value={ic.value}>
                    {ic.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الترتيب في القوائم</label>
              <input
                type="number"
                min={1}
                value={formData.order || 1}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">وصف التصنيف (بالعربية)</label>
            <textarea
              rows={2}
              value={formData.descriptionAr || ''}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              placeholder="وصف مختصر لمجال ونطاق هذا التصنيف الكيميائي..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">وصف التصنيف (English)</label>
            <textarea
              rows={2}
              dir="ltr"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this chemical category..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Category Image */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800">صورة التصنيف (Category Banner Image)</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden relative shrink-0">
                <Image
                  src={formData.image || '/images/categories/housekeeping.jpg'}
                  alt="Category preview"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  dir="ltr"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://... أو مسار الصورة"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
                />

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-blue-200">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'جاري الرفع...' : 'رفع صورة من الجهاز'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'جاري الحفظ...' : isEditing ? 'حفظ التعديلات' : 'إضافة التصنيف'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
