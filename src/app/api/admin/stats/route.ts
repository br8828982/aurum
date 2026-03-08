// src/app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
    pendingOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.order.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  // Top products by revenue
  const orderItems = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { price: true, quantity: true },
    orderBy: { _sum: { price: "desc" } },
    take: 5,
  });

  const topProducts = await Promise.all(
    orderItems.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true },
      });
      return {
        name: product?.name ?? "Unknown",
        sold: item._sum.quantity ?? 0,
        revenue: item._sum.price ?? 0,
      };
    })
  );

  return NextResponse.json({
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    recentOrders,
    topProducts,
  });
}
