'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../../context/LanguageContext';
import { Navbar } from '../../../../components/Navbar';
import { ShowcaseFooter } from '../../../../components/ShowcaseFooter';
import { MultiImageGallery } from '../../../../components/MultiImageGallery';
import { ServiceQuoteForm } from '../../../../components/ServiceQuoteForm';
import { GeneralQuoteModal } from '../../../../components/GeneralQuoteModal';
import { fetchSiteContent } from '../../../../lib/api';
import { SiteContent, ShowcaseCard } from '../../../../types';
import {
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  FileText,
  Building2,
  Clock,
  Sparkles,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const defaultInstitutionalDetails: Record<string, ShowcaseCard> = {
  'bulk-contracts': {
    slug: 'bulk-contracts',
    title: 'Bulk Contracts & Institutional Supply',
    titleAr: 'عقود التوريد والمبيعات المؤسسية الكبرى',
    shortDescription: 'Long-term bulk supply agreements with flexible scheduling for hospitals, hotels, and industrial plants.',
    shortDescriptionAr: 'اتفاقيات توريد بالجملة مجدولة وموثوقة للمستشفيات، الفنادق، المصانع، والمؤسسات الكبرى.',
    description: `Essamco provides comprehensive institutional supply contracts designed for high-consumption entities including university hospitals, luxury resort chains, public transport fleets, and industrial manufacturers. We ensure guaranteed supply stability, dedicated account managers, priority batch manufacturing, and customized payment terms with tiered volume discounts. Every batch is rigorously tested in our analytical laboratories, and delivery is managed via certified chemical distribution logistics.`,
    descriptionAr: `تقدم عصامكو عقود توريد مؤسسية شاملة ومصممة خصيصاً لتلبية متطلبات الجهات ذات الاستهلاك الضخم مثل المستشفيات الجامعية، سلاسل الفنادق والمنتجعات، أساطيل النقل، والمجمعات الصناعية. نضمن استقرار الإمداد على مدار العام، وتعيين مدير حساب فني متخصص، وأولوية في خطوط الإنتاج وجداول تسليم مرنة بأسعار تنافسية مخفضة. يتم فحص كل تشغيلة مخبرياً بدقة وتسليمها بأسطول شحن كيميائي مجهز ومطابق لمعايير السلامة.`,
    image: '/images/showcase/bulk_contracts.png',
    images: [
      '/images/showcase/bulk_contracts.png',
      '/images/facilities/warehouse.jpg',
      '/images/facilities/factory-tanks.jpg',
    ],
    features: [
      'Scheduled monthly and quarterly deliveries ensuring zero operational downtime',
      'Volume-tiered institutional wholesale pricing with extended credit facilities',
      'Dedicated hazardous materials transport fleet with emergency spill protocols',
      'Batch certificates of analysis (CoA) and MSDS documentation with every consignment',
      'On-site chemical safety audits and consumption rate optimization seminars',
    ],
    featuresAr: [
      'تسليمات مجدولة شهرية وربع سنوية تضمن استمرار العمليات دون توقف',
      'خصومات حجمية وتسهيلات سداد تجارية مخصصة للجهات والمؤسسات الكبرى',
      'أسطول شحن وتوزيع كيميائي معتمد ومجهز بأحدث أنظمة الأمان والسلامة',
      'شهادات تحليل مخبري (CoA) وصحائف سلامة (MSDS) مع كل شحنة',
      'زيارات استشارية لمراجعة معدلات الاستهلاك وتدريب فرق العمل على الاستخدام الأمثل',
    ],
    badge: 'High Capacity',
    badgeAr: 'طاقة إنتاجية كبرى',
  },
  'custom-packaging': {
    slug: 'custom-packaging',
    title: 'Custom Packaging & Volume Sizes',
    titleAr: 'التعبئة المخصصة والأحجام المختلفة للمنشآت',
    shortDescription: 'Tailored container formats from 1L retail bottles to 20L canisters, 200L drums and 1000L IBC totes.',
    shortDescriptionAr: 'أحجام وعبوات متعددة تبدأ من عبوات 1 لتر وحتى جراكن 20 لتر، براميل 200 لتر، وخزانات IBC سعة 1000 لتر.',
    description: `Every facility has unique dispensing and storage requirements. Essamco delivers full packaging customization options tailored to automated dilution stations, industrial workshops, and commercial kitchens. All containers comply with international hazardous materials transport regulations (UN Certified) and feature ergonomic handles, tamper-evident vented caps, and durable high-density polyethylene (HDPE) construction resistant to aggressive surfactants and oxidizers.`,
    descriptionAr: `تختلف متطلبات التخزين والاستخدام من منشأة لأخرى. لذلك توفر عصامكو خيارات تعبئة مرنة متوافقة مع محطات التخفيف الآلية، الورش الصناعية، والمطابخ التجارية. جميع العبوات مصنعة من بولي إيثيلين عالي الكثافة (HDPE) فائق المقاومة للمركبات الكيميائية، ومزودة بأغطية أمان بصمام تنفيس ومقابض مريحة مطابقة للمواصفات الدولية لنقل وتخزين المواد الكيميائية بأمان تام.`,
    image: '/images/showcase/custom_packaging.png',
    images: [
      '/images/showcase/custom_packaging.png',
      '/images/facilities/factory-tanks.jpg',
      '/images/facilities/warehouse.jpg',
    ],
    features: [
      'Heavy-duty HDPE containers resistant to chemical degradation and drop impact',
      'Clear bilingual labeling with precise dilution ratios and GHS hazard pictograms',
      'Tamper-evident vented caps preventing container bloating during transport and storage',
      'Universal thread fittings compatible with commercial wall-mounted dispensing systems',
      'Private label branding options with corporate logo embossing for enterprise fleets',
    ],
    featuresAr: [
      'عبوات بولي إيثيلين HDPE عالية الكثافة مقاومة للصدمات والتآكل الكيميائي',
      'ملصقات ثنائية اللغة ببيانات واضحة ونسب التخفيف الموصى بها ورموز السلامة',
      'أغطية أمان بصمام تنفيس لضمان سلامة النقل والتخزين ومنع الانتفاخ',
      'فوهات قياسية متوافقة تماماً مع محطات الخلط والتوزيع الجدارية الآلية',
      'إمكانية طباعة وتثبيت شعار شركتك على العبوات للأساطيل والمؤسسات الكبرى',
    ],
    badge: 'Flexible Sizes',
    badgeAr: 'أحجام مرنة',
  },
  'safety-sheets': {
    slug: 'safety-sheets',
    title: 'Safety Data Sheets (MSDS) & ISO Certifications',
    titleAr: 'صحائف بيانات السلامة (MSDS) وتوثيق الآيزو والاعتمادات',
    shortDescription: 'Full technical documentation, MoH registrations, and GHS-compliant Material Safety Data Sheets.',
    shortDescriptionAr: 'ملفات فنية كاملة، اعتمادات وزارة الصحة، وصحائف بيانات سلامة المواد المتوافقة مع النظام العالمي المتوافق (GHS).',
    description: `Institutional compliance requires rigorous documentation and full transparency. Essamco equips all corporate partners with accredited Material Safety Data Sheets (MSDS), certificates of analysis (CoA) for each production lot, official Egyptian Ministry of Health registrations, and comprehensive ISO audit trails. We help hospitals, food processing facilities, and multinational operations breeze through JCI, HACCP, and environmental audits with complete chemical traceability.`,
    descriptionAr: `تتطلب معايير الجودة والرقابة المؤسسية توثيقاً صارماً وشفافية كاملة. توفر عصامكو لكافة عملائها ملفات بيانات سلامة المواد (MSDS) المعتمدة، وشهادات التحليل المخبري (CoA) لكل تشغيلة، واعتمادات وزارة الصحة المصرية، وشهادات الآيزو (ISO 9001:2015, ISO 14001:2015, ISO 45001:2018). نساعد المستشفيات والمصانع على اجتياز تفتيشات الجودة والاعتماد الدولي (مثل JCI وHACCP) بكل سهولة وموثوقية.`,
    image: '/images/showcase/safety_sheets.png',
    images: [
      '/images/showcase/safety_sheets.png',
      '/images/facilities/lab-beakers.jpg',
      '/images/facilities/lab-scientist.jpg',
    ],
    features: [
      'Standard 16-section GHS Material Safety Data Sheets available in English and Arabic',
      'Accredited ISO 9001:2015 Quality and ISO 14001:2015 Environmental certification',
      'Certified ISO 45001:2018 Occupational Health and Safety management systems',
      'Egyptian Ministry of Health official biocidal and disinfectant registration licenses',
      'Custom technical dossiers prepared for hospital accreditation and green building tenders',
    ],
    featuresAr: [
      'صحائف بيانات سلامة المواد GHS MSDS القياسية المكونة من 16 قسماً باللغتين',
      'شهادات آيزو موثقة: ISO 9001 للجودة، وISO 14001 للبيئة، وISO 45001 للسلامة والصحة المهنية',
      'تسجيلات وتراخيص وزارة الصحة المصرية الرسمية للمطهرات والمنظفات الطبية',
      'ملفات فنية متكاملة جاهزة لاشتراطات الاعتماد الصحي ولجان التفتيش البيئي',
      'دعم فني واستشارات مجانية لبروتوكولات الأمان الحيوي والتعقيم',
    ],
    badge: 'Certified',
    badgeAr: 'معتمد رسمياً',
  },
};

export default function InstitutionalDetailPage({ params }: PageProps) {
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

  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    fetchSiteContent().then((content) => {
      if (content) setSiteContent(content);
    });
  }, []);

  // Find solution from MongoDB siteContent or fallback to default
  const dbSolution = siteContent?.institutional?.cards?.find((c) => c.slug === slug);
  const solution: ShowcaseCard = dbSolution || defaultInstitutionalDetails[slug] || {
    slug,
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    titleAr: 'حلول مؤسسية متقدمة',
    description: 'Custom institutional cleaning and chemical supply solution.',
    descriptionAr: 'حلول كيميائية ومنظفات صناعية متطورة تلبي احتياجات المنشآت الكبرى.',
    image: '/images/showcase/bulk_contracts.png',
    images: ['/images/showcase/bulk_contracts.png', '/images/facilities/warehouse.jpg'],
    badge: 'Institutional',
    badgeAr: 'مؤسسي',
    features: ['Custom institutional supply', 'ISO certified standards', 'Batch testing certificates'],
    featuresAr: ['توريد مخصص للمؤسسات', 'معايير جودة آيزو', 'شهادات فحص مخبري'],
  };

  const title = isAr && solution.titleAr ? solution.titleAr : solution.title;
  const description = isAr && solution.descriptionAr ? solution.descriptionAr : solution.description;
  const features = isAr && solution.featuresAr && solution.featuresAr.length > 0 ? solution.featuresAr : solution.features || [];
  const badge = isAr && solution.badgeAr ? solution.badgeAr : solution.badge;

  // Prepare images array
  const galleryImages =
    solution.images && solution.images.length > 0
      ? solution.images
      : [solution.image, '/images/facilities/warehouse.jpg', '/images/facilities/factory-tanks.jpg'];

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
              <Link href={`/${currentLang}/institutional`} className="hover:text-blue-700 transition-colors">
                {isAr ? 'الحلول المؤسسية' : 'Institutional Solutions'}
              </Link>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${isAr ? 'rotate-180' : ''}`} />
              <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">
                {title}
              </span>
            </nav>
          </div>
        </section>

        {/* Main Details & Multi-Image Gallery Stage */}
        <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Multi-Image Interactive Gallery (Desktop 6 cols) */}
            <div className="lg:col-span-6 w-full">
              <MultiImageGallery images={galleryImages} alt={title} />
            </div>

            {/* Right Column: Comprehensive Solution Overview (Desktop 6 cols) */}
            <div className="lg:col-span-6 flex flex-col text-start">
              {badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1E2D4A] border border-blue-200 text-xs font-bold mb-4 self-start">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{badge}</span>
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                {title}
              </h1>

              <div className="mt-5 text-sm sm:text-[15px] text-slate-700 leading-relaxed font-normal whitespace-pre-line space-y-4">
                <p>{description}</p>
              </div>

              {/* Key Features Bulleted Checklist */}
              {features.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-700" />
                    <span>{isAr ? 'أبرز المزايا والمواصفات المعتمدة' : 'Certified Features & Specifications'}</span>
                  </h2>
                  <ul className="space-y-3">
                    {features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Jump to Quote Form */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="#quote-form-section"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1E2D4A] hover:bg-[#152035] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all text-center cursor-pointer"
                >
                  {isAr ? 'طلب تسعير لهذا الحل الآن' : 'Request Pricing For This Solution'}
                </a>

                <a
                  href="https://wa.me/201001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'محادثة واتساب فورية' : 'Chat via WhatsApp'}</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Embedded Quotation & Contact Form for this Solution on the SAME Page */}
        <section className="py-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceQuoteForm
            defaultSubject={solution.title}
            defaultSubjectAr={solution.titleAr}
            itemType="solution"
            itemId={slug}
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
