// src/app/admin/orders/[id]/order-status-updater.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

const ORDER_STATUSES = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED"];
const PAYMENT_STATUSES = ["PENDING","PAID","FAILED","REFUNDED"];

export function OrderStatusUpdater({
  orderId, currentStatus, currentPayment
}: { orderId: string; currentStatus: string; currentPayment: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [payment, setPayment] = useState(currentPayment);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus: payment }),
    });
    setLoading(false);
    if (res.ok) { toast("Order updated successfully", "success"); router.refresh(); }
    else toast("Failed to update order", "error");
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-2">Order Status</label>
        <select className="w-full h-11 border border-stone-200 bg-white px-4 text-sm focus:outline-none focus:border-stone-900"
          value={status} onChange={(e) => setStatus(e.target.value)}>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-2">Payment Status</label>
        <select className="w-full h-11 border border-stone-200 bg-white px-4 text-sm focus:outline-none focus:border-stone-900"
          value={payment} onChange={(e) => setPayment(e.target.value)}>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="col-span-2">
        <Button onClick={handleUpdate} loading={loading} disabled={status === currentStatus && payment === currentPayment}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
