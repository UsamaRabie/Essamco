'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import { Navbar } from '../../../components/Navbar';
import { ShowcaseFooter } from '../../../components/ShowcaseFooter';
import { ServiceQuoteForm } from '../../../components/ServiceQuoteForm';
import { GeneralQuoteModal } from '../../../components/GeneralQuoteModal';
import { fetchProducts, fetchCategories, fetchBrands, fetchSiteContent } from '../../../lib/api';
import { Product, Category, Brand, SiteContent } from '../../../types';
import {
  Search,
  ChevronRight,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function ProductCatalogPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const currentLang = resolvedParams.lang === 'en' ? 'en' : 'ar';
  const { language, setLanguage } = useLanguage();
  const isAr = currentLang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (language !== currentLang) {
      setLanguage(currentLang);
    }
  }, [currentLang, language, setLanguage]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchBrands(), fetchSiteContent()]).then(
      ([catData, brandData, content]) => {
        if (catData) setCategories(catData);
        if (brandData) setBrands(brandData);
        if (content) setSiteContent(content);
      }
    );
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchProducts(selectedCategory, selectedBrand, searchQuery).then((data) => {
      if (isMounted) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedBrand, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#1E2D4A] selection:text-white">
      <Navbar onOpenQuote={() => setQuoteOpen(true)} />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="bg-gradient-to-b from-[#EEF3F7] to-white py-12 sm:py-16 border-b border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
              <Link href={`/${currentLang}`} className="hover:text-blue-700 transition-colors">
                {isAr ? 'الرئيسية' : 'Home'}
              </Link>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${isAr ? 'rotate-180' : ''}`} />
              <span className="text-slate-900 font-bold">
                {isAr ? 'دليل المنتجات الكيميائية' : 'Chemical Products Catalog'}
              </span>
            </nav>

            <div className="max-w-3xl text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1E2D4A] border border-blue-200 text-xs font-bold mb-3.5">
                <Package className="w-4 h-4 text-blue-600" />
                <span>{isAr ? 'تركيبات معتمدة وعبوات صناعية وتجزئة' : 'Certified Formulations & Packaging'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {isAr ? 'دليل المنتجات والمواصفات الفنية' : 'Commercial Chemical Catalog & Specs'}
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {isAr
                  ? 'استكشف تشكيلتنا المعتمدة للمنظفات الصناعية، المطهرات الطبية، سوائل العناية بالسيارات ومنتجات العناية المنزلية المتوفرة للبيع المباشر وبالكميات الصناعية الضخمة.'
                  : 'Browse certified industrial detergents, healthcare disinfectants, vehicle detailing snow foams, and household formulations ready for bulk supply and retail packaging.'}
              </p>
            </div>
          </div>
        </section>

        {/* Filters & Search Toolbar */}
        <section className="py-6 bg-slate-50 border-b border-slate-200/80 sticky top-20 z-20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن منتج أو مادة فعالة...' : 'Search by name, chemical spec...'}
                className="w-full bg-white border border-slate-200 rounded-full ps-10 pe-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#1E2D4A] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isAr ? 'جميع القطاعات' : 'All Sectors'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-[#1E2D4A] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isAr ? cat.nameAr : cat.name}
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs text-slate-500 font-semibold">{isAr ? 'جاري تحميل المنتجات...' : 'Loading products catalog...'}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-base font-bold text-slate-700">{isAr ? 'لم يتم العثور على منتجات مطابقة' : 'No matching products found'}</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-6 py-2 rounded-full bg-[#1E2D4A] text-white text-xs font-bold cursor-pointer"
              >
                {isAr ? 'إعادة ضبط البحث' : 'Reset Search Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((prod) => {
                const name = isAr ? prod.nameAr : prod.name;
                const desc = isAr ? prod.descriptionAr : prod.description;

                return (
                  <div
                    key={prod.slug}
                    className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group"
                  >
                    {/* Product Photo Stage */}
                    <div className="relative w-full h-56 bg-slate-100 overflow-hidden p-4 flex items-center justify-center">
                      <Image
                        src={prod.image || '/images/products/product-placeholder.png'}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-4 group-hover:scale-108 transition-transform duration-500"
                      />
                      {prod.brand && (
                        <span className="absolute top-3 start-3 px-2.5 py-0.5 rounded-full bg-[#1E2D4A]/90 text-white text-[10px] font-bold shadow-xs uppercase">
                          {prod.brand}
                        </span>
                      )}
                      {prod.inStock && (
                        <span className="absolute top-3 end-3 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          {isAr ? 'جاهز للتوريد' : 'In Stock'}
                        </span>
                      )}
                    </div>

                    {/* Product Card Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between text-start">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                          {name}
                        </h3>
                        {desc && (
                          <p className="mt-2 text-xs text-slate-500 font-normal line-clamp-2 leading-relaxed">
                            {desc}
                          </p>
                        )}

                        {/* Packaging Sizes */}
                        {prod.packSizes && prod.packSizes.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {prod.packSizes.slice(0, 2).map((ps, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                                {ps}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Link to Details Page */}
                      <div className="mt-5 pt-3.5 border-t border-slate-100">
                        <Link
                          href={`/${currentLang}/products/${prod.slug}`}
                          className="w-full py-2.5 rounded-full bg-[#1E2D4A] hover:bg-[#152035] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>{isAr ? 'المواصفات والطلب' : 'Specs & Quotation'}</span>
                          <ArrowIcon className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Quotation Request Form */}
        <section className="py-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceQuoteForm
            defaultSubject={isAr ? 'طلب تسعير منتجات تجارية وصناعية' : 'Commercial Products Quotation & Bulk Orders'}
            itemType="product"
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
