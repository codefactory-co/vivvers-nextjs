import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { Home, Users } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  className?: string;
  user: User | null;
}

export function Header({ className, user }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className || ""}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Image
                src="/img/logo.png"
                alt="Vivvers"
                width={160}
                height={54}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>홈</span>
            </Link>
            <Link 
              href="/community" 
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>커뮤니티</span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu - Server rendered */}
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden md:inline-flex"
                asChild
              >
                <Link href="/signin">
                  로그인
                </Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <MobileMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}