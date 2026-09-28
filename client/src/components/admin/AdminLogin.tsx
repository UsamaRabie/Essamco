'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { adminLogin } from '../../lib/api';

interface AdminLoginProps {
  onLoginSuccess: (token: string, adminUser: { name: string; email: string; role: string }) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await adminLogin(email, password);
    setLoading(false);

    if (res.success && res.token) {
      onLoginSuccess(res.token, res.admin as { name: string; email: string; role: string });
    } else {
      setError(res.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة مجدداً');
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 font-sans font-arabic">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white p-2.5 mx-auto flex items-center justify-center shadow-md">
            <Image
              src="/images/brands/logo-essamco.png"
              alt="شعار عصامكو"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">لوحة تحكم عصامكو</h1>
          <p className="text-xs text-slate-400">إدارة محتوى الموقع وطلبات عروض الأسعار والتوريد</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">البريد الإلكتروني للأدمن</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-right"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">كلمة مرور لوحة التحكم</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-right"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>تسجيل الدخول إلى لوحة التحكم</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/ar"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>العودة إلى الموقع الرئيسي</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
