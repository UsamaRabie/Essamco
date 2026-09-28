'use client';

import React from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import { ConfirmModalState } from './types';

interface ConfirmModalProps {
  modal: ConfirmModalState;
  onClose: () => void;
}

export default function ConfirmModal({ modal, onClose }: ConfirmModalProps) {
  if (!modal.isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{modal.title}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">تأكيد الإجراء المطلوب</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          {modal.message}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={modal.onConfirm}
            className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{modal.confirmText || 'تأكيد الحذف'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
