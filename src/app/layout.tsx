import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { Header } from '@/components/layout/Header/Header';
import NextTopLoader from 'nextjs-toploader';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pinterest Clone - Get your next great idea',
  description:
    'Discover recipes, home ideas, style inspiration and other ideas to try.',
  keywords: [
    'pinterest',
    'ideas',
    'inspiration',
    'recipes',
    'home decor',
    'fashion',
  ],
  authors: [
    { name: 'Pouya', url: 'https://portfolio-nine-black-48.vercel.app/' },
  ],
  openGraph: {
    title: 'Pinterest Clone - Get your next great idea',
    description:
      'Discover recipes, home ideas, style inspiration and other ideas to try.',
    type: 'website',
  },
  icons: {
    icon: './pinterest.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'Inter, sans-serif' }}>
        <Providers>
          <Header />
          <main className="min-h-screen bg-background">
            <NextTopLoader
              color="#9333ea"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={300}
              shadow="0 0 10px #9333ea,0 0 5px #9333ea"
            />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}



