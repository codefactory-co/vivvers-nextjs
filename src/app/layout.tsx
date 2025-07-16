import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google';

const notoSansKR = Noto_Sans_KR({ 
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: '--font-noto-sans-kr'
});

export const metadata: Metadata = {
  title: "vivvers - 바이브 코딩 프로젝트 홍보 플랫폼",
  description: "바이브 코딩으로 제작된 프로젝트들을 효과적으로 홍보하고 공유할 수 있는 플랫폼입니다.",
  
  // Favicon configuration
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon/favicon.ico'
  },
  
  // Web app manifest
  manifest: '/favicon/site.webmanifest',
  
  // Theme colors for mobile browsers
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
  
  // Open Graph metadata with custom OG image
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://vivvers.com',
    siteName: 'vivvers',
    title: 'vivvers - 바이브 코딩 프로젝트 홍보 플랫폼',
    description: '바이브 코딩으로 제작된 프로젝트들을 효과적으로 홍보하고 공유할 수 있는 플랫폼입니다.',
    images: [
      {
        url: '/ogimage/og@1200x630.png',
        width: 1200,
        height: 630,
        alt: 'vivvers - 바이브 코딩 프로젝트 홍보 플랫폼'
      }
    ]
  },
  
  // Twitter card metadata
  twitter: {
    card: 'summary_large_image',
    site: '@vivvers',
    title: 'vivvers - 바이브 코딩 프로젝트 홍보 플랫폼',
    description: '바이브 코딩으로 제작된 프로젝트들을 효과적으로 홍보하고 공유할 수 있는 플랫폼입니다.',
    images: ['/ogimage/og@1200x630.png']
  },
  
  // Additional metadata for better mobile experience
  viewport: 'width=device-width, initial-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'vivvers'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} font-sans min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
