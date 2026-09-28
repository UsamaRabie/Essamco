'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Navbar } from '../../components/Navbar';
import { ShowcaseHero } from '../../components/ShowcaseHero';
import { ShowcaseStats } from '../../components/ShowcaseStats';
import { ShowcaseInstitutional } from '../../components/ShowcaseInstitutional';
import { ShowcasePrivateLabel } from '../../components/ShowcasePrivateLabel';
import { ShowcaseRetail } from '../../components/ShowcaseRetail';
import { ShowcaseWhyUs } from '../../components/ShowcaseWhyUs';
import { ShowcaseBrands } from '../../components/ShowcaseBrands';
import { ShowcaseCtaBanner } from '../../components/ShowcaseCtaBanner';
import { ShowcaseFooter } from '../../components/ShowcaseFooter';
import { GeneralQuoteModal } from '../../components/GeneralQuoteModal';
import { AdminInquiriesModal } from '../../components/AdminInquiriesModal';
import { fetchSiteContent, fetchProducts } from '../../lib/api';
import { SiteContent, Product } from '../../types';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function LocalizedHome({ params }: PageProps) {
  const resolvedParams = use(params);
  const currentLang = resolvedParams.lang === 'en' ? 'en' : 'ar';

  const { language, setLanguage } = useLanguage();
  const isAr = currentLang === 'ar';

  // Keep LanguageContext in sync with the route param
  useEffect(() => {
    if (language !== currentLang) {
      setLanguage(currentLang);
    }
  }, [currentLang, language, setLanguage]);

  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Modals state
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  // Load configurable site content and products from MongoDB
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [content, prods] = await Promise.all([
          fetchSiteContent(),
          fetchProducts(),
        ]);
        if (isMounted) {
          if (content) setSiteContent(content);
          if (prods) setProducts(prods);
        }
      } catch (err) {
        console.error('Failed to fetch site content or products:', err);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically update SEO tags based on route language
  useEffect(() => {
    if (!siteContent?.seo) return;

    const seo = siteContent.seo;
    const title = isAr && seo.metaTitleAr ? seo.metaTitleAr : seo.metaTitle;
    const desc = isAr && seo.metaDescriptionAr ? seo.metaDescriptionAr : seo.metaDescription;
    const kw = isAr && seo.keywordsAr ? seo.keywordsAr : seo.keywords;

    if (title) document.title = title;

    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    if (desc) descMeta.setAttribute('content', desc);

    let kwMeta = document.querySelector('meta[name="keywords"]');
    if (!kwMeta) {
      kwMeta = document.createElement('meta');
      kwMeta.setAttribute('name', 'keywords');
      document.head.appendChild(kwMeta);
    }
    if (kw) kwMeta.setAttribute('content', kw);

    if (seo.ogImage) {
      let ogImgMeta = document.querySelector('meta[property="og:image"]');
      if (!ogImgMeta) {
        ogImgMeta = document.createElement('meta');
        ogImgMeta.setAttribute('property', 'og:image');
        document.head.appendChild(ogImgMeta);
      }
      ogImgMeta.setAttribute('content', seo.ogImage);
    }
  }, [siteContent?.seo, isAr]);

  const handleOpenQuote = useCallback(() => {
    setQuoteModalOpen(true);
  }, []);

  const handleCloseQuote = useCallback(() => {
    setQuoteModalOpen(false);
  }, []);

  const handleOpenAdmin = useCallback(() => {
    setAdminModalOpen(true);
  }, []);

  const handleCloseAdmin = useCallback(() => {
    setAdminModalOpen(false);
  }, []);

  const scrollToRetail = useCallback(() => {
    const el = document.getElementById('retail');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#1E2D4A] selection:text-white">
      {/* 1. Header / Navigation Bar */}
      <Navbar onOpenQuote={handleOpenQuote} />

      {/* 2. Main Content Structured Exactly And ONLY As Required */}
      <main className="flex-1">
        {/* Section 1: Hero Banner (Dynamic Carousel from DB with 10s Autoplay) */}
        <ShowcaseHero
          content={siteContent?.hero}
          slides={siteContent?.heroSlides}
          onOpenQuote={handleOpenQuote}
          onExploreProducts={scrollToRetail}
        />

        {/* Section 2: Stats & Certifications (1997 Founded, +25 Years, 7 Categories, 3 ISO seals) */}
        <ShowcaseStats stats={siteContent?.stats} />

        {/* Section 3: Institutional Solutions (Cards linking to dedicated pages + View More) */}
        <ShowcaseInstitutional
          content={siteContent?.institutional}
          onOpenQuote={handleOpenQuote}
        />

        {/* Section 4: Private Label (Cards linking to dedicated pages + View More) */}
        <ShowcasePrivateLabel
          content={siteContent?.privateLabel}
          onOpenQuote={handleOpenQuote}
        />

        {/* Section 5: Retail Products (Continuous Full-Width Advertising Slider + Detail Pages) */}
        <ShowcaseRetail
          content={siteContent?.retail}
          products={products}
          onExploreProducts={scrollToRetail}
          onOpenQuote={handleOpenQuote}
        />

        {/* Section 6: Why Choose Us (Scientist Lab Card + Value Proposition Points + Request a Quote) */}
        <ShowcaseWhyUs
          content={siteContent?.whyChooseUs}
          onOpenQuote={handleOpenQuote}
        />

        {/* Section 7: Our Brands (Brillant, Savon, Whiff, Power 3) */}
        <ShowcaseBrands
          content={siteContent?.brands}
          onSelectBrand={handleOpenQuote}
        />

        {/* Section 8: Supply Partnership CTA Banner (Navy Rounded Box + Contact Us) */}
        <ShowcaseCtaBanner
          content={siteContent?.partnershipCta}
          onOpenQuote={handleOpenQuote}
        />
      </main>

      {/* 3. Footer */}
      <ShowcaseFooter
        content={siteContent?.footerSettings}
        socialLinks={siteContent?.socialLinks}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating WhatsApp Quick Action */}
      {siteContent?.socialLinks?.whatsapp?.trim() && (
        <a
          href={
            siteContent.socialLinks.whatsapp.trim().startsWith('http')
              ? siteContent.socialLinks.whatsapp.trim()
              : `https://wa.me/${siteContent.socialLinks.whatsapp.trim().replace(/[^0-9]/g, '')}`
          }
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-6 end-6 z-40 w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group cursor-pointer"
          title="WhatsApp"
        >
          <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.19.53-1.11 1.04-1.53 1.1-.38.06-.87.08-1.4-.09-.32-.1-.73-.24-1.26-.47-2.22-.96-3.67-3.21-3.78-3.36-.11-.15-.9-1.2-0.9-2.29 0-1.09.57-1.62.77-1.84.2-.22.44-.28.59-.28.15 0 .3 0 .43.01.14.01.32-.05.5.38.19.45.64 1.56.7 1.68.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-0.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.13 1.11z" />
          </svg>
        </a>
      )}

      {/* Interactive Quotation & Inquiries Modals */}
      <GeneralQuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuote}
      />

      <AdminInquiriesModal
        isOpen={adminModalOpen}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}
