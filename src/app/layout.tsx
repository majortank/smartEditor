import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marka — Markdown & Component Studio',
  description:
    'Modern, high-performance studio for live Markdown documentation, interactive Tailwind HTML components, and real-time Mermaid diagrams.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none'><rect width='32' height='32' rx='8' fill='%230f172a'/><path d='M8.5 22V10C8.5 9.17 9.17 8.5 10 8.5C10.5 8.5 10.95 8.75 11.2 9.15L16 16.5L20.8 9.15C21.05 8.75 21.5 8.5 22 8.5C22.83 8.5 23.5 9.17 23.5 10V22' stroke='%2338bdf8' stroke-width='2.75' stroke-linecap='round' stroke-linejoin='round'/><circle cx='16' cy='16.5' r='1.5' fill='%23ffffff'/></svg>",
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-hidden selection:bg-sky-500/30 selection:text-sky-400 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
