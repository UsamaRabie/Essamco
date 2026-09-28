'use client';

import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ToastState } from './types';

interface ToastNotificationProps {
  toast: ToastState | null;
}

export default function ToastNotification({ toast }: ToastNotificationProps) {
  if (!toast) return null;

  return (
    <div
      dir="rtl"
      className={`fixed top-4 left-4 z-50 px-4 py-3 rounded-2xl text-xs font-bold shadow-xl border flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
        toast.type === 'success'
          ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
          : 'bg-red-900 text-red-100 border-red-700'
      }`}
    >
      {toast.type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
      )}
      <span>{toast.message}</span>
    </div>
  );
}
