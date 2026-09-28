'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; ar: string }> = {
  // Top bar & Header
  'topbar.support': { en: 'Industrial Chemical Hotline: +20 (2) 2590 4122 / +20 100 123 4567', ar: 'الخط الساخن للمبيعات الصناعية: +20 (2) 2590 4122 / +20 100 123 4567' },
  'topbar.email': { en: 'sales@essamco.com.eg', ar: 'sales@essamco.com.eg' },
  'topbar.location': { en: 'Cairo, Egypt | Industrial Zone', ar: 'القاهرة، جمهورية مصر العربية | المنطقة الصناعية' },
  
  // Navigation
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.about': { en: 'About Essamco', ar: 'عن عصامكو' },
  'nav.categories': { en: 'Sectors & Categories', ar: 'القطاعات والمنتجات' },
  'nav.products': { en: 'Products', ar: 'دليل المنتجات' },
  'nav.brands': { en: 'Our Brands', ar: 'علاماتنا التجارية' },
  'nav.quality': { en: 'R&D & Quality', ar: 'الجودة والمختبر' },
  'nav.contact': { en: 'Contact Us', ar: 'اتصل بنا' },
  'nav.admin': { en: 'Admin Portal', ar: 'لوحة الطلبات' },
  'nav.requestQuote': { en: 'Request Quotation', ar: 'طلب تسعير جملة' },

  // Hero Section
  'hero.badge': { en: 'Leading Chemical Manufacturer in Egypt', ar: 'الشركة الرائدة في تصنيع الكيماويات والمنظفات في مصر' },
  'hero.title1': { en: 'Advanced Industrial & Commercial', ar: 'حلول كيميائية ومنظفات صناعية' },
  'hero.title2': { en: 'Cleaning & Chemical Solutions', ar: 'متطورة بمعايير عالمية' },
  'hero.subtitle': { 
    en: 'Essamco formulates high-performance institutional detergents, medical disinfectants, automotive care, and heavy-duty industrial degreasers engineered to the highest international quality standards.', 
    ar: 'تقوم شركة عصامكو بابتكار وتصنيع حلول النظافة المؤسسية، المطهرات الطبية المعتمدة، مستحضرات العناية بالسيارات ومزيلات الشحوم الصناعية الشاقة بأعلى معايير الجودة العالمية.' 
  },
  'hero.cta.products': { en: 'Explore Product Catalog', ar: 'استكشف دليل المنتجات' },
  'hero.cta.quote': { en: 'Request Custom Formulation', ar: 'طلب عينة وتسعير خاص' },
  'hero.stat.experience': { en: '20+ Years Excellence', ar: 'أكثر من 20 عاماً من الخبرة' },
  'hero.stat.products': { en: '100+ Chemical Formulations', ar: 'أكثر من 100 تركيبة معتمدة' },
  'hero.stat.iso': { en: 'ISO 9001 & MoH Certified', ar: 'شهادات أيزو واعتماد وزارة الصحة' },
  'hero.stat.clients': { en: '500+ Corporate Clients', ar: 'أكثر من 500 شريك ومصنع' },

  // Brand strip
  'brands.title': { en: 'Essamco Flagship Brands & Specialized Divisions', ar: 'العلامات التجارية التابعة لمجموعة عصامكو' },
  'brands.subtitle': { en: 'Trusted across hospitals, luxury hotels, transport fleets, and manufacturing plants throughout the Middle East & Africa.', ar: 'موثوقة في المستشفيات الكبرى، الفنادق، أساطيل النقل، والمصانع في مصر والشرق الأوسط.' },

  // Categories
  'categories.sectionTitle': { en: 'Target Sectors & Industrial Applications', ar: 'القطاعات والتطبيقات الصناعية' },
  'categories.sectionDesc': { en: 'Engineered chemical systems tailored for maximum hygiene efficiency and strict compliance.', ar: 'أنظمة كيميائية مصممة خصيصاً لتحقيق أعلى كفاءة نظافة وتطهير مع الالتزام التام بالمواصفات.' },
  'categories.viewProducts': { en: 'View Formulations', ar: 'عرض المنتجات' },

  // Featured Products
  'products.sectionBadge': { en: 'Quality Formulations', ar: 'تركيبات فائقة الجودة' },
  'products.sectionTitle': { en: 'Commercial Chemical Catalog', ar: 'دليل المنتجات الكيميائية والتجارية' },
  'products.sectionDesc': { en: 'Select from our certified industrial cleaning, automotive, and disinfection range available in bulk supply and retail packaging.', ar: 'اختر من تشكيلتنا المعتمدة للمنظفات الصناعية ومطهرات المنشآت المتوفرة بالكميات التجارية وعبوات البيع المباشر.' },
  'products.all': { en: 'All Categories', ar: 'جميع المنتجات' },
  'products.searchPlaceholder': { en: 'Search by product name, active ingredient, brand or use case...', ar: 'ابحث بالاسم، المادة الفعالة، العلامة التجارية أو الاستخدام...' },
  'products.filterBrand': { en: 'Filter by Brand:', ar: 'تصفية حسب العلامة:' },
  'products.viewDetails': { en: 'Technical Specs & Quote', ar: 'المواصفات وطلب تسعير' },
  'products.packSizes': { en: 'Available Packaging:', ar: 'العبوات المتاحة:' },
  'products.inStock': { en: 'In Stock - Bulk Ready', ar: 'متوفر للتوريد الفوري' },

  // Product Modal
  'modal.specs': { en: 'Technical Specifications', ar: 'المواصفات الفنية والفيزيائية' },
  'modal.ph': { en: 'pH Level', ar: 'الرقم الهيدروجيني (pH)' },
  'modal.dilution': { en: 'Recommended Dilution', ar: 'نسبة التخفيف الموصى بها' },
  'modal.color': { en: 'Appearance / Color', ar: 'المظهر واللون' },
  'modal.fragrance': { en: 'Fragrance Profile', ar: 'الرائحة العطرية' },
  'modal.density': { en: 'Relative Density', ar: 'الكثافة النوعية' },
  'modal.keyFeatures': { en: 'Key Performance Features', ar: 'أبرز المزايا والخصائص' },
  'modal.requestQuoteFor': { en: 'Inquire About This Product', ar: 'طلب تسعير وتوريد هذا المنتج' },
  'modal.submitQuote': { en: 'Submit Commercial Inquiry', ar: 'إرسال طلب التوريد' },

  // Quality & Lab
  'quality.badge': { en: 'Advanced R&D & Quality Control', ar: 'البحث والتطوير وضمان الجودة' },
  'quality.title': { en: 'Precision Chemical Engineering & Strict Batch Testing', ar: 'هندسة كيميائية دقيقة وفحص صارم لكل تشغيلة' },
  'quality.desc': { 
    en: 'Our in-house analytical testing laboratory conducts rigorous spectrophotometric, titration, and microbiological assessments on every raw material and production batch. Essamco delivers stability, potency, and safety you can depend on.', 
    ar: 'يمتلك مصنعنا مختبراً تحليلياً متطوراً يجري اختبارات دقيقة للمواد الخام وكل تشغيلة إنتاج لضمان ثبات التركيزات وفعالية التطهير ومطابقة أعلى المعايير القياسية العالمية.' 
  },
  'quality.f1.title': { en: 'In-House Laboratory', ar: 'مختبر كيميائي وميكروبيولوجي' },
  'quality.f1.desc': { en: 'Advanced titration, viscosity, and microbial kill-rate validation equipment.', ar: 'أجهزة قياس اللزوجة، المعايرة، وفحص نسب القضاء على الجراثيم.' },
  'quality.f2.title': { en: 'High Capacity Production', ar: 'طاقة إنتاجية كبرى' },
  'quality.f2.desc': { en: 'Automated stainless-steel mixing reactors capable of blending 50+ metric tons daily.', ar: 'مفاعلات خلط ستانلس ستيل آلية بطاقة إنتاجية تتجاوز 50 طناً يومياً.' },
  'quality.f3.title': { en: 'Private Label & OEM', ar: 'تصنيع لحساب الغير (OEM)' },
  'quality.f3.desc': { en: 'Custom chemical formulation, regulatory licensing support, and bespoke contract packaging.', ar: 'تطوير تركيبات مخصصة، الدعم التنظيمي والتراخيص، وتعبئة مخصصة للغير.' },

  // CTA Banner
  'cta.title': { en: 'Elevate Your Facility Hygiene with Essamco Industrial Formulations', ar: 'ارتقِ بمستوى النظافة والتطهير في منشأتك مع حلول عصامكو الكيميائية' },
  'cta.subtitle': { en: 'Speak directly with our chemical formulation engineers and regional wholesale sales directors for bulk orders and institutional supply tenders.', ar: 'تواصل مباشرة مع فريق الهندسة الكيميائية وإدارة المبيعات المؤسسية للحصول على أسعار الجملة والمناقصات.' },
  'cta.btn': { en: 'Talk to a Chemical Specialist', ar: 'تحدث مع أخصائي كيميائي' },

  // Contact
  'contact.badge': { en: 'Get In Touch', ar: 'تواصل معنا' },
  'contact.title': { en: 'Commercial Inquiries & Factory Supply', ar: 'الطلبات التجارية واستفسارات التوريد' },
  'contact.desc': { en: 'Whether you require large-scale industrial bulk delivery or private-label custom chemical contract manufacturing, our team is ready to serve you.', ar: 'سواء كنت بحاجة لتوريد كميات صناعية ضخمة أو تصنيع كيميائي لحساب الغير، فريقنا جاهز لخدمتك.' },
  'contact.name': { en: 'Full Name / Contact Person', ar: 'الاسم بالكامل' },
  'contact.email': { en: 'Corporate Email', ar: 'البريد الإلكتروني' },
  'contact.phone': { en: 'Phone / WhatsApp', ar: 'رقم الهاتف / واتساب' },
  'contact.company': { en: 'Company / Facility Name', ar: 'اسم الشركة / المنشأة' },
  'contact.subject': { en: 'Subject / Department', ar: 'الموضوع / القسم المعني' },
  'contact.message': { en: 'Project details, required quantities, or chemical specifications...', ar: 'تفاصيل المشروع، الكميات المطلوبة، أو المواصفات الكيميائية...' },
  'contact.submit': { en: 'Send Official Inquiry', ar: 'إرسال الطلب الرسمي' },
  'contact.success': { en: 'Inquiry submitted successfully! Our sales team will follow up within 24 hours.', ar: 'تم استلام طلبك بنجاح! سيتواصل معك فريق المبيعات خلال 24 ساعة.' },

  // Footer
  'footer.about': { 
    en: 'Essamco is a premier Egyptian manufacturer of industrial, institutional, and automotive chemical hygiene solutions with state-of-the-art laboratory testing and ISO compliance.', 
    ar: 'شركة عصامكو من كبرى الشركات المصرية الرائدة في تصنيع المنظفات الصناعية والمطهرات الطبية ومستحضرات العناية بالسيارات بأحدث المختبرات ومعايير الجودة العالمية.' 
  },
  'footer.quickLinks': { en: 'Quick Links', ar: 'روابط سريعة' },
  'footer.categories': { en: 'Industries Served', ar: 'القطاعات المخدومة' },
  'footer.contactInfo': { en: 'Factory & Head Office', ar: 'المصنع والمقر الرئيسي' },
  'footer.address': { en: 'Industrial Zone, El Sabteya / Greater Cairo, Egypt', ar: 'المنطقة الصناعية، السبتية / القاهرة الكبرى، مصر' },
  'footer.rights': { en: '© 2026 Essamco Chemical & Industrial Group. All rights reserved.', ar: '© 2026 مجموعة عصامكو للكيماويات والمنظفات الصناعية. جميع الحقوق محفوظة.' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  let pathname = '';
  let router: any = null;
  try {
    const { usePathname, useRouter } = require('next/navigation');
    pathname = usePathname() || '';
    router = useRouter();
  } catch (e) {
    // Fallback if not inside Next.js router
  }

  // Derive language from URL if present: /ar/... or /en/...
  const langFromUrl: Language | null = pathname.startsWith('/en')
    ? 'en'
    : pathname.startsWith('/ar')
    ? 'ar'
    : null;

  const [language, setLanguageState] = useState<Language>(() => {
    if (langFromUrl) return langFromUrl;
    return 'ar';
  });

  // Synchronize when URL route changes
  useEffect(() => {
    if (langFromUrl && langFromUrl !== language) {
      setLanguageState(langFromUrl);
    }
  }, [langFromUrl]);

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    try {
      localStorage.setItem('essamco_lang', language);
    } catch {}
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (router && pathname) {
      if (pathname.startsWith('/ar') || pathname.startsWith('/en')) {
        const newPath = pathname.replace(/^\/(ar|en)/, `/${lang}`);
        router.push(newPath);
      } else if (!pathname.startsWith('/admin')) {
        router.push(`/${lang}${pathname === '/' ? '' : pathname}`);
      }
    }
  };

  const toggleLanguage = () => {
    const targetLang: Language = language === 'ar' ? 'en' : 'ar';
    setLanguage(targetLang);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry['en'] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction: language === 'ar' ? 'rtl' : 'ltr',
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
