'use client';

import React from 'react';
import Image from 'next/image';
import {
  Sparkles,
  MessageSquare,
  Sliders,
  Building2,
  Factory,
  ShoppingBag,
  Globe,
  ChevronLeft,
  FolderTree,
  Package,
} from 'lucide-react';
import { InquiryRecord, SiteContent } from '../../../types';
import { AdminTab } from '../types';

interface OverviewTabProps {
  inquiries: InquiryRecord[];
  siteContentData: SiteContent | null;
  categoriesCount?: number;
  productsCount?: number;
  onNavigateTab: (tab: AdminTab) => void;
}

export default function OverviewTab({
  inquiries,
  siteContentData,
  categoriesCount = 0,
  productsCount = 0,
  onNavigateTab,
}: OverviewTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-[#1E2D4A] via-[#152035] to-[#0B132B] text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>لوحة الإدارة والتحكم الشاملة</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            مرحباً بك في لوحة تحكم شركة عصامكو للكيماويات الصناعية
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            يمكنك من هنا إدارة كافة محتويات الموقع، شرائح الهيرو، المعارض، المواصفات الفنية للحلول والمنتجات، ومتابعة طلبات عروض الأسعار الواردة من العملاء والشركات.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>متابعة طلبات عروض الأسعار ({inquiries.length})</span>
            </button>
            <button
              onClick={() => onNavigateTab('hero')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 backdrop-blur-xs cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>إدارة شرائح الهيرو</span>
            </button>
          </div>
        </div>
        <div className="absolute left-6 bottom-0 opacity-10 hidden md:block">
          <Image src="/images/brands/logo-essamco.png" alt="Essamco" width={220} height={220} />
        </div>
      </div>

      {/* Quick Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigateTab('inquiries')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{inquiries.length}</div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">طلبات الأسعار</div>
        </div>

        <div
          onClick={() => onNavigateTab('categories')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FolderTree className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{categoriesCount}</div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">تصنيفات المنتجات</div>
        </div>

        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{productsCount}</div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">كتالوج المنتجات</div>
        </div>

        <div
          onClick={() => onNavigateTab('retail')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {siteContentData?.retail?.cards?.length || 0}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">منتجات التجزئة</div>
        </div>

        <div
          onClick={() => onNavigateTab('hero')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Sliders className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {siteContentData?.heroSlides?.length || 0}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">شرائح الهيرو</div>
        </div>

        <div
          onClick={() => onNavigateTab('institutional')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {siteContentData?.institutional?.cards?.length || 0}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">الحلول المؤسسية</div>
        </div>

        <div
          onClick={() => onNavigateTab('privateLabel')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Factory className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {siteContentData?.privateLabel?.cards?.length || 0}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">التصنيع للغير</div>
        </div>

        <div
          onClick={() => onNavigateTab('seo')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Globe className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600">100%</div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">حالة السيو (SEO)</div>
        </div>
      </div>

      {/* Recent Inquiries Quick View */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>أحدث طلبات عروض الأسعار والتوريد</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              الطلبات الواردة مؤخراً عبر النماذج التفاعلية في صفحات الموقع
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('inquiries')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>عرض جميع الطلبات ({inquiries.length})</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="p-3">العميل / المنشأة</th>
                <th className="p-3">المنتج / المتطلب</th>
                <th className="p-3">الكمية التقديرية</th>
                <th className="p-3">حالة الطلب</th>
                <th className="p-3 text-left">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.slice(0, 5).map((inq) => (
                <tr key={inq._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{inq.fullName}</div>
                    <div className="text-[11px] text-slate-500">
                      {inq.email} {inq.phone ? `• ${inq.phone}` : ''}
                    </div>
                    {inq.company && <div className="text-[10px] text-blue-600 font-semibold">{inq.company}</div>}
                  </td>
                  <td className="p-3 font-semibold text-slate-800">
                    {inq.productName || 'طلب توريد عام'}
                  </td>
                  <td className="p-3 text-slate-600 font-medium">
                    {inq.quantityNeeded || 'كميات تجارية'}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inq.status === 'quoted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inq.status === 'completed'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : inq.status === 'contacted'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {inq.status === 'quoted'
                        ? 'تم إرسال السعر'
                        : inq.status === 'completed'
                        ? 'مكتمل'
                        : inq.status === 'contacted'
                        ? 'تم التواصل'
                        : 'قيد الانتظار'}
                    </span>
                  </td>
                  <td className="p-3 text-left text-slate-400 text-[11px]">
                    {new Date(inq.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                    لا توجد طلبات تسعير واردة حتى الآن.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
