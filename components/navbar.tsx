"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X, Accessibility } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Get Started" },
  { href: "/about", label: "How It Works" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl" role="navigation" aria-label="Main navigation">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight" aria-label="ClassBridge home">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--cb-primary)] to-[var(--cb-accent)] text-white shadow-md">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-[var(--cb-primary)] to-[var(--cb-secondary)] bg-clip-text text-transparent">
            ClassBridge
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-[var(--cb-primary)]/10 text-[var(--cb-primary)]"
                  : "text-[var(--cb-text-muted)] hover:bg-[var(--cb-warm)] hover:text-[var(--cb-text)]"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/upload"
            className="ml-2 inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[var(--cb-primary-dark)] hover:shadow-lg active:scale-[0.98]"
          >
            Try Demo
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-[var(--cb-primary)]/10 text-[var(--cb-primary)]"
                  : "text-[var(--cb-text-muted)] hover:bg-[var(--cb-warm)]"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/upload"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block rounded-xl bg-[var(--cb-primary)] px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Try Demo
          </Link>
        </div>
      )}
    </nav>
  );
}
