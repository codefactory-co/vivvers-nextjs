import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t bg-background ${className || ""}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link 
              href="/" 
              className="inline-block hover:opacity-80 transition-opacity"
            >
              <Image
                src="/img/logo.png"
                alt="Vivvers"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              바이브 코딩으로 제작된 프로젝트들을 효과적으로 홍보하고 공유할 수 있는 플랫폼입니다.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">사이트 맵</h3>
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/projects" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                프로젝트
              </Link>
              <Link 
                href="/about" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                소개
              </Link>
              <Link 
                href="/contact" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                문의
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">연락처</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                프로젝트 문의나 제안사항이 있으시면 언제든 연락주세요.
              </p>
              <Link 
                href="/contact" 
                className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
              >
                문의하기 →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-muted-foreground text-xs">
              © {currentYear} Vivvers. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                href="/privacy" 
                className="text-muted-foreground hover:text-foreground transition-colors text-xs"
              >
                개인정보처리방침
              </Link>
              <Link 
                href="/terms" 
                className="text-muted-foreground hover:text-foreground transition-colors text-xs"
              >
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}