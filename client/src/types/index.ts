export interface Specifications {
  phLevel: string;
  dilution: string;
  color: string;
  fragrance: string;
  density: string;
}

export interface Product {
  _id?: string;
  name: string;
  nameAr: string;
  slug: string;
  category: string;
  brand: string;
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  specifications: Specifications;
  packSizes: string[];
  image: string;
  images?: string[];
  isFeatured: boolean;
  inStock: boolean;
}

export interface Category {
  _id?: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  icon: string;
  image: string;
  productCount?: number;
  order: number;
}

export interface Brand {
  _id?: string;
  name: string;
  nameAr: string;
  slug: string;
  tagline: string;
  taglineAr: string;
  logo: string;
  description: string;
  descriptionAr: string;
  color: string;
  productCount?: number;
  order: number;
}

export interface InquirySubmission {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  productName?: string;
  productId?: string;
  quantityNeeded?: string;
  message: string;
}

export interface InquiryRecord extends InquirySubmission {
  _id: string;
  status: 'pending' | 'contacted' | 'quoted' | 'completed';
  createdAt: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface HeroSlide {
  id?: string;
  badge?: string;
  badgeAr?: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  image: string;
  primaryBtnText?: string;
  primaryBtnTextAr?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnTextAr?: string;
  secondaryBtnLink?: string;
}

export interface ShowcaseCard {
  id?: string;
  slug?: string;
  title: string;
  titleAr: string;
  shortDescription?: string;
  shortDescriptionAr?: string;
  description?: string;
  descriptionAr?: string;
  image: string;
  images?: string[];
  features?: string[];
  featuresAr?: string[];
  badge?: string;
  badgeAr?: string;
}

export interface FeaturePoint {
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
}

export interface StatMetric {
  value: string;
  label: string;
  labelAr: string;
}

export interface BrandItem {
  name: string;
  nameAr: string;
  slug?: string;
  image: string;
}

export interface SiteSeo {
  metaTitle: string;
  metaTitleAr: string;
  metaDescription: string;
  metaDescriptionAr: string;
  keywords: string;
  keywordsAr: string;
  ogImage: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export interface SiteContent {
  _id?: string;
  key: string;
  hero: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    image: string;
    primaryBtnText: string;
    primaryBtnTextAr: string;
    secondaryBtnText: string;
    secondaryBtnTextAr: string;
  };
  heroSlides?: HeroSlide[];
  stats: {
    founded: string;
    foundedLabel: string;
    foundedLabelAr: string;
    years: string;
    yearsLabel: string;
    yearsLabelAr: string;
    categories: string;
    categoriesLabel: string;
    categoriesLabelAr: string;
    metrics?: StatMetric[];
  };
  institutional: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    cards: ShowcaseCard[];
  };
  privateLabel: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    cards: ShowcaseCard[];
  };
  retail: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    btnText: string;
    btnTextAr: string;
    cards: ShowcaseCard[];
  };
  whyChooseUs: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    image: string;
    btnText: string;
    btnTextAr: string;
    points: FeaturePoint[];
  };
  brands?: BrandItem[];
  partnershipCta: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    btnText: string;
    btnTextAr: string;
  };
  footerSettings: {
    tagline: string;
    taglineAr: string;
    newsletterTitle: string;
    newsletterTitleAr: string;
    copyright: string;
    copyrightAr: string;
  };
  socialLinks?: SiteSocialLinks;
  seo?: SiteSeo;
}

export interface SiteSocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  whatsapp?: string;
  youtube?: string;
  tiktok?: string;
}

