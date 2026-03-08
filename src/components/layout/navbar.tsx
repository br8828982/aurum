// src/components/layout/navbar.tsx
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const { itemCount, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Rings", href: "/shop?category=rings" },
    { label: "Necklaces", href: "/shop?category=necklaces" },
    { label: "Earrings", href: "/shop?category=earrings" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-xl tracking-[0.2em] font-light text-stone-900">
            AURUM
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/search" className="text-stone-600 hover:text-stone-900">
              <Search className="h-4.5 w-4.5" />
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-stone-600 hover:text-stone-900 flex items-center gap-1">
                <User className="h-4.5 w-4.5" />
                {session && <ChevronDown className="h-3 w-3" />}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-8 w-48 bg-white border border-stone-100 shadow-lg z-50">
                  {session ? (
                    <>
                      <div className="px-4 py-3 border-b border-stone-100">
                        <p className="text-xs font-medium text-stone-900">{session.user.name}</p>
                        <p className="text-xs text-stone-500">{session.user.email}</p>
                      </div>
                      <Link href="/account/orders" onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
                        My Orders
                      </Link>
                      {session.user.role === "ADMIN" && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 font-medium">
                          Admin Dashboard
                        </Link>
                      )}
                      <button onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-stone-50 border-t border-stone-100">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
                        Sign In
                      </Link>
                      <Link href="/register" onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button onClick={toggleCart}
              className="relative text-stone-600 hover:text-stone-900">
              <ShoppingBag className="h-4.5 w-4.5" />
              {itemCount() > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-gold text-white text-[10px] flex items-center justify-center">
                  {itemCount()}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button className="md:hidden text-stone-600" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="text-sm tracking-widest uppercase text-stone-700">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
      {/* Spacer */}
      <div className="h-16" />

      {/* Backdrop for user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}
