'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, RefreshCw, Save, Eye } from 'lucide-react';
import { SidebarItem } from './types';

interface TopHeaderProps {
  currentTab: SidebarItem;
  onOpenMobileSidebar: () => void;
  onReload: () => void;
  loadingData: boolean;
  onSave: () => void;
  savingContent: boolean;
}

export default function TopHeader({
  currentTab,
  onOpenMobileSidebar,
  onReload,
  loadingData,
  onSave,
  savingContent,
}: TopHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="فتح القائمة الجانبية"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">لوحة التحكم /</span>
            <h1 className="text-sm sm:text-base font-black text-slate-900">{currentTab.label}</h1>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block">{currentTab.desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onReload}
          disabled={loadingData}
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
          title="تحديث البيانات من السيرفر"
        >
          <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        <button
          onClick={onSave}
          disabled={savingContent}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          {savingContent ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>حفظ ونشر التعديلات</span>
        </button>

        <Link
          href="/ar"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-blue-600" />
          <span>معاينة الموقع</span>
        </Link>
      </div>
    </header>
  );
}
