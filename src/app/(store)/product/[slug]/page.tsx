// src/app/(store)/product/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AddToCartSection } from "./add-to-cart-section";
import { ProductCard } from "@/components/store/product-card";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, active: true },
    include: { category: true, reviews: { include: { user: { select: { name: true } } }, take: 5 } },
  });

  if (!product) notFound();

  const images: string[] = (() => {
    try { return JSON.parse(product.images); } catch { return []; }
  })();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, active: true, id: { not: product.id } },
    include: { category: true },
    take: 4,
  });

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-stone-400 mb-8 flex items-center gap-2">
        <a href="/" className="hover:text-stone-700">Home</a>
        <span>/</span>
        <a href="/shop" className="hover:text-stone-700">Shop</a>
        <span>/</span>
        <a href={`/shop?category=${product.category.slug}`} className="hover:text-stone-700">{product.category.name}</a>
        <span>/</span>
        <span className="text-stone-600">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-stone-50">
            {images[0] ? (
              <Image src={images[0]} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-24 h-24 text-stone-200" viewBox="0 0 80 80" fill="none">
                  <polygon points="40,8 68,38 40,52 12,38" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square bg-stone-50">
                  <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gold mb-2">{product.category.name}</p>
          <h1 className="font-serif text-4xl font-light leading-tight mb-3">{product.name}</h1>

          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-gold text-sm">{"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}</div>
              <span className="text-xs text-stone-400">({product.reviews.length} reviews)</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-stone-100">
            <span className="font-serif text-3xl font-light">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <>
                <span className="text-stone-400 line-through text-lg">{formatPrice(product.comparePrice)}</span>
                <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700">{discount}% Off</span>
              </>
            )}
          </div>

          <AddToCartSection product={product} />

          <div className="mt-8 space-y-4">
            <h3 className="text-[10px] tracking-widest uppercase text-stone-400">Description</h3>
            <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>
          </div>

          {product.material && (
            <div className="mt-6 pt-6 border-t border-stone-100 space-y-2">
              <div className="flex justify-between text-sm py-2 border-b border-stone-50">
                <span className="text-stone-500">Material</span>
                <span className="text-stone-900">{product.material}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-stone-50">
                <span className="text-stone-500">Stock</span>
                <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
                  {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20 pt-12 border-t border-stone-100">
          <h2 className="font-serif text-3xl font-light mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
