'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { InquiryRecord } from '../../../types';

interface InquiriesTabProps {
  inquiries: InquiryRecord[];
  onStatusChange: (id: string, status: InquiryRecord['status']) => void;
  onDeleteInquiry: (id: string) => void;
}

export default function InquiriesTab({
  inquiries,
  onStatusChange,
  onDeleteInquiry,
}: InquiriesTabProps) {
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { id: 'all', label: 'الكل' },
    { id: 'pending', label: 'قيد الانتظار' },
    { id: 'contacted', label: 'تم التواصل' },
    { id: 'quoted', label: 'تم إرسال السعر' },
    { id: 'completed', label: 'مكتمل' },
  ];

  const filteredInquiries = inquiries.filter(
    (inq) => filter === 'all' || inq.status === filter
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600">تصفية الطلبات:</span>
          {filterOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-500">
          إجمالي طلبات التسعير والتوريد: <strong className="text-slate-800 font-bold">{inquiries.length}</strong>
        </span>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-3.5">العميل وبيانات التواصل</th>
                <th className="p-3.5">المتطلب / المنتج المطلوب</th>
                <th className="p-3.5">الكمية التقديرية</th>
                <th className="p-3.5">حالة الطلب</th>
                <th className="p-3.5 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.map((inq) => (
                <tr key={inq._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{inq.fullName}</div>
                    <div className="text-slate-500 text-[11px]">{inq.email}</div>
                    {inq.phone && <div className="text-slate-400 text-[11px] font-mono">{inq.phone}</div>}
                    {inq.company && <div className="text-blue-600 text-[11px] font-medium">{inq.company}</div>}
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <span className="font-semibold text-slate-800 block">
                      {inq.productName || 'طلب توريد عام'}
                    </span>
                    {inq.message && <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{inq.message}</p>}
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">{inq.quantityNeeded || 'كميات تجارية'}</td>
                  <td className="p-3.5">
                    <select
                      value={inq.status}
                      onChange={(e) => onStatusChange(inq._id, e.target.value as InquiryRecord['status'])}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                        inq.status === 'quoted'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : inq.status === 'completed'
                          ? 'bg-slate-100 text-slate-600 border-slate-300'
                          : inq.status === 'contacted'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="contacted">تم التواصل</option>
                      <option value="quoted">تم إرسال السعر</option>
                      <option value="completed">مكتمل</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-left">
                    <button
                      onClick={() => onDeleteInquiry(inq._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="حذف الطلب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                    لا توجد طلبات عروض أسعار أو توريد مطابقة لهذا الفلتر.
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
