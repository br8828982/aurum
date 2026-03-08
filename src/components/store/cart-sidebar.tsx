// src/components/store/cart-sidebar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart();

  const getFirstImage = (images: string) => {
    try { return JSON.parse(images)[0] ?? "/images/placeholder.jpg"; }
    catch { return "/images/placeholder.jpg"; }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={closeCart} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <h2 className="font-serif text-xl font-light tracking-wide">Your Cart ({items.length})</h2>
          <button onClick={closeCart} className="text-stone-400 hover:text-stone-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag className="h-12 w-12 text-stone-200" />
              <div>
                <p className="font-serif text-xl font-light text-stone-700">Your cart is empty</p>
                <p className="text-sm text-stone-400 mt-1">Add some beautiful pieces</p>
              </div>
              <Button variant="outline" onClick={closeCart} asChild>
                <Link href="/shop">Browse Shop</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                  <div className="relative h-20 w-16 bg-stone-50 flex-shrink-0">
                    <Image
                      src={getFirstImage(item.product.images)}
                      alt={item.product.name}
                      fill className="object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.slug}`}
                      className="text-sm font-medium text-stone-900 hover:text-gold line-clamp-1">
                      {item.product.name}
                    </Link>
                    {item.size && <p className="text-xs text-stone-500 mt-0.5">Size: {item.size}</p>}
                    <p className="text-sm font-medium mt-1">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}
                        className="h-6 w-6 flex items-center justify-center border border-stone-200 hover:border-stone-900">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}
                        disabled={item.quantity >= item.product.stock}
                        className="h-6 w-6 flex items-center justify-center border border-stone-200 hover:border-stone-900 disabled:opacity-40">
                        <Plus className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeItem(item.product.id, item.size)}
                        className="ml-auto text-stone-400 hover:text-red-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500">Subtotal</span>
              <span className="font-serif text-xl font-light">{formatPrice(total())}</span>
            </div>
            <p className="text-xs text-stone-400 text-center">Shipping & taxes calculated at checkout</p>
            <Button className="w-full" onClick={closeCart} asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={closeCart} asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
