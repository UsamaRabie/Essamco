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
import { ArrowLeft, ArrowRight, ShieldCheck, ChevronRight, CheckCircle2, Factory, Sparkles, Beaker, Check } from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function PrivateLabelListingPage({ params }: PageProps) {
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
      slug: 'custom-formulation',
      title: 'Custom Chemical Formulation & R&D',
      titleAr: 'تطوير وابتكار التركيبات الكيميائية المخصصة',
      shortDescription: 'Proprietary chemical engineering, fragrance matching, viscosity tuning, and active ingredient optimization.',
      shortDescriptionAr: 'هندسة كيميائية متقدمة، مطابقة العطور، ضبط درجات اللزوجة وتركيز المواد الفعالة بدقة.',
      description: 'Our in-house laboratory chemists work with your brand to formulate bespoke chemical cleaning, detailing, and disinfection products that outperform market benchmarks.',
      descriptionAr: 'يعمل فريق الكيميائيين في مختبرات عصامكو المتطورة لتطوير تركيبات كيميائية ومنظفات فريدة تفوق المنتجات المنافسة بأعلى جودة.',
      image: '/images/showcase/custom_formulation.png',
      images: ['/images/showcase/custom_formulation.png', '/images/facilities/lab-beakers.jpg'],
      badge: 'R&D Lab',
      badgeAr: 'مختبر أبحاث',
      features: [
        'Full analytical laboratory with spectrophotometry and titration testing',
        'Proprietary active ingredient formulation tailored to target price points',
        'Accelerated stability, temperature, and shelf-life testing',
        'Complete intellectual property protection & non-disclosure agreements (NDA)',
      ],
      featuresAr: [
        'مختبر تحليلي مجهز بأحدث أجهزة قياس الطيف والمعايرة الدقيقة',
        'تركيبات حصرية مطورة لتلائم الفئة السعرية المستهدفة لعلامتك',
        'اختبارات الثبات المتسارع وفترات الصلاحية وتحمل درجات الحرارة',
        'حماية كاملة للملكية الفكرية واتفاقيات سرية المعلومات (NDA)',
      ],
    },
    {
      slug: 'branding-manufacturing',
      title: 'Your Branding, Our World-Class Manufacturing',
      titleAr: 'علامتك التجارية وهندستنا الصناعية المتطورة',
      shortDescription: 'Complete end-to-end OEM production: bottle design, professional labelling, and automated packaging.',
      shortDescriptionAr: 'تصنيع شامل من الألف إلى الياء: تصميم القوالب، طباعة الملصقات، وتعبئة وتغليف آلي.',
      description: 'Bring your product vision to life with Essamco contract manufacturing infrastructure. We handle raw material sourcing, automated blending in pharmaceutical-grade reactors, precision bottling, and packaging.',
      descriptionAr: 'حول فكرة منتجك إلى واقع ملموس مع البنية الصناعية الضخمة لعصامكو ومفاعلات الستانلس ستيل الآلية وخطوط التعبئة فائقة السرعة.',
      image: '/images/showcase/branding_manufacturing.png',
      images: ['/images/showcase/branding_manufacturing.png', '/images/facilities/factory-tanks.jpg'],
      badge: 'Turnkey OEM',
      badgeAr: 'تصنيع متكامل',
      features: [
        'High-speed automated bottling and labeling lines',
        'Capacity exceeding 50+ metric tons of chemical formulations daily',
        'Strict multi-stage batch quality control inspections',
        'Turnkey delivery directly to your central distribution warehouses',
      ],
      featuresAr: [
        'خطوط تعبئة وتوسيم آلية عالية السرعة والدقة',
        'طاقة إنتاجية تتجاوز 50 طناً يومياً تلبي أكبر الطلبيات',
        'فحص ومراقبة جودة متعدد المراحل لكل دفعة إنتاج',
        'تسليم جاهز ومباشر لمستودعات التوزيع المركزية الخاصة بك',
      ],
    },
    {
      slug: 'min-order-quantities',
      title: 'Flexible Minimum Order Quantities (MOQs)',
      titleAr: 'كميات طلب مرنة لدعم الشركات الناشئة والنمو',
      shortDescription: 'Scalable batch volumes enabling new brands to launch efficiently and expand progressively.',
      shortDescriptionAr: 'دفعات إنتاج مرنة تمكن العلامات الجديدة من الانطلاق وتتيح للشركات القائمة التوسع بسلاسة.',
      description: 'We believe in fostering entrepreneurship and agile brand development with tiered minimum order quantities (MOQs) allowing startup brands to test market demand and scale seamlessly.',
      descriptionAr: 'نؤمن بدعم رواد الأعمال وتوسيع العلامات التجارية الطموحة. نوفر كميات دنيا مرنة للطلبيات (MOQs) تتيح للعلامات الجديدة اختبار السوق والتوسع.',
      image: '/images/showcase/min_order_quantities.png',
      images: ['/images/showcase/min_order_quantities.png', '/images/facilities/warehouse.jpg'],
      badge: 'Agile Scale',
      badgeAr: 'مرونة كاملة',
      features: [
        'Accessible entry tier order volumes for initial product launches',
        'Fast re-order turnaround times to prevent stock-outs',
        'Scale-up path with progressively lower unit costs as volume rises',
        'Comprehensive guidance on regulatory registration and consumer packaging',
      ],
      featuresAr: [
        'كميات بداية ميسرة لاختبار السوق وإطلاق المنتجات الأولى',
        'سرعة عالية في إعادة الإنتاج والتوريد لتجنب نفاد المخزون',
        'تدرج في انخفاض تكلفة الوحدة مع زيادة أحجام الطلبيات',
        'استشارات قانونية وفنية لتسجيل المنتجات والحصول على التراخيص',
      ],
    },
  ];

  const cards: ShowcaseCard[] =
    siteContent?.privateLabel?.cards && siteContent.privateLabel.cards.length > 0
      ? siteContent.privateLabel.cards.map((c, i) => ({
          ...c,
          slug: c.slug || defaultCards[i]?.slug || `private-label-${i + 1}`,
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
                {isAr ? 'التصنيع للغير' : 'Private Label & OEM'}
              </span>
            </nav>

            <div className="max-w-3xl text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1E2D4A] border border-blue-200 text-xs font-bold mb-3.5">
                <Factory className="w-4 h-4 text-blue-600" />
                <span>{isAr ? 'تصنيع كيميائي وتعبئة وتغليف OEM' : 'Contract Chemical Manufacturing & OEM Bottling'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {isAr ? 'خدمات التصنيع لحساب الغير (Private Label)' : 'Private Label & Contract Chemical Manufacturing'}
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {isAr
                  ? 'من التركيبة الكيميائية الدقيقة وحتى العبوة النهائية الجاهزة للرف، نضع خبراتنا ومصانعنا الحديثة ومختبراتنا في خدمة خط إنتاجك وعلامتك التجارية.'
                  : 'From chemical formulation and fragrance design to automated bottling and packaging, we bring our certified industrial production standards to your brand.'}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
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

                    {/* Bottom CTA to Single Service Page */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/${currentLang}/private-label/${card.slug}`}
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
            defaultSubject={isAr ? 'خدمات التصنيع للغير وعقود OEM' : 'Private Label & OEM Contract Manufacturing Inquiry'}
            itemType="privateLabel"
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
