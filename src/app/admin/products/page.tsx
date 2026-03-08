// src/app/admin/products/page.tsx
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";

export default async function AdminProductsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page ?? "1");
  const limit = 15;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip, take: limit,
    }),
    prisma.product.count(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-stone-900">Products</h1>
          <p className="text-stone-500 text-sm mt-1">{total} total products</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-gold transition-colors">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              {["Product", "Category", "Price", "Stock", "Status", "Created", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-[10px] tracking-widest uppercase text-stone-400 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {products.map((product) => {
              const images = (() => { try { return JSON.parse(product.images) as string[]; } catch { return []; } })();
              return (
                <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 bg-stone-100 flex-shrink-0 overflow-hidden">
                        {images[0] && <img src={images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-stone-400">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-stone-600">{product.category.name}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                    {product.comparePrice && (
                      <p className="text-xs text-stone-400 line-through">{formatPrice(product.comparePrice)}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 ${product.stock <= 0 ? "bg-red-50 text-red-600" : product.stock < 5 ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
                      {product.stock} left
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 ${product.active ? "bg-green-50 text-green-700 border border-green-100" : "bg-stone-50 text-stone-500 border border-stone-100"}`}>
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-stone-400">{formatDate(product.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}
                        className="h-7 w-7 flex items-center justify-center hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors">
                        <Edit className="h-3.5 w-3.5" />
                      </Link>
                      <Link href={`/product/${product.slug}`}
                        className="h-7 w-7 flex items-center justify-center hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
