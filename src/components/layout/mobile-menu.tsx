"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Menu, X, Home, Users } from "lucide-react";
import { UserMenu } from "./user-menu";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface MobileMenuProps {
  user: SupabaseUser | null;
  className?: string;
}

export function MobileMenu({ user, className }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  // Close menu on escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMenu}
        aria-label="메뉴 열기/닫기"
      >
        {isOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel */}
          <div className={`fixed top-16 left-0 right-0 z-50 bg-background border-b shadow-lg md:hidden ${className || ""}`}>
            <nav className="container mx-auto px-4 py-6 space-y-6">
              {/* Navigation Links */}
              <div className="space-y-4">
                <Link
                  href="/"
                  className="flex items-center space-x-3 text-base font-medium text-foreground hover:text-primary transition-colors"
                  onClick={closeMenu}
                >
                  <Home className="h-5 w-5" />
                  <span>홈</span>
                </Link>
                <Link
                  href="/community"
                  className="flex items-center space-x-3 text-base font-medium text-foreground hover:text-primary transition-colors"
                  onClick={closeMenu}
                >
                  <Users className="h-5 w-5" />
                  <span>커뮤니티</span>
                </Link>
              </div>

              {/* User Actions */}
              <div className="pt-4 border-t border-border space-y-3">
                
                {user ? (
                  <div className="flex items-center space-x-2">
                    <UserMenu user={user} />
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start space-x-2"
                    onClick={closeMenu}
                    asChild
                  >
                    <Link href="/signin">
                      <User className="h-4 w-4" />
                      <span>로그인</span>
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}