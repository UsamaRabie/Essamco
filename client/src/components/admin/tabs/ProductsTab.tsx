'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  CheckCircle2,
  XCircle,
  Sparkles,
  Package,
  Layers,
} from 'lucide-react';
import { Product, Category } from '../../../types';

interface ProductsTabProps {
  products: Product[];
  categories: Category[];
  onOpenAddProduct: () => void;
  onOpenEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onUploadImage: (productId: string, file: File) => void;
  uploadingId: string | null;
}

export default function ProductsTab({
  products,
  categories,
  onOpenAddProduct,
  onOpenEditProduct,
  onDeleteProduct,
  onUploadImage,
  uploadingId,
}: ProductsTabProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.nameAr.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());

      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;

      return matchSearch && matchCat && matchBrand;
    });
  }, [products, search, selectedCategory, selectedBrand]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Add Button */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                كتالوج المنتجات الكيميائية (Chemical Products Catalog)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {products.length} منتج
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              إدارة كافة المنتجات في قاعدة البيانات مع المواصفات المخبرية، أحجام التعبئة والصور المتزامنة.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddProduct}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو الرابط..."
              className="w-full ps-9 pe-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white cursor-pointer"
            >
              <option value="all">كافة التصنيفات (All Categories)</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.slug} value={cat.slug}>
                  {cat.nameAr} ({cat.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white cursor-pointer"
            >
              <option value="all">كافة العلامات التجارية (All Brands)</option>
              <option value="essamco">عصامكو (ESSAMCO)</option>
              <option value="power">باور 3 (Power 3)</option>
              <option value="bauer">باور إندستريال (Bauer)</option>
              <option value="savon">سافون (Savon)</option>
              <option value="whiff">ويف (Whiff)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">صورة المنتج</th>
                <th className="py-3.5 px-4">اسم المنتج (العربية / English)</th>
                <th className="py-3.5 px-4">التصنيف والعلامة</th>
                <th className="py-3.5 px-4">أحجام التعبئة</th>
                <th className="py-3.5 px-4">المواصفات الفنية</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-slate-600">لا توجد منتجات مطابقة للبحث</p>
                    <p className="text-xs text-slate-400 mt-1">جرب تغيير كلمات البحث أو إعادة ضبط الفلاتر</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isUploading = uploadingId === p._id;

                  return (
                    <tr key={p._id || p.slug} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Image Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="relative w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          <Image
                            src={p.image || '/images/products/disinfectant-jerrycan.jpg'}
                            alt={p.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      </td>

                      {/* Product Name & Slug */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 line-clamp-1">{p.nameAr}</div>
                        <div className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5" dir="ltr">
                          {p.name}
                        </div>
                        <div className="text-[10px] font-mono text-blue-600 mt-1" dir="ltr">
                          /{p.slug}
                        </div>
                      </td>

                      {/* Category & Brand */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {(() => {
                          const catObj = categories.find((c) => c.slug === p.category);
                          return (
                            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-100 mb-1">
                              {catObj ? catObj.nameAr : p.category}
                            </span>
                          );
                        })()}
                        <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                          العلامة: <span className="text-slate-700">{p.brand}</span>
                        </div>
                      </td>

                      {/* Pack Sizes */}
                      <td className="py-3.5 px-4 max-w-[180px]">
                        <div className="flex flex-wrap gap-1">
                          {p.packSizes && p.packSizes.length > 0 ? (
                            p.packSizes.slice(0, 3).map((size, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]"
                              >
                                {size}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">غير محدد</span>
                          )}
                          {p.packSizes && p.packSizes.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-bold">
                              +{p.packSizes.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Specifications Summary */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-600 whitespace-nowrap">
                        {p.specifications ? (
                          <div className="space-y-0.5">
                            <div>
                              <span className="text-slate-400">pH:</span>{' '}
                              <span className="font-mono font-bold text-slate-800">{p.specifications.phLevel}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                              {p.specifications.dilution}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">قياسي</span>
                        )}
                      </td>

                      {/* Status Badges */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.inStock !== false
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {p.inStock !== false ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <span>{p.inStock !== false ? 'متوفر' : 'غير متوفر'}</span>
                          </span>

                          {p.isFeatured && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 block">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>مميز</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View link */}
                          <Link
                            href={`/ar/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="عرض صفحة المنتج بالموقع"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Upload image */}
                          <label
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="تغيير صورة المنتج"
                          >
                            <Upload className={`w-4 h-4 ${isUploading ? 'animate-bounce text-emerald-600' : ''}`} />
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploading}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0] && p._id) {
                                  onUploadImage(p._id, e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                          </label>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => onOpenEditProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="تعديل تفاصيل ومواصفات المنتج"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف المنتج من قاعدة البيانات"
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
