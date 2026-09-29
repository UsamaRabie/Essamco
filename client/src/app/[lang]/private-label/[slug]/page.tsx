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
  Factory,
  Beaker,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const defaultPrivateLabelDetails: Record<string, ShowcaseCard> = {
  'custom-formulation': {
    slug: 'custom-formulation',
    title: 'Custom Chemical Formulation & R&D',
    titleAr: 'تطوير وابتكار التركيبات الكيميائية المخصصة',
    shortDescription: 'Proprietary chemical engineering, fragrance matching, viscosity tuning, and active ingredient optimization.',
    shortDescriptionAr: 'هندسة كيميائية متقدمة، مطابقة العطور، ضبط درجات اللزوجة وتركيز المواد الفعالة بدقة.',
    description: `Our in-house analytical testing laboratory and chemical formulation engineers work hand-in-hand with your brand to create custom detergency, automotive, and biocidal chemical formulations that outperform competing consumer benchmarks. Whether you are aiming for an ultra-concentrated commercial laundry liquid, a pH-neutral high-lubricity car detailing snow foam, or a hospital-grade quaternary biocide, our chemists customize active ingredient percentages, color shades, foam profiles, and European fragrance notes to your exact target specifications.`,
    descriptionAr: `يعمل فريق الكيميائيين ومهندسو البحث والتطوير في مختبرات عصامكو جنباً إلى جنب مع علامتك التجارية لتطوير تركيبات ومنظفات مبتكرة تتفوق على المنتجات المنافسة في السوق. سواء كنت تستهدف إنتاج سوائل غسيل ملابس فائقة التركيز، أو شامبو سيارات رغوي متعادل الحموضة بتقنية النانو، أو مطهرات طبية معتمدة، نقوم بضبط نسب المادة الفعالة، واللون، ودرجة اللزوجة، والرائحة العطرية الأوروبية بدقة لتطابق رؤيتك وسعر التكلفة المستهدف لمنتجك.`,
    image: '/images/showcase/custom_formulation.png',
    images: [
      '/images/showcase/custom_formulation.png',
      '/images/facilities/lab-beakers.jpg',
      '/images/facilities/lab-scientist.jpg',
    ],
    features: [
      'Dedicated laboratory bench formulation and spectrophotometric validation',
      'Viscosity, pH, active matter, and specific gravity optimization',
      'Accelerated oven stability and freeze-thaw cycle testing',
      'European fragrance oil matching and long-lasting scent retention',
      'Full intellectual property protection & non-disclosure agreements (NDA)',
    ],
    featuresAr: [
      'تطوير مخبري حصري مع فحص التوافق الكيميائي والتحليل الطيفي',
      'ضبط دقيق للرقم الهيدروجيني (pH)، واللزوجة، والمادة الفعالة والكثافة',
      'اختبارات الثبات الحراري المتسارع ومقاومة الترسيب والتجمد',
      'مطابقة الزيوت العطرية الأوروبية وضمان ثبات الرائحة بعد الاستخدام',
      'حماية قانونية تامة للملكية الفكرية وتوقيع اتفاقيات سرية مسبقة (NDA)',
    ],
    badge: 'R&D Lab',
    badgeAr: 'مختبر أبحاث',
  },
  'branding-manufacturing': {
    slug: 'branding-manufacturing',
    title: 'Your Branding, Our World-Class Manufacturing',
    titleAr: 'علامتك التجارية وهندستنا الصناعية المتطورة',
    shortDescription: 'Complete end-to-end OEM production: bottle design, professional labelling, and automated packaging.',
    shortDescriptionAr: 'تصنيع شامل من الألف إلى الياء: تصميم القوالب، طباعة الملصقات، وتعبئة وتغليف آلي.',
    description: `Transform your chemical brand concept into production reality through Essamco turnkey OEM contract manufacturing infrastructure. We take care of raw material supply chains, automated blending inside high-capacity 316 stainless-steel reactors, high-speed rotary and inline bottling, induction heat-foil cap sealing, automated front/back labeling, inkjet lot code and expiry printing, and automated shrink-wrap carton packaging under your brand visual identity.`,
    descriptionAr: `حول فكرة علامتك التجارية إلى واقع إنتاجي ملموس عبر البنية التحتية المتطورة لمصانع عصامكو. نتولى شراء واستيراد أنقى المواد الخام، والخلط الآلي في مفاعلات ستانلس ستيل 316 عملاقة، والتعبئة السريعة، واللحام الحثي للأغطية، والتوسيم الأوتوماتيكي بالملصقات، وطباعة أرقام التشغيلات وتواريخ الصلاحية، والتغليف الكرتوني الآلي بالكامل تحت هويتك التجارية.`,
    image: '/images/showcase/branding_manufacturing.png',
    images: [
      '/images/showcase/branding_manufacturing.png',
      '/images/facilities/factory-tanks.jpg',
      '/images/facilities/warehouse.jpg',
    ],
    features: [
      'High-speed automated bottling and labeling lines handling multiple bottle shapes',
      'Capacity exceeding 50+ metric tons of chemical formulations daily',
      'Multi-stage in-line quality assurance checks preventing packaging leaks',
      'Tamper-proof induction foil cap sealing for extended shelf stability',
      'Direct turnkey delivery to your distribution hubs or port terminals for export',
    ],
    featuresAr: [
      'خطوط تعبئة وتوسيم آلية عالية السرعة تتعامل مع مختلف أشكال العبوات',
      'طاقة إنتاجية كبرى تتجاوز 50 طناً يومياً تلبي احتياجات الأسواق المحلية والتصدير',
      'فحص ومراقبة جودة متعدد المراحل يمنع أي تسريب أو عيوب تغليف',
      'لحام حراري حثي للأغطية لحماية السائل من الأكسدة وضمان فترة صلاحية طويلة',
      'تسليم مباشر وسريع لمستودعات التوزيع الخاصة بك أو موانئ الشحن للتصدير',
    ],
    badge: 'Turnkey OEM',
    badgeAr: 'تصنيع متكامل',
  },
  'min-order-quantities': {
    slug: 'min-order-quantities',
    title: 'Flexible Minimum Order Quantities (MOQs)',
    titleAr: 'كميات طلب مرنة لدعم الشركات الناشئة والنمو',
    shortDescription: 'Scalable batch volumes enabling new brands to launch efficiently and expand progressively.',
    shortDescriptionAr: 'دفعات إنتاج مرنة تمكن العلامات الجديدة من الانطلاق وتتيح للشركات القائمة التوسع بسلاسة.',
    description: `We believe in empowering emerging entrepreneurs and expanding brands without imposing prohibitive barrier-to-entry costs. Unlike traditional mega-plants that demand astronomical first-batch order quantities, Essamco offers scalable tiered Minimum Order Quantities (MOQs). This enables startup brands, e-commerce retailers, and detailing franchises to test market response, refine packaging, validate pricing, and scale up batch sizes smoothly as distribution channels grow.`,
    descriptionAr: `نؤمن بتمكين رواد الأعمال وأصحاب المشاريع والعلامات التجارية الطموحة دون فرض اشتراطات تعجيزية. على عكس المصانع الكبرى التي تطلب كميات تشغيل ضخمة، توفر عصامكو كميات دنيا مرنة للطلبيات (MOQs) تمكن العلامات الناشئة ومتاجر التجارة الإلكترونية ومراكز العناية بالسيارات من اختبار السوق، وتطوير المنتجات، ثم زيادة الإنتاج تدريجياً مع اتساع رقعة التوزيع.`,
    image: '/images/showcase/min_order_quantities.png',
    images: [
      '/images/showcase/min_order_quantities.png',
      '/images/facilities/warehouse.jpg',
      '/images/showcase/bulk_contracts.png',
    ],
    features: [
      'Accessible entry-tier production batch sizes designed for product launches',
      'Fast repeat-order turnaround times preventing retail stock-outs',
      'Scale-up tiered discounts with progressively lower unit cost as order volume grows',
      'Regulatory dossier support for Ministry of Health registrations and Barcoding',
      'Warehousing and buffer stock management options available at our Cairo plant',
    ],
    featuresAr: [
      'دفعات إنتاج أولى ميسرة ومصممة خصيصاً لاختبار السوق وإطلاق العلامات الجديدة',
      'سرعة استثنائية في إعادة الإنتاج والتوريد لتجنب نفاد مخزونك في الأسواق',
      'تدرج تصاعدي في التخفيضات السعرية للوحدة مع نمو حجم طلباتك',
      'دعم كامل للتسجيل والتراخيص بوزارة الصحة وهيئة سلامة الدواء وإصدار الباركود',
      'خيارات تخزين وإدارة مخزون أمان في مستودعاتنا المركزية بالقاهرة',
    ],
    badge: 'Agile Scale',
    badgeAr: 'مرونة كاملة',
  },
};

export default function PrivateLabelDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const currentLang = resolvedParams.lang === 'en' ? 'en' : 'ar';
  const slug = resolvedParams.slug;

  const { language, setLanguage } = useLanguage();
  const isAr = currentLang === 'ar';

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

  // Find service from MongoDB or fallback
  const dbService = siteContent?.privateLabel?.cards?.find((c) => c.slug === slug);
  const service: ShowcaseCard = dbService || defaultPrivateLabelDetails[slug] || {
    slug,
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    titleAr: 'خدمة تصنيع مخصصة للغير',
    description: 'Custom contract manufacturing and private label chemical formulation service.',
    descriptionAr: 'خدمات تصنيع كيميائي وتعبئة وتغليف مخصصة لحساب الغير بأعلى المعايير.',
    image: '/images/showcase/custom_formulation.png',
    images: ['/images/showcase/custom_formulation.png', '/images/facilities/lab-beakers.jpg'],
    badge: 'OEM Service',
    badgeAr: 'خدمة OEM',
    features: ['Custom chemical formulation', 'Automated bottling lines', 'Strict quality control'],
    featuresAr: ['تركيبات كيميائية مخصصة', 'خطوط تعبئة وتوسيم آلية', 'فحص جودة صارم'],
  };

  const title = isAr && service.titleAr ? service.titleAr : service.title;
  const description = isAr && service.descriptionAr ? service.descriptionAr : service.description;
  const features = isAr && service.featuresAr && service.featuresAr.length > 0 ? service.featuresAr : service.features || [];
  const badge = isAr && service.badgeAr ? service.badgeAr : service.badge;

  const galleryImages =
    service.images && service.images.length > 0
      ? service.images
      : [service.image, '/images/facilities/lab-beakers.jpg', '/images/facilities/factory-tanks.jpg'];

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
              <Link href={`/${currentLang}/private-label`} className="hover:text-blue-700 transition-colors">
                {isAr ? 'التصنيع للغير' : 'Private Label'}
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

            {/* Right Column: Service Overview (Desktop 6 cols) */}
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
                    <Factory className="w-5 h-5 text-blue-700" />
                    <span>{isAr ? 'مزايا وإمكانيات خط الإنتاج' : 'Manufacturing Capabilities & Standards'}</span>
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

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="#quote-form-section"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1E2D4A] hover:bg-[#152035] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all text-center cursor-pointer"
                >
                  {isAr ? 'طلب تسعير تصنيع خاص' : 'Request Private Label Quotation'}
                </a>

                <a
                  href="https://wa.me/201001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'تواصل مع مهندس التركيبات' : 'Chat with Formulation Engineer'}</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Embedded Quotation & Contact Form on the SAME Page */}
        <section className="py-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceQuoteForm
            defaultSubject={service.title}
            defaultSubjectAr={service.titleAr}
            itemType="privateLabel"
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
