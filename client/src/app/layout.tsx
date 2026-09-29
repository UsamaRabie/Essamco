import type { Metadata, Viewport } from 'next';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { ScrollProgress } from '../components/ScrollProgress';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-cairo',
});

export const viewport: Viewport = {
  themeColor: '#0f2952',
  width: 'device-width',
  initialScale: 1,
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.essamco.com.eg';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'عصامكو للكيماويات والمنظفات الصناعية | ESSAMCO Egypt',
    template: '%s | عصامكو مصر',
  },
  description: 'شركة عصامكو - الشركة المصرية الرائدة في تصنيع المنظفات الصناعية والتجارية، المطهرات الطبية المعتمدة، منظفات باور للسيارات، ومزيلات الشحوم الصناعية بأعلى معايير الجودة العالمية.',
  keywords: [
    'عصامكو للكيماويات',
    'Essamco',
    'تصنيع منظفات صناعية مصر',
    'مطهرات طبية معتمدة القاهرة',
    'منظفات مغاسل تجارية مصر',
    'صابون سافون لليدين',
    'مزيل شحوم باور الصناعي',
    'معطرات جو ويف',
    'كيماويات العناية بالسيارات باور 3',
    'تصنيع كيماويات للغير في مصر',
  ],
  authors: [{ name: 'مجموعة عصامكو الصناعية', url: baseUrl }],
  creator: 'عصامكو',
  publisher: 'مجموعة عصامكو للكيماويات والمنظفات الصناعية',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/ar',
    languages: {
      'ar-EG': '/ar',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'عصامكو للكيماويات والمنظفات الصناعية | ESSAMCO',
    description: 'الشركة الرائدة في مصر لتصنيع المنظفات الصناعية، المطهرات الطبية، وحلول العناية بالسيارات والتصنيع لحساب الغير.',
    url: baseUrl,
    siteName: 'عصامكو مصر | ESSAMCO',
    images: [
      {
        url: '/images/brands/logo-essamco.png',
        width: 600,
        height: 600,
        alt: 'عصامكو للحلول الكيميائية والمنظفات الصناعية',
      },
    ],
    locale: 'ar_EG',
    alternateLocale: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'عصامكو للكيماويات والمنظفات الصناعية | ESSAMCO',
    description: 'حلول كيميائية ومنظفات صناعية متطورة بمعايير الجودة العالمية.',
    images: ['/images/brands/logo-essamco.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/brands/logo-essamco.png',
    apple: '/images/brands/logo-essamco.png',
  },
};

// JSON-LD Structured Data for Google Rich Results
const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'شركة عصامكو للصناعات الكيماوية',
      alternateName: 'Essamco Chemical Group',
      url: baseUrl,
      logo: `${baseUrl}/images/brands/logo-essamco.png`,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+201001234567',
          contactType: 'sales',
          areaServed: ['EG', 'MENA'],
          availableLanguage: ['Arabic', 'English'],
        },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'المنطقة الصناعية، السبتية',
        addressLocality: 'القاهرة',
        addressRegion: 'محافظة القاهرة',
        addressCountry: 'EG',
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#localbusiness`,
      name: 'مصنع عصامكو ومنافذ التوريد التجاري',
      image: `${baseUrl}/images/brands/logo-essamco.png`,
      telephone: '+201001234567',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'المنطقة الصناعية، السبتية',
        addressLocality: 'القاهرة',
        addressCountry: 'EG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 30.065,
        longitude: 31.245,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '08:30',
          closes: '17:30',
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable} h-full scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <LanguageProvider>
          <ScrollProgress />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
