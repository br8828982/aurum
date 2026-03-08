// src/app/admin/orders/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import { OrderStatusUpdater } from "./order-status-updater";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
      address: true,
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
  });

  if (!order) notFound();

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="text-stone-400 hover:text-stone-700">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-light">{order.orderNumber}</h1>
          <p className="text-stone-400 text-sm">{formatDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <span className={`text-xs px-3 py-1.5 border ${getStatusColor(order.status)}`}>{order.status}</span>
          <span className={`text-xs px-3 py-1.5 border ${getStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — items + totals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-stone-100">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="font-medium text-stone-900">Order Items</h2>
            </div>
            <div className="divide-y divide-stone-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-14 w-10 bg-stone-50 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    {item.size && <p className="text-xs text-stone-400">Size: {item.size}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{item.quantity} × {formatPrice(item.price)}</p>
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-stone-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Tax (3%)</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-stone-100">
                <span>Total</span>
                <span className="font-serif text-xl font-light">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Update status */}
          <div className="bg-white border border-stone-100 p-6">
            <h2 className="font-medium text-stone-900 mb-4">Update Order Status</h2>
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} currentPayment={order.paymentStatus} />
          </div>
        </div>

        {/* Right — customer + address */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-100 p-5">
            <h2 className="text-[10px] tracking-widest uppercase text-stone-400 mb-4">Customer</h2>
            <p className="text-sm font-medium">{order.user.name ?? "—"}</p>
            <p className="text-sm text-stone-500">{order.user.email}</p>
            <p className="text-xs text-stone-400 mt-2">Customer since {formatDate(order.user.createdAt)}</p>
          </div>

          {order.address && (
            <div className="bg-white border border-stone-100 p-5">
              <h2 className="text-[10px] tracking-widest uppercase text-stone-400 mb-4">Shipping Address</h2>
              <div className="text-sm text-stone-700 space-y-1">
                <p className="font-medium">{order.address.name}</p>
                <p>{order.address.phone}</p>
                <p>{order.address.line1}</p>
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
