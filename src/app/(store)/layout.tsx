// src/app/(store)/layout.tsx  
"use client";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { CartSidebar } from "@/components/store/cart-sidebar";

function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-serif text-white text-xl tracking-[0.2em] mb-4">AURUM</p>
          <p className="text-sm leading-relaxed text-stone-500">Fine jewellery crafted for the modern soul.</p>
        </div>
        {[
          { title: "Shop", links: ["Rings", "Necklaces", "Earrings", "Bracelets"] },
          { title: "Company", links: ["About Us", "Craftsmanship", "Sustainability"] },
          { title: "Help", links: ["Size Guide", "Shipping & Returns", "Contact Us"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-[10px] tracking-widest uppercase text-stone-300 mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}><a href="#" className="text-sm text-stone-500 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-stone-800 px-6 py-5 max-w-7xl mx-auto flex justify-between text-xs text-stone-600">
        <p>© 2025 AURUM Jewellery.</p><p>Made with ♡ in India</p>
      </div>
    </footer>
  );
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      <CartSidebar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </SessionProvider>
  );
}
