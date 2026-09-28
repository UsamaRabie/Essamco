import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Product, Category } from '../../../types';

interface ProductCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSave: (productData: Partial<Product>) => Promise<void>;
  onUploadImage: (file: File) => Promise<string | null>;
  isUploading: boolean;
}

const DEFAULT_BRANDS = [
  { value: 'essamco', label: 'عصامكو (ESSAMCO)' },
  { value: 'power', label: 'باور 3 (Power 3)' },
  { value: 'bauer', label: 'باور إندستريال (Bauer)' },
  { value: 'savon', label: 'سافون (Savon)' },
  { value: 'whiff', label: 'ويف (Whiff)' },
];

export default function ProductCrudModal({
  isOpen,
  onClose,
  product,
  categories,
  onSave,
  onUploadImage,
  isUploading,
}: ProductCrudModalProps) {
  const isEditing = !!product;

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    nameAr: '',
    slug: '',
    category: categories[0]?.slug || 'facility-housekeeping',
    brand: 'essamco',
    description: '',
    descriptionAr: '',
    features: [''],
    featuresAr: [''],
    specifications: {
      phLevel: '7.0 - 8.0',
      dilution: 'Ready to use',
      color: 'Clear',
      fragrance: 'Fresh',
      density: '1.02 g/cm³',
    },
    packSizes: ['1 Liter Bottle', '4 Liters Canister', '20 Liters Jerrycan'],
    image: '/images/products/disinfectant-jerrycan.jpg',
    images: [],
    isFeatured: false,
    inStock: true,
  });

  const [packSizeInput, setPackSizeInput] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'specs' | 'features' | 'media'>('basic');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        features: product.features && product.features.length > 0 ? product.features : [''],
        featuresAr: product.featuresAr && product.featuresAr.length > 0 ? product.featuresAr : [''],
        specifications: product.specifications || {
          phLevel: '7.0',
          dilution: 'Ready to use',
          color: 'Clear',
          fragrance: 'Fresh',
          density: '1.0 g/cm³',
        },
        packSizes: product.packSizes || [],
      });
    } else {
      setFormData({
        name: '',
        nameAr: '',
        slug: '',
        category: 'facility-housekeeping',
        brand: 'essamco',
        description: '',
        descriptionAr: '',
        features: [''],
        featuresAr: [''],
        specifications: {
          phLevel: '7.0 - 8.0',
          dilution: '1:10 - 1:50',
          color: 'Clear Blue',
          fragrance: 'Fresh Pine',
          density: '1.02 g/cm³',
        },
        packSizes: ['4 Liters Canister', '20 Liters Jerrycan'],
        image: '/images/products/disinfectant-jerrycan.jpg',
        images: [],
        isFeatured: false,
        inStock: true,
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Auto-generate slug from English name if empty
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !prev.slug || !isEditing ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
    }));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await onUploadImage(e.target.files[0]);
      if (url) {
        setFormData((prev) => ({
          ...prev,
          image: url,
          images: prev.images && prev.images.length > 0 ? [...prev.images, url] : [url],
        }));
      }
    }
  };

  const handleAddPackSize = () => {
    if (packSizeInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        packSizes: [...(prev.packSizes || []), packSizeInput.trim()],
      }));
      setPackSizeInput('');
    }
  };

  const handleRemovePackSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      packSizes: prev.packSizes?.filter((_, i) => i !== index),
    }));
  };

  const handleAddFeature = (type: 'ar' | 'en') => {
    if (type === 'ar') {
      setFormData((prev) => ({ ...prev, featuresAr: [...(prev.featuresAr || []), ''] }));
    } else {
      setFormData((prev) => ({ ...prev, features: [...(prev.features || []), ''] }));
    }
  };

  const handleUpdateFeature = (type: 'ar' | 'en', index: number, value: string) => {
    if (type === 'ar') {
      const updated = [...(formData.featuresAr || [])];
      updated[index] = value;
      setFormData((prev) => ({ ...prev, featuresAr: updated }));
    } else {
      const updated = [...(formData.features || [])];
      updated[index] = value;
      setFormData((prev) => ({ ...prev, features: updated }));
    }
  };

  const handleRemoveFeature = (type: 'ar' | 'en', index: number) => {
    if (type === 'ar') {
      setFormData((prev) => ({
        ...prev,
        featuresAr: prev.featuresAr?.filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        features: prev.features?.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Clean up empty features
      const cleaned = {
        ...formData,
        features: (formData.features || []).filter((f) => f.trim() !== ''),
        featuresAr: (formData.featuresAr || []).filter((f) => f.trim() !== ''),
      };
      await onSave(cleaned);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B132B] text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold">
              {isEditing ? `تعديل المنتج: ${formData.nameAr || formData.name}` : 'إضافة منتج جديد للكتالوج'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              بيانات المنتج الكيميائي، المواصفات الفنية، أحجام التعبئة والصور
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-2 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'basic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            البيانات الأساسية والتصنيف
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'specs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            المواصفات الفنية والتعبئة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'features' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            المميزات ونقاط القوة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'media' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            الصور والحالة
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم المنتج (بالعربية) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr || ''}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
                    placeholder="مثال: عصامكو ألترا سانيتايز - مطهر المستشفيات"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم المنتج (English) *</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={formData.name || ''}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
                    placeholder="e.g. Essamco Ultra Sanitize Multi-Surface Disinfectant"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الرابط الفريد (Slug) *</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
                    placeholder="essamco-ultra-sanitize"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف الكيميائي *</label>
                  <select
                    value={formData.category || (categories[0]?.slug || 'facility-housekeeping')}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white cursor-pointer"
                  >
                    {categories.length === 0 ? (
                      <option value="">لا توجد تصنيفات (أضف تصنيفاً أولاً)</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat._id || cat.slug} value={cat.slug}>
                          {cat.nameAr} ({cat.name})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">العلامة التجارية *</label>
                  <select
                    value={formData.brand || 'essamco'}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white cursor-pointer"
                  >
                    {DEFAULT_BRANDS.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">وصف المنتج (بالعربية) *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.descriptionAr || ''}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
                  placeholder="وصف تفصيلي لاستخدامات وتركيبة المنتج وأمانه..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">وصف المنتج (English) *</label>
                <textarea
                  rows={3}
                  required
                  dir="ltr"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
                  placeholder="Detailed description of product applications, formulation, and safety..."
                />
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL SPECIFICATIONS & PACKAGING */}
          {activeTab === 'specs' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                  المواصفات الكيميائية والمخبرية (Laboratory Specifications)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">الرقم الهيدروجيني (pH Level)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formData.specifications?.phLevel || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications!,
                            phLevel: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      placeholder="7.5 ± 0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">نسبة التخفيف القياسية (Dilution)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formData.specifications?.dilution || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications!,
                            dilution: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      placeholder="1:50 - 1:100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">الكثافة النوعية (Density)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formData.specifications?.density || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications!,
                            density: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      placeholder="1.03 g/cm³"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">اللون والمظهر (Color)</label>
                    <input
                      type="text"
                      value={formData.specifications?.color || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications!,
                            color: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      placeholder="أزرق زمردي شفاف"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">الرائحة والعطر (Fragrance)</label>
                    <input
                      type="text"
                      value={formData.specifications?.fragrance || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications!,
                            fragrance: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      placeholder="زهور منعشة / صنوبر"
                    />
                  </div>
                </div>
              </div>

              {/* Pack Sizes */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                  أحجام العبوات المتوفرة (Pack Sizes)
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={packSizeInput}
                    onChange={(e) => setPackSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPackSize();
                      }
                    }}
                    placeholder="مثال: 5 لتر جركن أو 200 لتر برميل"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddPackSize}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    إضافة حجم
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.packSizes?.map((size, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium"
                    >
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePackSize(idx)}
                        className="text-blue-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Arabic Features */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-800">المميزات الرئيسية (بالعربية)</span>
                    <button
                      type="button"
                      onClick={() => handleAddFeature('ar')}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>إضافة ميزة</span>
                    </button>
                  </div>
                  {formData.featuresAr?.map((feat, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleUpdateFeature('ar', idx, e.target.value)}
                        placeholder={`ميزة رقم ${idx + 1}`}
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature('ar', idx)}
                        className="text-slate-400 hover:text-red-600 p-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* English Features */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-800">Key Features (English)</span>
                    <button
                      type="button"
                      onClick={() => handleAddFeature('en')}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Feature</span>
                    </button>
                  </div>
                  {formData.features?.map((feat, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        dir="ltr"
                        value={feat}
                        onChange={(e) => handleUpdateFeature('en', idx, e.target.value)}
                        placeholder={`Feature #${idx + 1}`}
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature('en', idx)}
                        className="text-slate-400 hover:text-red-600 p-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & STATUS */}
          {activeTab === 'media' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                  صورة المنتج الأساسية (Product Primary Image)
                </h4>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-white border border-slate-200 overflow-hidden relative shrink-0 shadow-xs">
                    <Image
                      src={formData.image || '/images/products/disinfectant-jerrycan.jpg'}
                      alt="Product preview"
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <label className="block text-xs font-bold text-slate-700">رابط الصورة (URL)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      placeholder="https://res.cloudinary.com/..."
                    />

                    <div className="pt-1">
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-blue-200">
                        <Upload className="w-4 h-4" />
                        <span>{isUploading ? 'جاري الرفع إلى Cloudinary...' : 'رفع صورة من الجهاز'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                  حالة المنتج والعرض (Status & Availability)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={!!formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">متوفر للطلب والمخزون (In Stock)</span>
                      <span className="text-[11px] text-slate-500 block">يظهر كمنتج متاح للشحن المباشر</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={!!formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">منتج مميز (Featured Product)</span>
                      <span className="text-[11px] text-slate-500 block">يحصل على شارة بارزة وأولوية العرض</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
              <span>{submitting ? 'جاري الحفظ...' : isEditing ? 'حفظ التعديلات' : 'إضافة المنتج للكتالوج'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
