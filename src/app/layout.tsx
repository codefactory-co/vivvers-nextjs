import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const notoSansKR = Noto_Sans_KR({ 
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: '--font-noto-sans-kr'
});

export const metadata: Metadata = {
  title: "Vivvers - 바이브 코딩 프로젝트 홍보 플랫폼",
  description: "바이브 코딩으로 제작된 프로젝트들을 효과적으로 홍보하고 공유할 수 있는 플랫폼입니다.",
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
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
