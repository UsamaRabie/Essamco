'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../../context/LanguageContext';
import { Navbar } from '../../../../components/Navbar';
import { ShowcaseFooter } from '../../../../components/ShowcaseFooter';
import { MultiImageGallery } from '../../../../components/MultiImageGallery';
import { ServiceQuoteForm } from '../../../../components/ServiceQuoteForm';
import { GeneralQuoteModal } from '../../../../components/GeneralQuoteModal';
import { fetchProductBySlug, fetchProducts, fetchSiteContent } from '../../../../lib/api';
import { Product, SiteContent } from '../../../../types';
import {
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Package,
  Droplets,
  Layers,
  Sparkles,
  MessageCircle,
  FileCheck,
  Activity,
  Box,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const currentLang = resolvedParams.lang === 'en' ? 'en' : 'ar';
  const slug = resolvedParams.slug;

  const { language, setLanguage } = useLanguage();
  const isAr = currentLang === 'ar';

  useEffect(() => {
    if (language !== currentLang) {
      setLanguage(currentLang);
    }
  }, [currentLang, language, setLanguage]);

  const [product, setProduct] = useState<Product | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([fetchProductBySlug(slug), fetchSiteContent()]).then(
      ([prodData, content]) => {
        if (!isMounted) return;
        if (content) setSiteContent(content);

        if (prodData) {
          setProduct(prodData);
          setLoading(false);
        } else {
          // If not found in primary endpoint, check all products
          fetchProducts().then((allProds) => {
            if (!isMounted) return;
            const found = allProds.find((p) => p.slug === slug);
            setProduct(found || null);
            setLoading(false);
          });
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar onOpenQuote={() => setQuoteOpen(true)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-900">
        <Navbar onOpenQuote={() => setQuoteOpen(true)} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isAr ? 'المنتج غير موجود في الكتالوج' : 'Product Not Found'}
          </h1>
          <p className="text-slate-500 text-sm max-w-md mb-6">
            {isAr
              ? 'عذراً، المنتج الذي تبحث عنه غير مسجل في قاعدة البيانات أو تم نقله.'
              : 'The product you are looking for is not registered in the catalog database or was removed.'}
          </p>
          <Link
            href={`/${language}/products`}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-600/20"
          >
            {isAr ? 'العودة لكتالوج المنتجات' : 'Back to Products Catalog'}
          </Link>
        </div>
        <ShowcaseFooter />
      </div>
    );
  }

  const name = isAr ? product.nameAr || product.name : product.name || product.nameAr;
  const description = isAr ? product.descriptionAr || product.description : product.description || product.descriptionAr;
  const features = isAr && product.featuresAr && product.featuresAr.length > 0 ? product.featuresAr : product.features || [];

  // Multi-image gallery preparation
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image || '/images/products/disinfectant-jerrycan.jpg', '/images/facilities/factory-tanks.jpg', '/images/facilities/warehouse.jpg'];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#1E2D4A] selection:text-white">
      <Navbar onOpenQuote={() => setQuoteOpen(true)} />

      <main className="flex-1">
        {/* Breadcrumb Navigation Bar */}
        <section className="bg-slate-50 border-b border-slate-200/80 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href={`/${currentLang}`} className="hover:text-blue-700 transition-colors">
                {isAr ? 'الرئيسية' : 'Home'}
              </Link>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${isAr ? 'rotate-180' : ''}`} />
              <Link href={`/${currentLang}/products`} className="hover:text-blue-700 transition-colors">
                {isAr ? 'دليل المنتجات' : 'Products'}
              </Link>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${isAr ? 'rotate-180' : ''}`} />
              <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">
                {name}
              </span>
            </nav>
          </div>
        </section>

        {/* Main Product Showcase Stage */}
        <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Multi-Image Interactive Gallery (6 cols) */}
            <div className="lg:col-span-6 w-full">
              <MultiImageGallery images={galleryImages} alt={name || 'Essamco Product'} />
            </div>

            {/* Right Column: Specifications & Details (6 cols) */}
            <div className="lg:col-span-6 flex flex-col text-start">
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product?.brand && (
                  <span className="px-3 py-1 rounded-full bg-[#1E2D4A] text-white text-xs font-bold uppercase shadow-2xs">
                    {product.brand}
                  </span>
                )}
                {product?.category && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
                    {product.category}
                  </span>
                )}
                {product?.inStock && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                    {isAr ? 'متوفر للتوريد الفوري' : 'In Stock - Bulk Ready'}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                {name}
              </h1>

              <div className="mt-4 text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                <p>{description}</p>
              </div>

              {/* Technical Specifications Table */}
              {product?.specifications && (
                <div className="mt-7 p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-700" />
                    <span>{isAr ? 'المواصفات الفنية والفيزيائية' : 'Technical Specifications'}</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-500">{isAr ? 'الرقم الهيدروجيني (pH):' : 'pH Level:'}</span>
                      <span className="font-bold text-slate-900">{product.specifications.phLevel || '7.0 - 8.0'}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-500">{isAr ? 'نسبة التخفيف الموصى بها:' : 'Dilution Ratio:'}</span>
                      <span className="font-bold text-slate-900">{product.specifications.dilution || '1:10 - 1:50'}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-500">{isAr ? 'المظهر واللون:' : 'Color:'}</span>
                      <span className="font-bold text-slate-900">{product.specifications.color || 'Clear'}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-500">{isAr ? 'الرائحة العطرية:' : 'Fragrance:'}</span>
                      <span className="font-bold text-slate-900">{product.specifications.fragrance || 'Pleasant'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Packaging Sizes */}
              {product?.packSizes && product.packSizes.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Box className="w-4 h-4 text-blue-700" />
                    <span>{isAr ? 'العبوات والأحجام المتاحة للتوريد:' : 'Available Packaging Formats:'}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.packSizes.map((size, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Features Checklist */}
              {features.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'المزايا الفنية للمنتج:' : 'Performance Features:'}</span>
                  </h3>
                  <ul className="space-y-2">
                    {features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="#quote-form-section"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1E2D4A] hover:bg-[#152035] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all text-center cursor-pointer"
                >
                  {isAr ? 'طلب تسعير لهذا المنتج الآن' : 'Request Pricing For This Product'}
                </a>

                <a
                  href="https://wa.me/201001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'طلب عينة عبر واتساب' : 'Request Sample via WhatsApp'}</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Embedded Quotation & Contact Form on the SAME Page */}
        <section className="py-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceQuoteForm
            defaultSubject={product?.name}
            defaultSubjectAr={product?.nameAr}
            itemType="product"
            itemId={product?._id || slug}
          />
        </section>
      </main>

      <ShowcaseFooter
        content={siteContent?.footerSettings}
        socialLinks={siteContent?.socialLinks}
      />

      <GeneralQuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
