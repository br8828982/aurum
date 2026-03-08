// src/app/(store)/product/[slug]/add-to-cart-section.tsx
"use client";
import { useState } from "react";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

const SIZES = ["5", "6", "7", "8", "9", "10"];

interface Product {
  id: string; name: string; price: number; images: string;
  slug: string; stock: number; categoryId: string;
}

export function AddToCartSection({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | undefined>(undefined);
  const { addItem, openCart } = useCart();

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, images: product.images, slug: product.slug, stock: product.stock }, qty, size);
    toast(`${product.name} added to cart`, "success");
    openCart();
  };

  return (
    <div className="space-y-5">
      {/* Size selector */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-3">Ring Size (optional)</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button key={s} onClick={() => setSize(size === s ? undefined : s)}
              className={`h-9 w-9 text-sm border transition-colors ${size === s ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 text-stone-600 hover:border-stone-900"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Qty */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-3">Quantity</p>
        <div className="flex items-center border border-stone-200 w-fit">
          <button onClick={() => setQty(Math.max(1, qty - 1))}
            className="h-10 w-10 flex items-center justify-center hover:bg-stone-50 text-stone-600">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="h-10 w-12 flex items-center justify-center text-sm font-medium">{qty}</span>
          <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
            disabled={qty >= product.stock}
            className="h-10 w-10 flex items-center justify-center hover:bg-stone-50 text-stone-600 disabled:opacity-30">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <Button onClick={handleAdd} disabled={product.stock === 0} className="gap-2" size="lg">
          <ShoppingBag className="h-4 w-4" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button variant="outline" size="lg">♡ &nbsp; Save to Wishlist</Button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-100">
        {[["✦", "Certified"], ["🔒", "Secure Pay"], ["↺", "30-Day Return"]].map(([icon, label]) => (
          <div key={label} className="text-center">
            <div className="text-lg mb-1">{icon}</div>
            <p className="text-[10px] tracking-widest uppercase text-stone-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
