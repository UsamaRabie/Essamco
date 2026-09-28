'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { submitInquiry } from '../lib/api';
import { Send, CheckCircle2, ShieldCheck, Mail, Phone, Building, User, MessageSquare, Package, Clock } from 'lucide-react';

interface ServiceQuoteFormProps {
  defaultSubject?: string;
  defaultSubjectAr?: string;
  itemType?: 'solution' | 'privateLabel' | 'product';
  itemId?: string;
}

export const ServiceQuoteForm: React.FC<ServiceQuoteFormProps> = ({
  defaultSubject = 'General Institutional Supply',
  defaultSubjectAr,
  itemType = 'solution',
  itemId,
}) => {
  const { language, isAr = language === 'ar' } = useLanguage() as any;
  const isArabic = language === 'ar';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [quantityNeeded, setQuantityNeeded] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const displaySubject = isArabic
    ? defaultSubjectAr || defaultSubject
    : defaultSubject || defaultSubjectAr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await submitInquiry({
        fullName,
        email,
        phone,
        company,
        productName: displaySubject,
        productId: itemId,
        quantityNeeded: quantityNeeded || 'Standard Institutional Order',
        message: message || `Inquiry for ${displaySubject} from website details page`,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.message || (isArabic ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.' : 'Error sending inquiry. Please try again.'));
      }
    } catch (err) {
      setErrorMsg(isArabic ? 'تعذر الاتصال بالخادم. يرجى التأكد من تشغيل السيرفر.' : 'Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="quote-form-section" className="w-full bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Form Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-3 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>{isArabic ? 'طلب تسعير رسمي وتوريد معتمد' : 'Official Quotation & Procurement Desk'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isArabic ? `طلب تسعير خاص: ${displaySubject}` : `Request a Custom Quote: ${displaySubject}`}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-normal">
            {isArabic
              ? 'تواصل مباشرة مع إدارة المبيعات المؤسسية وفريق الهندسة الكيميائية في مصنع عصامكو للحصول على أفضل الأسعار والعينات وجداول التوريد.'
              : 'Direct connection to Essamco factory chemical engineers and regional wholesale sales managers for bulk tenders and specialized packaging.'}
          </p>
        </div>

        {submitted ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-slate-800/80 border border-emerald-500/40 text-center max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {isArabic ? 'تم استلام طلبك بنجاح!' : 'Inquiry Received Successfully!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              {isArabic
                ? 'شكراً لتواصلك مع عصامكو. يقوم فريق المبيعات والمختبر الفني بمراجعة طلبك وسيتم الرد عليك بعرض السعر الرسمي خلال 24 ساعة عمل.'
                : 'Thank you for reaching out to Essamco. Our commercial sales engineers will review your specifications and contact you with an official quotation within 24 business hours.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setFullName('');
                setEmail('');
                setPhone('');
                setCompany('');
                setQuantityNeeded('');
                setMessage('');
              }}
              className="px-6 py-2.5 rounded-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {isArabic ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-start">
                  {isArabic ? 'الاسم بالكامل *' : 'Full Name / Contact Person *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isArabic ? 'أدخل اسمك أو ممثل الشركة' : 'e.g. Dr. Ahmed Hassan'}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl ps-10 pe-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Corporate Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-start">
                  {isArabic ? 'البريد الإلكتروني *' : 'Corporate Email *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isArabic ? 'name@company.com' : 'procurement@company.com'}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl ps-10 pe-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-start">
                  {isArabic ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp Number *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isArabic ? '+20 100 000 0000' : '+20 100 000 0000'}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl ps-10 pe-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Company / Facility */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-start">
                  {isArabic ? 'اسم الشركة / المنشأة' : 'Company / Facility Name'}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={isArabic ? 'مستشفى / فندق / مصنع / شركة' : 'Hospital / Hotel / Industrial Plant'}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl ps-10 pe-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Quantity / Packaging format */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-start">
                {isArabic ? 'الكمية التقديرية / نوع التعبئة المطلوبة' : 'Estimated Volume / Packaging Format'}
              </label>
              <div className="relative">
                <Package className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={quantityNeeded}
                  onChange={(e) => setQuantityNeeded(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'مثال: 50 جركن 20 لتر، أو براميل 200 لتر، أو توريد أسبوعي'
                      : 'e.g. 50x 20L jerrycans, 200L drums, or monthly scheduled supply'
                  }
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl ps-10 pe-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Message / Specifications */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-start">
                {isArabic ? 'المواصفات الفنية أو تفاصيل الطلب' : 'Project Details / Specific Formulation Requirements'}
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute start-3.5 top-3 pointer-events-none" />
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'اكتب أي متطلبات خاصة بالتركيز، المواد الفعالة، العطور، مواعيد التسليم...'
                      : 'Provide any required active ingredient percentages, dilution preferences, delivery deadlines...'
                  }
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl ps-10 pe-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{isArabic ? 'متوسط وقت الرد: أقل من ساعتين' : 'Average response time: under 2 hours'}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isArabic ? 'إرسال طلب التسعير الرسمي' : 'Submit Official Quote Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
