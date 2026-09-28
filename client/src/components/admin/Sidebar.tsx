'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Eye, ExternalLink, LogOut, X } from 'lucide-react';
import { AdminTab, SidebarItem } from './types';

interface SidebarProps {
  items: SidebarItem[];
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  adminUser: { name: string; email: string; role: string } | null;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  items,
  activeTab,
  onSelectTab,
  adminUser,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* ============================================================== */}
      {/* DESKTOP FIXED RIGHT SIDEBAR (شريط جانبي عربي أيمن) */}
      {/* ============================================================== */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-[#0B132B] text-white flex-col shrink-0 border-l border-slate-800 z-40 fixed top-0 bottom-0 right-0 overflow-y-auto select-none">
        {/* Logo and Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/ar" className="flex items-center gap-3 group" title="الانتقال للموقع الرئيسي">
            <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
              <Image
                src="/images/brands/logo-essamco.png"
                alt="ESSAMCO"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-base font-black tracking-tight block text-white leading-none">عصامكو</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">لوحة الإدارة والتحكم</span>
            </div>
          </Link>
        </div>

        {/* Admin Profile Mini Card */}
        <div className="p-4 mx-4 my-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{adminUser?.name || 'مدير النظام'}</div>
            <div className="text-[11px] text-slate-400 truncate">{adminUser?.email || 'admin@essamco.com'}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium">متصل بالخادم</span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            صفحات وأقسام الموقع
          </div>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all text-right cursor-pointer group ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  <div className="truncate">
                    <span className="block truncate">{item.label}</span>
                    <span className={`text-[10px] block truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.desc}
                    </span>
                  </div>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 mr-2 ${
                      item.badgeColor
                        ? `${item.badgeColor} text-white`
                        : isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/ar"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>معاينة الموقع الرئيسي</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج من الحساب</span>
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MOBILE DRAWER SIDEBAR */}
      {/* ============================================================== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex" dir="rtl">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#0B132B] text-white flex flex-col h-full z-10 p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold">قائمة لوحة التحكم</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-3 space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all text-right cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
