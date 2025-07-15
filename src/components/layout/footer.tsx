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
                width={160}
                height={54}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              당신의 프로젝트 vivver에서 빛나다
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">바로가기</h3>
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                홈
              </Link>
              <Link 
                href="/community" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                커뮤니티
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
                href="mailto:jc@codefactory.ai" 
                className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
              >
                문의하기 →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0">
            <p className="text-muted-foreground text-xs">
              © {currentYear} Vivvers. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}