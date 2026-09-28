'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { InquiryRecord } from '../types';
import { fetchInquiries } from '../lib/api';
import { X, Database, RefreshCw, Mail, Phone, Building, Calendar, Package, Clock, ShieldCheck } from 'lucide-react';

interface AdminInquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminInquiriesModal: React.FC<AdminInquiriesModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadInquiries = async () => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('essamco_admin_token') || undefined : undefined;
    const data = await fetchInquiries(token);
    setInquiries(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadInquiries();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>MongoDB Atlas Real-Time Inquiries Portal</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                  cluster0 / essamco
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Live quotations and procurement requests stored in MongoDB Atlas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadInquiries}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh from MongoDB Atlas"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>
              Total records in MongoDB: <strong className="text-slate-900">{inquiries.length}</strong>
            </span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected to Atlas Shard Cluster
            </span>
          </div>

          {loading && (
            <div className="py-16 text-center">
              <div className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs text-slate-500 font-medium">Fetching inquiries from MongoDB...</p>
            </div>
          )}

          {!loading && inquiries.length === 0 && (
            <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-600">No inquiries recorded yet.</p>
              <p className="text-xs text-slate-400 mt-1">Submit a quote request to see it appear here instantly!</p>
            </div>
          )}

          {!loading && inquiries.length > 0 && (
            <div className="space-y-3.5">
              {inquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{inq.fullName}</span>
                        {inq.company && (
                          <span className="text-xs font-normal text-slate-500 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5" />
                            {inq.company}
                          </span>
                        )}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                        <span className="flex items-center gap-1 hover:text-blue-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`mailto:${inq.email}`}>{inq.email}</a>
                        </span>
                        <span className="flex items-center gap-1 text-slate-700 font-semibold" dir="ltr">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`tel:${inq.phone}`}>{inq.phone}</a>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        inq.status === 'quoted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold flex items-center gap-1 text-blue-800">
                        <Package className="w-3.5 h-3.5" />
                        {inq.productName || 'General Quotation'}
                      </span>
                      <span className="font-mono text-slate-500">{inq.quantityNeeded}</span>
                    </div>
                    <p className="text-slate-600 pt-1 leading-relaxed">
                      &quot;{inq.message}&quot;
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(inq.createdAt).toLocaleString()}
                    </span>
                    <span>MongoDB _id: {inq._id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Live MERN Stack Database Interface</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 text-xs"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
