// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { TrendingUp, ShoppingBag, Package, Users, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const [
    revenueData,
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.order.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      take: 6, orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, items: true },
    }),
  ]);

  const totalRevenue = revenueData._sum.total ?? 0;

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, change: "+12.5%" },
    { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, change: `${pendingOrders} pending` },
    { label: "Products", value: totalProducts.toString(), icon: Package, change: "Active" },
    { label: "Customers", value: totalCustomers.toString(), icon: Users, change: "+8 this week" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-stone-900">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, change }) => (
          <div key={label} className="bg-white p-5 border border-stone-100">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-stone-50">
                <Icon className="h-4 w-4 text-stone-700" />
              </div>
              <span className="text-xs text-stone-400">{change}</span>
            </div>
            <p className="font-serif text-2xl font-light text-stone-900">{value}</p>
            <p className="text-xs text-stone-500 mt-1 tracking-widest uppercase">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-stone-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="font-medium text-stone-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-gold hover:text-amber-700 flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-stone-50">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{order.orderNumber}</p>
                  <p className="text-xs text-stone-500">{order.user.name ?? order.user.email}</p>
                </div>
                <div className="text-center mx-4">
                  <span className={`text-xs px-2 py-1 border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                  <p className="text-xs text-stone-400">{formatDate(order.createdAt)}</p>
                </div>
              </Link>
            ))}
            {recentOrders.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-stone-400">No orders yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-100 p-5">
            <h2 className="font-medium text-stone-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/admin/products/new"
                className="flex items-center gap-3 p-3 text-sm text-stone-700 hover:bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors">
                <Package className="h-4 w-4 text-stone-400" />
                Add New Product
              </Link>
              <Link href="/admin/orders?status=PENDING"
                className="flex items-center gap-3 p-3 text-sm text-stone-700 hover:bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors">
                <ShoppingBag className="h-4 w-4 text-stone-400" />
                Pending Orders ({pendingOrders})
              </Link>
              <Link href="/admin/customers"
                className="flex items-center gap-3 p-3 text-sm text-stone-700 hover:bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors">
                <Users className="h-4 w-4 text-stone-400" />
                View Customers
              </Link>
            </div>
          </div>

          <div className="bg-stone-900 text-white p-5">
            <h3 className="font-serif text-lg font-light mb-2">Store Live</h3>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">Your AURUM store is live and accepting orders.</p>
            <Link href="/" className="text-xs tracking-widest uppercase text-gold hover:text-amber-400 flex items-center gap-1">
              Visit Store <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
