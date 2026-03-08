// src/app/(store)/checkout/page.tsx
"use client";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toaster";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });

  const subtotal = total();
  const shipping = subtotal >= 5000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.03);
  const grandTotal = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      toast("Please fill in all required fields", "error"); return;
    }
    if (items.length === 0) { toast("Your cart is empty", "error"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity, size: i.size })),
          shippingAddress: form,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Order failed");
      clearCart();
      toast("Order placed successfully! 🎉", "success");
      router.push("/");
    } catch (err: any) {
      toast(err.message, "error");
    }
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-2xl font-light text-stone-400">Your cart is empty</p>
        <Button asChild variant="outline"><a href="/shop">Browse Shop</a></Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl font-light mb-10">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        {/* Form */}
        <div className="space-y-5">
          <h2 className="text-[10px] tracking-widest uppercase text-stone-400">Shipping Address</h2>
          <Input label="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Address Line 1 *" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
          <Input label="Address Line 2" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input label="State *" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <Input label="PIN Code *" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} maxLength={6} />

          <div className="pt-4">
            <h2 className="text-[10px] tracking-widest uppercase text-stone-400 mb-4">Payment</h2>
            <div className="border border-stone-200 p-4 bg-stone-50">
              <p className="text-sm text-stone-600">Cash on Delivery / Bank Transfer</p>
              <p className="text-xs text-stone-400 mt-1">Payment instructions will be sent to your email after order confirmation.</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-[10px] tracking-widest uppercase text-stone-400 mb-4">Order Summary</h2>
          <div className="bg-white border border-stone-100 divide-y divide-stone-50">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-4 p-4">
                <div className="h-14 w-10 bg-stone-50 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                  {item.size && <p className="text-xs text-stone-400">Size {item.size}</p>}
                  <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm text-stone-500">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500">
                <span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500">
                <span>GST (3%)</span><span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-medium pt-3 border-t border-stone-100">
                <span>Total</span>
                <span className="font-serif text-xl font-light">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

          <Button className="w-full mt-6" size="lg" onClick={handlePlaceOrder} loading={loading}>
            Place Order
          </Button>
          <p className="text-center text-xs text-stone-400 mt-3">By placing your order, you agree to our Terms & Conditions</p>
        </div>
      </div>
    </div>
  );
}
