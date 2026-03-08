// src/app/admin/orders/page.tsx
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";

const statuses = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"];

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string; page?: string } }) {
  const page = parseInt(searchParams.page ?? "1");
  const limit = 15;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (searchParams.status) where.status = searchParams.status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
        address: true,
      },
      orderBy: { createdAt: "desc" },
      skip, take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-stone-900">Orders</h1>
        <p className="text-stone-500 text-sm mt-1">{total} total orders</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/admin/orders"
          className={`px-3 py-1.5 text-xs tracking-widest uppercase border transition-colors ${!searchParams.status ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 text-stone-600 hover:border-stone-900"}`}>
          All
        </Link>
        {statuses.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 text-xs tracking-widest uppercase border transition-colors ${searchParams.status === s ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 text-stone-600 hover:border-stone-900"}`}>
            {s}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              {["Order", "Customer", "Items", "Total", "Status", "Payment", "Date"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-[10px] tracking-widest uppercase text-stone-400 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-stone-900 hover:text-gold">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-stone-900">{order.user.name ?? "—"}</p>
                  <p className="text-xs text-stone-400">{order.user.email}</p>
                </td>
                <td className="px-5 py-4 text-sm text-stone-600">{order.items.length} item(s)</td>
                <td className="px-5 py-4 text-sm font-medium">{formatPrice(order.total)}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-1 border ${getStatusColor(order.status)}`}>{order.status}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-1 border ${getStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
                </td>
                <td className="px-5 py-4 text-xs text-stone-400">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-stone-400">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`/admin/orders?page=${p}${searchParams.status ? `&status=${searchParams.status}` : ""}`}
              className={`h-9 w-9 flex items-center justify-center text-sm border transition-colors ${page === p ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 text-stone-600 hover:border-stone-900"}`}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
