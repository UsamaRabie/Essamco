require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Product = require('./models/Product');
const Inquiry = require('./models/Inquiry');
const Admin = require('./models/Admin');

const categories = [
  {
    name: 'Car Care & Automotive',
    nameAr: 'العناية بالسيارات والمحركات',
    slug: 'automotive-car-care',
    description: 'High-performance automotive shampoos, engine degreasers, tire shine, and interior detailing solutions.',
    descriptionAr: 'شامبوهات سيارات فائقة الرغوة، مذيبات شحوم المحركات، ملمعات الإطارات وحلول العناية الداخلية المتكاملة.',
    icon: 'Car',
    image: '/images/categories/car-care.jpg',
    order: 1,
  },
  {
    name: 'Facility & Housekeeping',
    nameAr: 'نظافة المنشآت والضيافة',
    slug: 'facility-housekeeping',
    description: 'Commercial detergents, floor polishers, glass cleaners, and multi-surface hygiene systems for hotels and offices.',
    descriptionAr: 'منظفات تجارية، ملمعات أرضيات رخام وسيراميك، منظفات زجاج وأنظمة نظافة شاملة للفنادق والمكاتب.',
    icon: 'Building2',
    image: '/images/categories/housekeeping.jpg',
    order: 2,
  },
  {
    name: 'Hospital & Healthcare Disinfection',
    nameAr: 'التطهير الطبي والمستشفيات',
    slug: 'hospital-disinfection',
    description: 'Medical-grade quaternary ammonium & chlorine-based disinfectants meeting national and international health standards.',
    descriptionAr: 'مطهرات طبية معتمدة من وزارة الصحة للقضاء على 99.9% من الفيروسات والبكتيريا للمستشفيات والمراكز الطبية.',
    icon: 'Hospital',
    image: '/images/categories/hospital.jpg',
    order: 3,
  },
  {
    name: 'Industrial Laundry & Textiles',
    nameAr: 'المغاسل الصناعية والمنسوجات',
    slug: 'industrial-laundry',
    description: 'Concentrated liquid & powder detergents, oxygen bleaches, neutralizers, and fabric softeners for industrial laundries.',
    descriptionAr: 'سوائل ومساحيق غسيل فائقة التركيز، مبيضات أكسجينية، معتدلات قلوية ومنعمات أقمشة للمغاسل المركزية.',
    icon: 'Shirt',
    image: '/images/categories/laundry.jpg',
    order: 4,
  },
  {
    name: 'Heavy Industry & Solvent Cleaners',
    nameAr: 'الصناعات الثقيلة ومزيلات الزيوت',
    slug: 'heavy-industrial',
    description: 'Alkaline degreasers, rust removers, scale inhibitors, and machinery cleaners for manufacturing plants and workshops.',
    descriptionAr: 'مزيلات شحوم قلوية، مانعات ترسبات كلسية، ومزيلات صدأ متطورة لخطوط الإنتاج والمصانع والورش.',
    icon: 'Factory',
    image: '/images/categories/industrial.jpg',
    order: 5,
  },
];

const brands = [
  {
    name: 'ESSAMCO',
    nameAr: 'عصامكو للكيماويات',
    slug: 'essamco',
    tagline: 'Advanced Industrial & Institutional Hygiene Solutions',
    taglineAr: 'حلول متقدمة للكيماويات والنظافة المؤسسية والصناعية',
    logo: '/images/brands/logo-essamco.png',
    description: 'Essamco is the flagship manufacturing brand delivering chemical engineering excellence, ISO-certified formulations, and large-scale supplies.',
    descriptionAr: 'العلامة التجارية الرائدة لمجموعة عصامكو المتخصصة في الحلول الكيميائية الصناعية وتجهيز كبرى المشروعات.',
    color: '#0f2952',
    order: 1,
  },
  {
    name: 'Savon',
    nameAr: 'سافون',
    slug: 'savon',
    tagline: 'Pure Touch & Eco-Friendly Gentle Hygiene',
    taglineAr: 'لمسة النقاء وحلول العناية البيئية الفائقة',
    logo: '/images/brands/logo-savon.png',
    description: 'Savon specializes in skin-friendly foaming hand soaps, cosmetic hand washes, and dermatologically tested housekeeping hygiene.',
    descriptionAr: 'علامة سافون تقدم صابون الأيدي الرغوي، غسول الجسم، والمنظفات المنزلية الآمنة واللطيفة على البشرة.',
    color: '#16a34a',
    order: 2,
  },
  {
    name: 'Bauer',
    nameAr: 'باور إندستريال',
    slug: 'bauer',
    tagline: 'German Engineering Standard Heavy-Duty Chemical Power',
    taglineAr: 'قوة التنظيف الفائقة للمعايير الصناعية الشاقة',
    logo: '/images/brands/logo-bauer.png',
    description: 'Bauer offers extreme-strength degreasers, mechanical workshop solvents, and industrial floor scrubbing concentrates.',
    descriptionAr: 'باور يوفر أقوى منظفات الشحوم والزيوت المستعصية للأرضيات والمعدات والمصانع.',
    color: '#dc2626',
    order: 3,
  },
  {
    name: 'Whiff',
    nameAr: 'ويف',
    slug: 'whiff',
    tagline: 'Captivating Scents & Scented Ambient Enhancers',
    taglineAr: 'عطور منعشة ولمسات انتعاش تدوم طويلاً',
    logo: '/images/brands/logo-whiff.png',
    description: 'Whiff produces long-lasting aromatic air fresheners, carpet fresheners, and scented fabric conditioners for luxury hotels and residences.',
    descriptionAr: 'معطرات جو فاخرة، معطرات مفروشات ومنعمات أقمشة بتركيزات عطرية فرنسية تدوم طويلاً.',
    color: '#ea580c',
    order: 4,
  },
  {
    name: 'Power 3',
    nameAr: 'باور 3 أوتوموتيف',
    slug: 'power',
    tagline: 'Next-Level Automotive Detailing & Care',
    taglineAr: 'الجيل الجديد لحماية ونظافة السيارات الاحترافية',
    logo: '/images/brands/logo-power.png',
    description: 'Power 3 delivers high-gloss snow foam wash, touchless car wash formulas, tire gel, and dashboard UV protective dressings.',
    descriptionAr: 'حلول مغاسل السيارات المتطورة: شامبو الفوم الثلجي، منظف الجنوط، وملمع الإطارات الفائق.',
    color: '#059669',
    order: 5,
  },
];

const products = [
  {
    name: 'Essamco Ultra Sanitize - Hospital Grade Multi-Surface Disinfectant',
    nameAr: 'عصامكو ألترا سانيتايز - مطهر المستشفيات متعدد الأسطح',
    slug: 'essamco-ultra-sanitize-disinfectant',
    category: 'hospital-disinfection',
    brand: 'essamco',
    description: 'Hospital-grade dual quaternary ammonium disinfectant designed for surgical theaters, patient rooms, and food processing areas. Eliminates 99.99% of bacteria, viruses, and fungi.',
    descriptionAr: 'مطهر ومعقم فائق الفعالية يعتمد على مركبات الأمونيوم الرباعية، مخصص لغرف العمليات، أجنحة المرضى والمراكز الطبية. يقضي على 99.99% من الجراثيم والفيروسات.',
    features: [
      'Bactericidal, virucidal, and fungicidal formula',
      'Non-corrosive to stainless steel and medical plastics',
      'No rinsing required at specified dilution (1:100)',
      'Certified by Egyptian Ministry of Health standards',
    ],
    featuresAr: [
      'تركيبة مبيدة للبكتيريا والفيروسات والفطريات',
      'غير مسببة لتآكل المعادن أو أجهزة الاستيل الطبية',
      'لا تحتاج للشطف عند نسب التخفيف القياسية 1:100',
      'معتمدة ومطابقة للمواصفات القياسية المصرية',
    ],
    specifications: {
      phLevel: '7.5 ± 0.5',
      dilution: '1:50 for deep disinfection / 1:100 for routine cleaning',
      color: 'Clear Aquamarine Blue',
      fragrance: 'Pleasant Fresh Floral',
      density: '1.03 g/cm³',
    },
    packSizes: ['5 Liters Jerrycan', '20 Liters Jerrycan', '200 Liters Drum'],
    image: '/images/products/disinfectant-jerrycan.jpg',
    isFeatured: true,
  },
  {
    name: 'Power 3 Hyper Foam Snow Shampoo',
    nameAr: 'باور 3 شامبو الفوم الثلجي فائق التركيز',
    slug: 'power-3-hyper-foam-snow-shampoo',
    category: 'automotive-car-care',
    brand: 'power',
    description: 'Thick, clinging snow foam car shampoo engineered for high-pressure foam cannons. Safely lifts abrasive grime without stripping waxes or ceramic coatings.',
    descriptionAr: 'شامبو رغوي كثيف للغاية مصمم لمدافع الرغوة بالضغط العالي. يرفع الأوساخ بلطف ويعطي لمعاناً فائقاً دون التأثير على طبقات النانو سيراميك والواكس.',
    features: [
      'High lubricity prevents micro-scratches and swirls',
      'Ultra dense snow foam with long dwell time',
      'pH-neutral safe on all vehicle finishes',
      'High gloss polymer shine boosters',
    ],
    featuresAr: [
      'نسبة انزلاق فائقة تمنع حدوث الخدوش الدقيقة أثناء الغسيل',
      'رغوة ثلجية كثيفة تلتصق بالسطح لتفكيك الأتربة العنيدة',
      'متعادل الحموضة (pH neutral) وآمن على كافة أنواع الطلاء',
      'يحتوي على بوليمرات تمنح السيارة لمعاناً كريستالياً',
    ],
    specifications: {
      phLevel: '7.0 - 7.5 (Neutral)',
      dilution: '1:10 in foam cannon / 1:200 in bucket wash',
      color: 'Vibrant Cherry Pink',
      fragrance: 'Sweet Bubblegum',
      density: '1.04 g/cm³',
    },
    packSizes: ['4 Liters Canister', '20 Liters Jerrycan', '200 Liters Drum'],
    image: '/images/products/car-shampoo.jpg',
    isFeatured: true,
  },
  {
    name: 'Bauer Heavy-Duty Industrial Degreaser HD-90',
    nameAr: 'باور مزيل الشحوم الصناعية الثقيلة HD-90',
    slug: 'bauer-heavy-duty-industrial-degreaser',
    category: 'heavy-industrial',
    brand: 'bauer',
    description: 'Professional-grade alkaline solvent degreaser engineered to rapidly dissolve baked-on grease, engine sludge, carbon deposits, and industrial oils from heavy machinery and shop floors.',
    descriptionAr: 'مذيب ومنظف شحوم صناعي قلوي جبار لإذابة الزيوت المحروقة، رواسب الكربون، والشحوم المتراكمة على خطوط الإنتاج والآلات وأرضيات الورش والمصانع.',
    features: [
      'Rapid penetration through hardened grease and bitumen',
      'Low foaming formula ideal for automatic floor scrubbers',
      'Contains anti-corrosion additives for ferrous metals',
      'Biodegradable surfactant system',
    ],
    featuresAr: [
      'تغلغل سريع وفوري في أصعب طبقات الشحوم والكربون',
      'قليل الرغوة ومناسب تماماً لماكينات جلي الأرضيات الأوتوماتيكية',
      'يحتوي على موانع تآكل لحماية المعادن الحديدية',
      'مواد خافضة للتوتر السطحي قابلة للتحلل الحيوي',
    ],
    specifications: {
      phLevel: '12.5 - 13.5 (Heavy Alkaline)',
      dilution: '1:5 for heavy engines / 1:30 for floor scrubbing',
      color: 'Amber Gold',
      fragrance: 'Citrus Solvent',
      density: '1.08 g/cm³',
    },
    packSizes: ['20 Liters Jerrycan', '200 Liters Steel Drum', '1000 Liters IBC Tank'],
    image: '/images/products/industrial-degreaser.jpg',
    isFeatured: true,
  },
  {
    name: 'Savon Luxury Antibacterial Pearl Hand Soap',
    nameAr: 'سافون صابون الأيدي اللؤلؤي المضاد للبكتيريا',
    slug: 'savon-luxury-antibacterial-hand-soap',
    category: 'facility-housekeeping',
    brand: 'savon',
    description: 'Enriched with moisturizing aloe vera and vitamin E, Savon Pearl Hand Soap provides rich silky lather while eliminating 99% of germs. Ideal for luxury hotels, corporate towers, and clinics.',
    descriptionAr: 'غني بخلاصة الألوفيرا المرطبة وفيتامين E، يمنح اليدين رغوة حريرية فاخرة ويقضي على 99% من الجراثيم. مثالي للفنادق الفاخرة والمباني الإدارية والمراكز الطبية.',
    features: [
      'Infused with glycerin and natural skin conditioners',
      'Gentle balanced pH suitable for frequent daily use',
      'Antimicrobial agents for active hygiene protection',
      'Opalescent pearl texture with soothing fragrance',
    ],
    featuresAr: [
      'معزز بالجلسرين الطبيعي ومغذيات ترطيب البشرة',
      'متعادل الحموضة ومناسب للاستخدام اليومي المتكرر',
      'عوامل حماية مضادة للبكتيريا تحافظ على صحة اليدين',
      'قوام لؤلؤي كريمي فاخر برائحة زهرية مهدئة',
    ],
    specifications: {
      phLevel: '5.5 - 6.5 (Skin Balanced)',
      dilution: 'Ready to Use in dispensers',
      color: 'Pearl White / Pearl Lavender',
      fragrance: 'Lavender & White Musk',
      density: '1.02 g/cm³',
    },
    packSizes: ['1 Liter Dispenser Refill', '4 Liters Canister', '20 Liters Jerrycan'],
    image: '/images/products/hand-soap.jpg',
    isFeatured: true,
  },
  {
    name: 'Whiff Royal Orchid Long-Lasting Air & Fabric Freshener',
    nameAr: 'ويف معطر الجو والمفروشات برائحة الأوركيد الملكية',
    slug: 'whiff-royal-orchid-air-freshener',
    category: 'facility-housekeeping',
    brand: 'whiff',
    description: 'Water-based micro-emulsion room spray that neutralizes bad odors at the molecular level, releasing a long-lasting premium French perfume notes of fresh blooming orchids.',
    descriptionAr: 'معطر جو ومفروشات بتركيبة مائية آمنة تقضي على الروائح الكريهة من مصدرها وتنشر عبير الأوركيد الفرنسي الملكي الذي يدوم طويلاً دون أن يترك بقعاً على الأقمشة.',
    features: [
      'Patented odor-neutralizing molecular technology',
      'Stain-free water based formula safe on curtains & upholstery',
      'Up to 24-hour slow release ambient scent retention',
      'Free from ozone-depleting aerosol propellants',
    ],
    featuresAr: [
      'تقنية ميكرو-إيمولشن لتفكيك الروائح الكريهة وليس حجبها فقط',
      'تركيبة مائية خالية من الزيوت الثقيلة ولا تترك أي بقع',
      'رائحة ثابتة تدوم حتى 24 ساعة في الأماكن المغلقة',
      'صديق للبيئة وخالٍ من الغازات الدافعة المضرة',
    ],
    specifications: {
      phLevel: '6.5 - 7.5',
      dilution: 'Ready to Use with trigger spray',
      color: 'Clear Liquid',
      fragrance: 'Royal French Orchid & Jasmine',
      density: '1.00 g/cm³',
    },
    packSizes: ['500ml Trigger Spray', '4 Liters Canister', '20 Liters Jerrycan'],
    image: '/images/products/air-freshener.jpg',
    isFeatured: false,
  },
  {
    name: 'Essamco Laundry Pro - Heavy Stain Enzymatic Liquid Detergent',
    nameAr: 'عصامكو لوندري برو - سائل غسيل إنزيمي للمغاسل المركزية',
    slug: 'essamco-laundry-pro-enzymatic-detergent',
    category: 'industrial-laundry',
    brand: 'essamco',
    description: 'Commercial laundry detergent powered by multi-enzyme matrix that targets protein, blood, grease, and wine stains in commercial hotels and healthcare laundering facilities.',
    descriptionAr: 'سائل غسيل متطور عالي الكفاءة للمغاسل المركزية وفنادق الخمس نجوم، معزز بنظام إنزيمي رباعي لتفكيك بقع الدم والزيوت والبروتين الصعبة في درجات حرارة منخفضة.',
    features: [
      'Multi-enzyme protease, amylase, and lipase system',
      'High optical brighteners prevent textile greying',
      'Effective in hard water conditions up to 400 ppm CaCO3',
      'Suitable for automatic peristaltic laundry injection systems',
    ],
    featuresAr: [
      'نظام إنزيمي متكامل يزيل أصعب البقع العضوية والدهنية',
      'معزز بمبيضات بصرية تحافظ على بياض الأقمشة وتمنع الاصفرار',
      'يعمل بكفاءة عالية في المياه ذات العسر المرتفع',
      'مثالي لأنظمة الحقن الأوتوماتيكية في المغاسل الضخمة',
    ],
    specifications: {
      phLevel: '8.5 - 9.5',
      dilution: '3 - 8 ml per kg of dry linen',
      color: 'Fluorescent Royal Blue',
      fragrance: 'Clean Cotton Alpine Breeze',
      density: '1.12 g/cm³',
    },
    packSizes: ['20 Liters Jerrycan', '200 Liters Drum'],
    image: '/images/products/laundry-detergent.jpg',
    isFeatured: true,
  },
  {
    name: 'Power 3 Wheel & Rim Acid-Free Cleaner',
    nameAr: 'باور 3 منظف الجنوط الخالي من الأحماض',
    slug: 'power-3-wheel-rim-cleaner',
    category: 'automotive-car-care',
    brand: 'power',
    description: 'Color-changing iron decontamination wheel cleaner that reacts with brake dust, turning deep purple as it dissolves embedded metallic particles without harming alloy surfaces.',
    descriptionAr: 'منظف جنوط ثوري يتفاعل كيميائياً مع غبار الفرامل وجزيئات الحديد المتطايرة، يتحول للون البنفسجي عند التفكيك، وخالٍ تماماً من الأحماض الحارقة لحماية جنوط الألومنيوم.',
    features: [
      'pH-balanced active color-changing indicator',
      'Safe on chrome, polished aluminum, clear coats, and powder coats',
      'Rapid breakdown of sintered brake dust',
      'Thick gel clinging formula for vertical wheel faces',
    ],
    featuresAr: [
      'مؤشر لوني ذكي يتحول للبنفسجي للدلالة على تفكيك جزيئات الحديد',
      'آمن تماماً على جنوط الألومنيوم، الكروم، والطلاء الحراري',
      'تركيبة هلامية تلتصق بالأسطح العمودية لأطول فترة تلامس',
      'خالٍ من الأحماض الكبريتية أو الهيدروكلوريك الضارة',
    ],
    specifications: {
      phLevel: '7.0 (Strictly Neutral)',
      dilution: 'Ready to Use spray',
      color: 'Clear transparent turns to deep purple upon reaction',
      fragrance: 'Cherry Masked',
      density: '1.05 g/cm³',
    },
    packSizes: ['500ml Trigger Spray', '4 Liters Canister', '20 Liters Jerrycan'],
    image: '/images/products/wheel-cleaner.jpg',
    isFeatured: false,
  },
  {
    name: 'Essamco Glass Master - Streak-Free Fast Drying Glass Cleaner',
    nameAr: 'عصامكو جلاس ماستر - منظف الزجاج سريع الجفاف بدون تلطيخ',
    slug: 'essamco-glass-master-cleaner',
    category: 'facility-housekeeping',
    brand: 'essamco',
    description: 'Alcohol and glycol infused glass cleaner that evaporates immediately, leaving glass facades, mirrors, and display counters sparkling without film or lint streaks.',
    descriptionAr: 'منظف وملمع زجاج ومرايا بتركيبة كحولية متوازنة تتبخر سريعاً دون ترك أي خطوط أو هالات ضبابية، يوفر لمعاناً بلورياً شفافاً لواجهات الفنادق والمباني.',
    features: [
      'Instant flash evaporation prevents hazing',
      'Anti-static additive repels dust settling',
      'Ammonia-free, safe on tinted glass and acrylics',
      'Excellent on chrome and high-shine polished surfaces',
    ],
    featuresAr: [
      'تبخر فوري لا يترك أي غباش أو تلطيخ على الإطلاق',
      'خاصية مضادة للكهرباء الساكنة تقلل التصاق الأتربة بعد التنظيف',
      'خالٍ من الأمونيا وآمن على الزجاج الملون والأكريليك',
      'يمنح أسطح الكروم والمرايا بريقاً فائقاً',
    ],
    specifications: {
      phLevel: '7.0 - 8.0',
      dilution: 'Ready to use / 1:2 for maintenance',
      color: 'Crystal Clear Sky Blue',
      fragrance: 'Fresh Breeze',
      density: '0.99 g/cm³',
    },
    packSizes: ['1 Liter Trigger Spray', '4 Liters Canister', '20 Liters Jerrycan'],
    image: '/images/products/glass-cleaner.jpg',
    isFeatured: false,
  },
  {
    name: 'Bauer Rust & Scale Inhibitor Descaler RI-500',
    nameAr: 'باور مزيل الصدأ والترسبات الكلسية الصناعي RI-500',
    slug: 'bauer-rust-scale-inhibitor-descaler',
    category: 'heavy-industrial',
    brand: 'bauer',
    description: 'Specialized chemical descaler for cooling towers, heat exchangers, boiler tubes, and rusted iron components, formulated with corrosion inhibitors to protect base metals.',
    descriptionAr: 'مركب كيميائي متخصص لإزالة الصدأ والترسبات الكلسية والتكلسات في أبراج التبريد، المبادلات الحرارية، والمراجل، مدعم بمانعات تآكل متطورة لحماية المعادن.',
    features: [
      'Dissolves heavy calcium carbonate and rust scale in minutes',
      'Special organic corrosion inhibitor prevents acid attack on metal',
      'Restores thermal efficiency in industrial heat exchange systems',
      'Safe for periodic maintenance flushing',
    ],
    featuresAr: [
      'يذيب التكلسات الكلسية والصدأ المستعصي في دقائق معدودة',
      'معزز بمثبطات تآكل تحمي جسم المعدات والخطوط أثناء الغسيل',
      'يرفع كفاءة التبادل الحراري ويقلل استهلاك الطاقة في المصانع',
      'آمن لدورات الصيانة الدورية في المنشآت الصناعية',
    ],
    specifications: {
      phLevel: '1.0 - 2.0 (Acidic with Inhibitor)',
      dilution: '1:5 to 1:20 depending on scale thickness',
      color: 'Dark Amber',
      fragrance: 'Pungent Technical',
      density: '1.15 g/cm³',
    },
    packSizes: ['20 Liters Jerrycan', '200 Liters Drum', '1000 Liters IBC'],
    image: '/images/products/descaler.jpg',
    isFeatured: false,
  },
];

const sampleInquiries = [
  {
    fullName: 'Mohamed El-Sayed',
    email: 'm.elsayed@cairologistics.eg',
    phone: '+20 100 123 4567',
    company: 'Cairo Logistics Fleet',
    productName: 'Power 3 Hyper Foam Snow Shampoo',
    quantityNeeded: '50 x 20L Jerrycans per month',
    message: 'We operate a commercial transport fleet of 120 trucks. Need a monthly quote with delivery to 10th of Ramadan city.',
    status: 'pending',
  },
  {
    fullName: 'Dr. Tarek Mansour',
    email: 'tarek.mansour@alnoorhospital.com',
    phone: '+20 111 987 6543',
    company: 'Al-Noor Specialized Hospital',
    productName: 'Essamco Ultra Sanitize - Hospital Grade Disinfectant',
    quantityNeeded: '100 x 20L Jerrycans',
    message: 'Requesting wholesale pricing and MSDS technical approval sheets for our annual infection control tender.',
    status: 'quoted',
  },
];

async function seedDatabase() {
  try {
    const primaryUri = process.env.MONGODB_URI;
    const localUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/essamco';
    let connected = false;

    try {
      console.log(`[Seed] Connecting to MongoDB Atlas: ${primaryUri.replace(/:[^:]*@/, ':****@')}`);
      await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 4000 });
      console.log('[Seed] Connected to Atlas successfully.');
      connected = true;
    } catch (atlasErr) {
      console.warn(`[Seed Warning] Atlas connection failed (${atlasErr.message.substring(0, 80)}...).`);
      console.log(`[Seed] Connecting to local MongoDB: ${localUri}`);
      await mongoose.connect(localUri, { serverSelectionTimeoutMS: 4000 });
      console.log('[Seed] Connected to local MongoDB successfully.');
      connected = true;
    }

    // Clear existing collections
    console.log('[Seed] Clearing existing collections...');
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Product.deleteMany({});
    await Inquiry.deleteMany({});
    await Admin.deleteMany({});

    // Create Default Admin Account
    console.log('[Seed] Creating default admin account...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@essamco.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Essamco@2026';
    const adminName = process.env.ADMIN_NAME || 'Essamco Superadmin';
    const admin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'superadmin',
    });
    console.log(`[Seed] Admin created: ${admin.email}`);

    // Insert Categories
    console.log('[Seed] Inserting categories...');
    const insertedCategories = await Category.insertMany(categories);
    console.log(`[Seed] Inserted ${insertedCategories.length} categories.`);

    // Insert Brands
    console.log('[Seed] Inserting brands...');
    const insertedBrands = await Brand.insertMany(brands);
    console.log(`[Seed] Inserted ${insertedBrands.length} brands.`);

    // Insert Products
    console.log('[Seed] Inserting products...');
    const insertedProducts = await Product.insertMany(products);
    console.log(`[Seed] Inserted ${insertedProducts.length} products.`);

    // Insert Sample Inquiries
    console.log('[Seed] Inserting sample customer inquiries...');
    const insertedInquiries = await Inquiry.insertMany(sampleInquiries);
    console.log(`[Seed] Inserted ${insertedInquiries.length} sample inquiries.`);

    console.log('----------------------------------------------------');
    console.log('✅ Essamco Database Seeded Successfully to MongoDB Atlas!');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('[Seed Error]:', error);
  } finally {
    await mongoose.connection.close();
    console.log('[Seed] Database connection closed.');
    process.exit(0);
  }
}

seedDatabase();
