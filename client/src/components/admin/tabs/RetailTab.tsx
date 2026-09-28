'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Sliders, Trash2, Upload } from 'lucide-react';
import { SiteContent } from '../../../types';

interface RetailTabProps {
  siteContentData: SiteContent;
  setSiteContentData: React.Dispatch<React.SetStateAction<SiteContent | null>>;
  onOpenAddCard: () => void;
  onOpenEditCard: (index: number) => void;
  onDeleteCard: (index: number) => void;
  onCardImageUpload: (index: number, file: File) => void;
  uploadingItem: string | null;
}

export default function RetailTab({
  siteContentData,
  setSiteContentData,
  onOpenAddCard,
  onOpenEditCard,
  onDeleteCard,
  onCardImageUpload,
  uploadingItem,
}: RetailTabProps) {
  if (!siteContentData.retail) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              منتجات التجزئة والمستهلكين (Retail Products)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              إدارة فئات المنتجات الاستهلاكية (العناية بالأقمشة، تطهير الأسطح، صابون النودلز).
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAddCard}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة بطاقة منتج</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">عنوان القسم الرئيسي (العربية)</label>
            <input
              type="text"
              dir="rtl"
              value={siteContentData.retail.titleAr}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  retail: { ...siteContentData.retail, titleAr: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">عنوان القسم الرئيسي (English)</label>
            <input
              type="text"
              dir="ltr"
              value={siteContentData.retail.title}
              onChange={(e) =>
                setSiteContentData({
                  ...siteContentData,
                  retail: { ...siteContentData.retail, title: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {siteContentData.retail.cards?.map((card, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-700">بطاقة #{idx + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onOpenEditCard(idx)}
                    className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-100/60 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="تعديل تفاصيل البطاقة والمعرض"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCard(idx)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="حذف البطاقة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-200">
                <Image src={card.image} alt={card.title} fill className="object-cover" />
                {uploadingItem === `retail-${idx}` && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                    جاري الرفع...
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">عنوان البطاقة (العربية)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={card.titleAr || ''}
                  onChange={(e) => {
                    const updated = [...siteContentData.retail.cards];
                    updated[idx] = { ...updated[idx], titleAr: e.target.value };
                    setSiteContentData({
                      ...siteContentData,
                      retail: { ...siteContentData.retail, cards: updated },
                    });
                  }}
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">عنوان البطاقة (English)</label>
                <input
                  type="text"
                  dir="ltr"
                  value={card.title}
                  onChange={(e) => {
                    const updated = [...siteContentData.retail.cards];
                    updated[idx] = { ...updated[idx], title: e.target.value };
                    setSiteContentData({
                      ...siteContentData,
                      retail: { ...siteContentData.retail, cards: updated },
                    });
                  }}
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <label className="block cursor-pointer pt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onCardImageUpload(idx, file);
                  }}
                  className="hidden"
                />
                <div className="w-full py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors">
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>رفع صورة المنتج</span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
