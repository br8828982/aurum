// src/app/admin/customers/page.tsx
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";

export default async function AdminCustomersPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page ?? "1");
  const limit = 15;
  const skip = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true, name: true, email: true, createdAt: true,
        _count: { select: { orders: true } },
        orders: { select: { total: true }, where: { paymentStatus: "PAID" } },
      },
      orderBy: { createdAt: "desc" },
      skip, take: limit,
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light">Customers</h1>
        <p className="text-stone-500 text-sm mt-1">{total} registered customers</p>
      </div>

      <div className="bg-white border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              {["Customer", "Email", "Orders", "Total Spent", "Joined"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-[10px] tracking-widest uppercase text-stone-400 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {customers.map((c) => {
              const totalSpent = c.orders.reduce((sum, o) => sum + o.total, 0);
              return (
                <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-600 inline-flex mr-3">
                      {(c.name ?? c.email)[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-stone-900">{c.name ?? "—"}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-stone-600">{c.email}</td>
                  <td className="px-5 py-4 text-sm text-stone-600">{c._count.orders}</td>
                  <td className="px-5 py-4 text-sm font-medium">{formatPrice(totalSpent)}</td>
                  <td className="px-5 py-4 text-xs text-stone-400">{formatDate(c.createdAt)}</td>
                </tr>
              );
            })}
            {customers.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-stone-400">No customers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
