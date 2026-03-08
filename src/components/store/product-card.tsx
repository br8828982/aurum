// src/components/store/product-card.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/components/ui/toaster";
import { formatPrice } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const { addItem, openCart } = useCart();

  const images = (() => {
    try { return JSON.parse(product.images) as string[]; }
    catch { return []; }
  })();

  const firstImage = images[0] ?? null;
  const secondImage = images[1] ?? null;
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      slug: product.slug,
      stock: product.stock,
    });
    toast(`${product.name} added to cart`, "success");
    openCart();
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden mb-4">
        {firstImage ? (
          <>
            <Image src={firstImage} alt={product.name} fill className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }} />
            {secondImage && (
              <Image src={secondImage} alt={product.name} fill className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-200">
            <svg className="w-16 h-16" viewBox="0 0 80 80" fill="none">
              <polygon points="40,8 68,38 40,52 12,38" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <ellipse cx="40" cy="65" rx="28" ry="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <line x1="12" y1="60" x2="12" y2="41" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="68" y1="60" x2="68" y2="41" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="bg-stone-900 text-white text-[10px] tracking-widest uppercase px-2 py-1">New</span>
          )}
          {discount && (
            <span className="bg-gold text-white text-[10px] tracking-widest uppercase px-2 py-1">{discount}% Off</span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="h-8 w-8 bg-white flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors shadow-sm"
            onClick={(e) => { e.preventDefault(); toast("Added to wishlist", "info"); }}>
            <Heart className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-stone-900 text-white py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button onClick={handleAddToCart} className="w-full flex items-center justify-center gap-2 text-xs tracking-widest uppercase">
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs tracking-widest uppercase text-stone-500">Sold Out</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">{product.category.name}</p>
        <h3 className="font-serif text-lg font-light text-stone-900 group-hover:text-gold transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-xs text-stone-400 line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
