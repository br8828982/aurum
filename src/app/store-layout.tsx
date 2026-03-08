// src/app/(store)/layout.tsx
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { CartSidebar } from "@/components/store/cart-sidebar";
import { Footer } from "@/components/layout/footer";

function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-serif text-white text-xl tracking-[0.2em] mb-4">AURUM</p>
          <p className="text-sm leading-relaxed text-stone-500">Fine jewellery crafted for the modern soul. Every piece tells a story.</p>
        </div>
        {[
          { title: "Shop", links: ["Rings", "Necklaces", "Earrings", "Bracelets", "New Arrivals"] },
          { title: "Company", links: ["About Us", "Craftsmanship", "Sustainability", "Careers"] },
          { title: "Help", links: ["Size Guide", "Shipping & Returns", "Care Instructions", "Contact Us"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-[10px] tracking-widest uppercase text-stone-300 mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-stone-500 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-stone-800 px-6 py-5 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-stone-600">
        <p>© 2025 AURUM Jewellery. All rights reserved.</p>
        <p>Made with ♡ in India</p>
      </div>
    </footer>
  );
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      <CartSidebar />
      <main>{children}</main>
      <Footer />
    </SessionProvider>
  );
}
