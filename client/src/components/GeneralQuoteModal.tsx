'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { submitInquiry } from '../lib/api';
import { X, Send, CheckCircle2, ShieldAlert, Beaker, Building, Mail, Phone, User } from 'lucide-react';

interface GeneralQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeneralQuoteModal: React.FC<GeneralQuoteModalProps> = ({ isOpen, onClose }) => {
  const { t, language, direction } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    sector: 'Hospital & Healthcare Disinfection',
    quantityNeeded: 'Bulk Industrial Drums / IBC',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const res = await submitInquiry({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      productName: `Sector Inquiry: ${formData.sector}`,
      quantityNeeded: formData.quantityNeeded,
      message: formData.message || `Wholesale / custom formulation inquiry for ${formData.sector}`,
    });

    setSubmitting(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMessage(res.message || 'Failed to submit quotation request. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-6 sm:p-7 text-white flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-sky-300 text-xs font-bold mb-2">
              <Beaker className="w-3.5 h-3.5" />
              <span>Commercial Quotation Desk</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {t('nav.requestQuote')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
              Request tailored bulk chemical formulations, institutional pricing, or OEM contract manufacturing directly from our plant.
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'ar' ? 'تم استلام طلب التسعير بنجاح' : 'Quotation Request Received!'}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Our senior chemical account managers have received your specs and will dispatch technical documentation and commercial quotation to <strong className="text-slate-900">{formData.email}</strong> within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                type="button"
                className="mt-6 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-xs"
              >
                {language === 'ar' ? 'العودة للموقع' : 'Return to Website'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('contact.name')} *
                </label>
                <div className="relative">
                  <User className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${direction === 'rtl' ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Contact Person Full Name"
                    className={`w-full py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all ${
                      direction === 'rtl' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('contact.email')} *
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${direction === 'rtl' ? 'right-3' : 'left-3'}`} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="purchasing@company.com"
                      className={`w-full py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all ${
                        direction === 'rtl' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('contact.phone')} *
                  </label>
                  <div className="relative">
                    <Phone className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${direction === 'rtl' ? 'right-3' : 'left-3'}`} />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+20 100 000 0000"
                      dir="ltr"
                      className={`phone-number w-full py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all text-start ${
                        direction === 'rtl' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('contact.company')}
                  </label>
                  <div className="relative">
                    <Building className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${direction === 'rtl' ? 'right-3' : 'left-3'}`} />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Hospital, Hotel, Fleet, Factory"
                      className={`w-full py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all ${
                        direction === 'rtl' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Sector
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-medium transition-all"
                  >
                    <option value="Hospital & Healthcare Disinfection">Hospital & Healthcare Disinfection</option>
                    <option value="Car Care & Automotive Wash">Car Care & Automotive Wash</option>
                    <option value="Facility & Hotel Housekeeping">Facility & Hotel Housekeeping</option>
                    <option value="Commercial & Industrial Laundry">Commercial & Industrial Laundry</option>
                    <option value="Heavy Industrial Degreasing">Heavy Industrial Degreasing</option>
                    <option value="Private Label OEM Contract">Private Label OEM Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Quantity & Delivery Details
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Specify estimated monthly volume, delivery location, or custom chemical formulation requirements..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-700/20 hover:shadow-lg hover:shadow-blue-700/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t('modal.submitQuote')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
