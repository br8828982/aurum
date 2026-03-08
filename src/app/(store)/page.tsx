// src/app/(store)/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, active: true },
    include: { category: true },
    take: 4,
  });
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: { where: { active: true } } } } },
  });
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  const categoryIcons: Record<string, string> = {
    rings: "💍", necklaces: "📿", earrings: "✨", bracelets: "⌚",
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center py-20">
          <div className="animate-fade-in">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gold mb-6">New Collection · 2025</p>
            <h1 className="font-serif text-6xl md:text-7xl font-light leading-[1.05] text-stone-900 mb-6">
              Wear Your<br /><em className="text-gold not-italic">Story</em> in Gold
            </h1>
            <p className="text-stone-500 leading-relaxed mb-10 max-w-md">
              Curated fine jewellery for the modern woman — crafted with intention, worn with love. Each piece is individually made by master artisans in Jaipur.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button asChild size="lg">
                <Link href="/shop">Explore Collection</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>

          {/* Hero SVG illustration */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-50 to-stone-100 blur-3xl scale-110" />
              <svg className="relative animate-float w-[360px] h-[360px]" viewBox="0 0 360 360" fill="none">
                <polygon points="180,30 260,130 180,170 100,130" fill="#e8d5b0" stroke="#c9a96e" strokeWidth="2"/>
                <polygon points="180,30 260,130 180,108" fill="#c9a96e" opacity="0.75"/>
                <polygon points="180,30 100,130 180,108" fill="#b89060" opacity="0.55"/>
                <polygon points="260,130 180,170 180,108" fill="#d4b880" opacity="0.65"/>
                <polygon points="100,130 180,170 180,108" fill="#c9a96e" opacity="0.45"/>
                <ellipse cx="180" cy="240" rx="80" ry="20" stroke="#c9a96e" strokeWidth="2" fill="none" opacity="0.6"/>
                <line x1="100" y1="232" x2="100" y2="138" stroke="#c9a96e" strokeWidth="2"/>
                <line x1="260" y1="232" x2="260" y2="138" stroke="#c9a96e" strokeWidth="2"/>
                <line x1="60" y1="80" x2="60" y2="96" stroke="#c9a96e" strokeWidth="1.5" opacity="0.6"/>
                <line x1="52" y1="88" x2="68" y2="88" stroke="#c9a96e" strokeWidth="1.5" opacity="0.6"/>
                <line x1="300" y1="60" x2="300" y2="72" stroke="#c9a96e" strokeWidth="1.5" opacity="0.5"/>
                <line x1="294" y1="66" x2="306" y2="66" stroke="#c9a96e" strokeWidth="1.5" opacity="0.5"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-stone-300" />
          <p className="text-[10px] tracking-widest uppercase text-stone-400">Scroll</p>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-stone-100 py-4 overflow-hidden bg-white">
        <div className="flex gap-0 animate-marquee whitespace-nowrap" style={{ animation: "marquee 20s linear infinite" }}>
          {Array(3).fill(null).map((_, i) => (
            <span key={i} className="flex items-center">
              {["Fine Jewellery", "Handcrafted in Jaipur", "Certified Diamonds", "Free Shipping", "Lifetime Warranty", "Custom Orders"].map((t) => (
                <span key={t} className="inline-flex items-center gap-6 px-8 font-serif text-base italic text-stone-400">
                  {t} <span className="text-gold not-italic text-xs">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-4xl font-light">Shop by Category</h2>
          <Link href="/shop" className="text-[11px] tracking-widest uppercase text-gold hover:text-amber-700 flex items-center gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] bg-stone-50 overflow-hidden flex flex-col items-center justify-center hover:bg-stone-100 transition-colors">
              <span className="text-4xl mb-4">{categoryIcons[cat.slug] ?? "💎"}</span>
              <div className="text-center px-4">
                <h3 className="font-serif text-xl font-light group-hover:text-gold transition-colors">{cat.name}</h3>
                <p className="text-xs text-stone-400 mt-1">{cat._count.products} pieces</p>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-stone-200 group-hover:bg-gold transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-serif text-4xl font-light">New Arrivals</h2>
            <Link href="/shop" className="text-[11px] tracking-widest uppercase text-gold hover:text-amber-700 flex items-center gap-1">
              Shop All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-stone-100">
          {[
            { icon: "✦", title: "Certified Authentic", desc: "Every piece ships with a certificate of authenticity and material purity documentation." },
            { icon: "♡", title: "Free Gift Wrapping", desc: "All orders arrive in our signature ivory box, ready to delight." },
            { icon: "↺", title: "30-Day Returns", desc: "Return or exchange within 30 days, no questions asked." },
          ].map((p) => (
            <div key={p.title} className="py-10 md:py-0 md:px-12 first:pl-0 last:pr-0 text-center">
              <div className="text-gold text-2xl mb-4">{p.icon}</div>
              <h3 className="font-serif text-xl font-light mb-3">{p.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-stone-900 py-20 text-center text-white">
        <div className="max-w-lg mx-auto px-6">
          <h2 className="font-serif text-4xl font-light mb-4">Something <em className="text-gold">Beautiful</em> is Waiting</h2>
          <p className="text-stone-400 mb-8 text-sm">Subscribe for exclusive access, styling tips, and seasonal offers.</p>
          <div className="flex gap-0">
            <input type="email" placeholder="Your email address"
              className="flex-1 bg-stone-800 border border-stone-700 px-4 py-3 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400" />
            <button className="bg-gold text-white px-6 py-3 text-xs tracking-widest uppercase hover:bg-amber-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
      `}</style>
    </div>
  );
}
