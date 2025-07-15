"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function MobileMenu({ isOpen, onClose, className }: MobileMenuProps) {
  // Close menu on escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div className={`fixed top-16 left-0 right-0 z-50 bg-background border-b shadow-lg md:hidden ${className || ""}`}>
        <nav className="container mx-auto px-4 py-6 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-4">
            <Link
              href="/projects"
              className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={onClose}
            >
              프로젝트
            </Link>
            <Link
              href="/about"
              className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={onClose}
            >
              소개
            </Link>
            <Link
              href="/contact"
              className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={onClose}
            >
              문의
            </Link>
          </div>

          {/* User Actions */}
          <div className="pt-4 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full justify-start space-x-2"
              onClick={onClose}
            >
              <User className="h-4 w-4" />
              <span>로그인</span>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}