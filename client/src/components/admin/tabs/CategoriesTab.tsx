'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Layers,
  Package,
  ArrowUpRight,
} from 'lucide-react';
import { Category } from '../../../types';

interface CategoriesTabProps {
  categories: Category[];
  onOpenAddCategory: () => void;
  onOpenEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onUploadImage: (categoryId: string, file: File) => void;
  uploadingId: string | null;
  onSelectCategoryFilter?: (slug: string) => void;
}

export default function CategoriesTab({
  categories,
  onOpenAddCategory,
  onOpenEditCategory,
  onDeleteCategory,
  onUploadImage,
  uploadingId,
  onSelectCategoryFilter,
}: CategoriesTabProps) {
  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchSearch =
        search.trim() === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.nameAr.toLowerCase().includes(search.toLowerCase()) ||
        c.slug.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [categories, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Add Button */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                إدارة تصنيفات المنتجات (Product Categories)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {categories.length} تصنيف
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              إدارة وتصنيف المنتجات في قاعدة البيانات. ترتبط كل منتجات الكتالوج بهذه التصنيفات تلقائياً.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddCategory}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة تصنيف جديد</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في التصنيفات بالعربية أو الإنجليزية..."
            className="w-full ps-9 pe-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Categories Grid & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">صورة التصنيف</th>
                <th className="py-3.5 px-4">اسم التصنيف (العربية / English)</th>
                <th className="py-3.5 px-4">الرابط الفريد (Slug)</th>
                <th className="py-3.5 px-4">الأيقونة والترتيب</th>
                <th className="py-3.5 px-4">عدد المنتجات التابعة</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-slate-600">لا توجد تصنيفات مطابقة للبحث</p>
                    <p className="text-xs text-slate-400 mt-1">جرب تغيير كلمة البحث أو أضف تصنيفاً جديداً</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((c) => {
                  const isUploading = uploadingId === c._id;

                  return (
                    <tr key={c._id || c.slug} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="relative w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                          <Image
                            src={c.image || '/images/categories/housekeeping.jpg'}
                            alt={c.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      </td>

                      {/* Names & Description */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-bold text-slate-900 line-clamp-1">{c.nameAr}</div>
                        <div className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5" dir="ltr">
                          {c.name}
                        </div>
                        {c.descriptionAr && (
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 font-normal">
                            {c.descriptionAr}
                          </p>
                        )}
                      </td>

                      {/* Slug */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          {c.slug}
                        </span>
                      </td>

                      {/* Icon & Order */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {c.icon || 'Standard'}
                          </span>
                          <div className="text-[10px] text-slate-400">ترتيب: #{c.order || 1}</div>
                        </div>
                      </td>

                      {/* Product Count Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Package className="w-3.5 h-3.5" />
                          <span>{c.productCount ?? 0} منتج</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Upload image */}
                          <label
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="تغيير صورة التصنيف"
                          >
                            <Upload className={`w-4 h-4 ${isUploading ? 'animate-bounce text-emerald-600' : ''}`} />
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploading}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0] && c._id) {
                                  onUploadImage(c._id, e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                          </label>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => onOpenEditCategory(c)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="تعديل بيانات التصنيف"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => onDeleteCategory(c)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف التصنيف من قاعدة البيانات"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
