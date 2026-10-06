import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://majortank.space'),
  title: 'Marka — 100% Free Live Markdown, HTML Component & Mermaid Studio',
  description:
    '100% Free live Markdown, HTML component, and Mermaid diagram studio with zero sign-up. Features synchronized dual-pane scrolling, 20+ Mermaid diagram types, bidirectional Markdown to Tailwind UI conversion, and instant HTML export.',
  keywords: [
    'free markdown editor',
    'mermaid diagram editor',
    'mermaid live editor',
    'markdown to html converter',
    'tailwind component preview',
    'interactive documentation',
    'sequence diagram maker',
    'architecture diagrams',
    'offline markdown editor',
    'developer documentation tools',
    'marka',
    'marka studio',
    'majortank',
  ],
  alternates: {
    canonical: 'https://majortank.space/marka',
    languages: {
      'en-US': 'https://majortank.space/marka',
    },
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none'><rect width='32' height='32' rx='8' fill='%230f172a'/><path d='M8.5 22V10C8.5 9.17 9.17 8.5 10 8.5C10.5 8.5 10.95 8.75 11.2 9.15L16 16.5L20.8 9.15C21.05 8.75 21.5 8.5 22 8.5C22.83 8.5 23.5 9.17 23.5 10V22' stroke='%2338bdf8' stroke-width='2.75' stroke-linecap='round' stroke-linejoin='round'/><circle cx='16' cy='16.5' r='1.5' fill='%23ffffff'/></svg>",
  },
  openGraph: {
    title: 'Marka — 100% Free Live Markdown, HTML Component & Mermaid Studio',
    description:
      '100% Free live Markdown, HTML component, and Mermaid diagram studio with zero sign-up. Synchronized dual-pane scrolling, 20+ Mermaid diagram types, and bidirectional Markdown to Tailwind UI transpilation.',
    url: 'https://majortank.space/marka',
    siteName: 'Marka Studio',
    type: 'website',
    images: [
      {
        url: 'https://majortank.space/marka-og.png',
        width: 1200,
        height: 630,
        alt: 'Marka Studio — 100% Free Live Markdown & Mermaid Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marka — 100% Free Live Markdown, HTML Component & Mermaid Studio',
    description:
      '100% Free live Markdown, HTML component, and Mermaid diagram studio with zero sign-up. 20+ Mermaid diagram types, dual-pane scroll sync, and instant HTML export.',
    images: ['https://majortank.space/marka-og.png'],
    creator: '@majortank',
    site: '@majortank',
  },
  other: {
    'twitter:label1': 'Pricing',
    'twitter:data1': '100% Free (All Features Unlocked)',
    'twitter:label2': 'Tech Stack',
    'twitter:data2': 'Next.js 15 & React 19',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Marka',
    alternateName: 'Marka — Free Live Markdown, HTML Component & Mermaid Studio',
    url: 'https://majortank.space/marka',
    image: 'https://majortank.space/marka-og.png',
    description:
      '100% Free live Markdown, HTML component, and Mermaid diagram studio with zero sign-up. Features synchronized dual-pane scrolling, 20+ Mermaid diagram types, bidirectional Markdown to Tailwind UI conversion, and instant HTML export.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All modern web browsers',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description: '100% Free forever with all features unlocked',
    },
    author: {
      '@type': 'Person',
      name: 'Thabo Tankiso Thebe',
      alternateName: 'MajorTank',
      url: 'https://majortank.space/',
      sameAs: [
        'https://github.com/majortank',
        'https://linkedin.com/in/thabotankisothebe',
      ],
    },
    featureList: [
      '100% Free - all features unlocked',
      '20+ Real-time debounced Mermaid diagram types',
      'Dual-pane synchronized scrolling between editor and preview',
      'Bidirectional Markdown to Tailwind UI component card conversion',
      'Interactive HTML component mode with responsive viewport switching',
      'Instant AST parsing with marked and DOMPurify sanitization',
      'Standalone HTML and Markdown export',
      'Isolated iframe print-to-PDF engine',
      'Persistent document workspace via localStorage',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased overflow-hidden selection:bg-sky-500/30 selection:text-sky-400 transition-colors duration-200">
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-LR6WJQ1J85"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LR6WJQ1J85');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
