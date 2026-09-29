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
import { fetchSiteContent } from '../../../lib/api';
import { SiteContent, ShowcaseCard } from '../../../types';
import { ArrowLeft, ArrowRight, ShieldCheck, ChevronRight, CheckCircle2, FileText, Factory, Hospital, PackageCheck } from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function InstitutionalListingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const currentLang = resolvedParams.lang === 'en' ? 'en' : 'ar';
  const { language, setLanguage } = useLanguage();
  const isAr = currentLang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (language !== currentLang) {
      setLanguage(currentLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang]);

  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    fetchSiteContent().then((content) => {
      if (content) setSiteContent(content);
    });
  }, []);

  const defaultCards: ShowcaseCard[] = [
    {
      slug: 'bulk-contracts',
      title: 'Bulk Contracts & Institutional Supply',
      titleAr: 'عقود التوريد والمبيعات المؤسسية الكبرى',
      shortDescription: 'Long-term bulk supply agreements with flexible scheduling for hospitals, hotels, and industrial plants.',
      shortDescriptionAr: 'اتفاقيات توريد بالجملة مجدولة وموثوقة للمستشفيات، الفنادق، المصانع، والمؤسسات الكبرى.',
      description: 'Essamco provides comprehensive institutional supply contracts designed for high-consumption entities including university hospitals, luxury resort chains, public transport fleets, and industrial manufacturers.',
      descriptionAr: 'تقدم عصامكو عقود توريد مؤسسية شاملة مصممة خصيصاً للجهات ذات الاستهلاك الضخم مع استقرار كامل في الإمداد وأسعار تفضيلية.',
      image: '/images/showcase/bulk_contracts.png',
      images: ['/images/showcase/bulk_contracts.png', '/images/facilities/warehouse.jpg'],
      badge: 'High Capacity',
      badgeAr: 'طاقة كبرى',
      features: [
        'Guaranteed continuous chemical delivery schedules',
        'Volume-tiered institutional wholesale pricing',
        'Certified dedicated hazardous chemical transport fleet',
        'Quality assurance batch certificates with every shipment',
      ],
      featuresAr: [
        'تسليمات مجدولة شهرية وربع سنوية تضمن استمرار العمليات',
        'خصومات حجمية وتسهيلات تجارية مخصصة للجهات الكبرى',
        'أسطول شحن وتوزيع كيميائي معتمد وسريع',
        'شهادات فحص ومطابقة مخبرية مرفقة مع كل شحنة',
      ],
    },
    {
      slug: 'custom-packaging',
      title: 'Custom Packaging & Volume Sizes',
      titleAr: 'التعبئة المخصصة والأحجام المختلفة',
      shortDescription: 'Tailored container formats from 1L retail bottles to 20L canisters, 200L drums and 1000L IBC totes.',
      shortDescriptionAr: 'أحجام وعبوات متعددة تبدأ من عبوات 1 لتر وحتى جراكن 20 لتر، براميل 200 لتر، وخزانات IBC سعة 1000 لتر.',
      description: 'Every facility has unique dispensing and storage requirements. Essamco delivers full packaging customization options tailored to automated dilution stations and commercial kitchens.',
      descriptionAr: 'تختلف متطلبات التخزين والاستخدام من منشأة لأخرى. لذلك توفر عصامكو خيارات تعبئة مرنة متوافقة مع محطات التخفيف والورش والمطابخ.',
      image: '/images/showcase/custom_packaging.png',
      images: ['/images/showcase/custom_packaging.png', '/images/facilities/factory-tanks.jpg'],
      badge: 'Flexible Sizes',
      badgeAr: 'أحجام مرنة',
      features: [
        'Heavy-duty HDPE containers resistant to chemical degradation',
        'Bilingual labelling with clear dilution charts',
        'Tamper-evident vented caps for safe transport',
        'Compatible with commercial wall-mounted dosing dispensers',
      ],
      featuresAr: [
        'عبوات بولي إيثيلين HDPE عالية الكثافة ومقاومة للتآكل الكيميائي',
        'ملصقات ثنائية اللغة ببيانات واضحة ونسب التخفيف الموصى بها',
        'أغطية أمان بصمام تنفيس لضمان سلامة النقل والتخزين',
        'متوافقة مع محطات الخلط والتوزيع الجدارية الآلية',
      ],
    },
    {
      slug: 'safety-sheets',
      title: 'Safety Data Sheets (MSDS) & ISO Certifications',
      titleAr: 'صحائف بيانات السلامة (MSDS) وتوثيق الآيزو',
      shortDescription: 'Full technical documentation, MoH registrations, and GHS-compliant Material Safety Data Sheets.',
      shortDescriptionAr: 'ملفات فنية كاملة، اعتمادات وزارة الصحة، وصحائف بيانات سلامة المواد المتوافقة مع النظام العالمي المتوافق (GHS).',
      description: 'Institutional compliance requires rigorous documentation. Essamco equips all corporate clients with accredited Material Safety Data Sheets (MSDS), certificates of analysis (CoA), and ISO standards.',
      descriptionAr: 'تتطلب معايير الجودة والرقابة المؤسسية توثيقاً صارماً. توفر عصامكو ملفات بيانات سلامة المواد (MSDS) المعتمدة وشهادات التحليل والآيزو.',
      image: '/images/showcase/safety_sheets.png',
      images: ['/images/showcase/safety_sheets.png', '/images/facilities/lab-beakers.jpg'],
      badge: 'Certified',
      badgeAr: 'معتمد رسمياً',
      features: [
        'Standard 16-section GHS Material Safety Data Sheets (MSDS)',
        'Accredited ISO 9001:2015, ISO 14001:2015, ISO 45001:2018 audit trails',
        'Egyptian Ministry of Health official biocidal registrations',
        'Chemical safety training seminars for housekeeping teams',
      ],
      featuresAr: [
        'صحائف بيانات سلامة المواد GHS MSDS القياسية المكونة من 16 قسماً',
        'شهادات آيزو موثقة: ISO 9001، ISO 14001، ISO 45001',
        'تسجيلات وتراخيص وزارة الصحة المصرية للمطهرات والمبيدات الحيوية',
        'دورات تدريبية متخصصة لفرق العمل على الاستخدام الآمن والتخفيف',
      ],
    },
  ];

  const cards: ShowcaseCard[] =
    siteContent?.institutional?.cards && siteContent.institutional.cards.length > 0
      ? siteContent.institutional.cards.map((c, i) => ({
          ...c,
          slug: c.slug || defaultCards[i]?.slug || `institutional-${i + 1}`,
          features: c.features || defaultCards[i]?.features || [],
          featuresAr: c.featuresAr || defaultCards[i]?.featuresAr || [],
        }))
      : defaultCards;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#1E2D4A] selection:text-white">
      <Navbar onOpenQuote={() => setQuoteOpen(true)} />

      <main className="flex-1">
        {/* Hero Banner Header */}
        <section className="bg-gradient-to-b from-[#EEF3F7] to-white py-12 sm:py-16 border-b border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
              <Link href={`/${currentLang}`} className="hover:text-blue-700 transition-colors">
                {isAr ? 'الرئيسية' : 'Home'}
              </Link>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${isAr ? 'rotate-180' : ''}`} />
              <span className="text-slate-900 font-bold">
                {isAr ? 'الحلول المؤسسية' : 'Institutional Solutions'}
              </span>
            </nav>

            <div className="max-w-3xl text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1E2D4A] border border-blue-200 text-xs font-bold mb-3.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>{isAr ? 'توريد كيميائي بالجملة ومعايير آيزو' : 'Bulk Chemical Supply & ISO Standards'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {isAr ? 'الحلول المؤسسية والتوريدات الكيميائية الكبرى' : 'Institutional Chemical Solutions & Bulk Supply'}
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {isAr
                  ? 'منظومات نظافة وتطهير متكاملة مصممة خصيصاً للقطاعات الطبية والتعليمية والفندقية والمجمعات الصناعية. نضمن أعلى كفاءة تطهير ومطابقة كاملة للاشتراطات البيئية والصحية مع استقرار الإمداد.'
                  : 'Comprehensive hygiene and disinfection systems tailored for healthcare, hospitality, education, and heavy manufacturing. Designed to guarantee high biosecurity and compliance with international standards.'}
              </p>
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, idx) => {
              const title = isAr && card.titleAr ? card.titleAr : card.title;
              const shortDesc = isAr && card.shortDescriptionAr ? card.shortDescriptionAr : card.shortDescription || card.description;
              const features = isAr && card.featuresAr && card.featuresAr.length > 0 ? card.featuresAr : card.features || [];
              const badge = isAr && card.badgeAr ? card.badgeAr : card.badge;

              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Card Image */}
                  <div className="relative w-full h-56 bg-slate-900 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    {badge && (
                      <span className="absolute top-4 start-4 px-3 py-1 rounded-full bg-[#1E2D4A]/90 text-white text-xs font-bold shadow-md backdrop-blur-xs">
                        {badge}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between text-start">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                        {title}
                      </h2>
                      {shortDesc && (
                        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          {shortDesc}
                        </p>
                      )}

                      {/* Features List */}
                      {features.length > 0 && (
                        <ul className="mt-4 space-y-2 pt-4 border-t border-slate-100">
                          {features.slice(0, 3).map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Bottom CTA to Single Solution Page */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/${currentLang}/institutional/${card.slug}`}
                        className="w-full py-3 rounded-full bg-[#1E2D4A] hover:bg-[#152035] text-white text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer"
                      >
                        <span>{isAr ? 'عرض التفاصيل والصور' : 'View Full Details & Photos'}</span>
                        <ArrowIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Inquiry / Quote Request Form Section */}
        <section className="py-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceQuoteForm
            defaultSubject={isAr ? 'الحلول المؤسسية والتوريد بالجملة' : 'Institutional Solutions & Bulk Supply Tenders'}
            itemType="solution"
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
