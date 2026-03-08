// src/app/api/admin/customers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search");
  const skip = (page - 1) * limit;

  const where: any = { role: "CUSTOMER" };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, createdAt: true,
        _count: { select: { orders: true } },
        orders: { select: { total: true }, where: { paymentStatus: "PAID" } },
      },
      orderBy: { createdAt: "desc" },
      skip, take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const customersWithStats = customers.map((c) => ({
    ...c,
    totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
    orderCount: c._count.orders,
    orders: undefined,
    _count: undefined,
  }));

  return NextResponse.json({ customers: customersWithStats, total, pages: Math.ceil(total / limit) });
}
