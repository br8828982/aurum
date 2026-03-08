// src/app/(store)/shop/page.tsx
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/product-card";

interface ShopPageProps {
  searchParams: { category?: string; search?: string; sort?: string; page?: string };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const page = parseInt(searchParams.page ?? "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: any = { active: true };
  if (searchParams.category) where.category = { slug: searchParams.category };
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
    ];
  }

  const orderBy: any =
    searchParams.sort === "price_asc" ? { price: "asc" }
    : searchParams.sort === "price_desc" ? { price: "desc" }
    : { createdAt: "desc" };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, skip, take: limit, orderBy }),
    prisma.product.count({ where }),
    prisma.category.findMany({ include: { _count: { select: { products: { where: { active: true } } } } } }),
  ]);

  const pages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-5xl font-light mb-2">
          {searchParams.category
            ? categories.find((c) => c.slug === searchParams.category)?.name ?? "Shop"
            : "All Jewellery"}
        </h1>
        <p className="text-stone-400 text-sm">{total} pieces</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        {/* Sidebar filters */}
        <aside>
          <div className="space-y-8 sticky top-24">
            {/* Categories */}
            <div>
              <h3 className="text-[10px] tracking-widest uppercase text-stone-400 mb-4">Category</h3>
              <div className="space-y-2">
                <a href="/shop" className={`block text-sm py-1 border-b border-transparent hover:text-gold transition-colors ${!searchParams.category ? "text-stone-900 font-medium" : "text-stone-500"}`}>
                  All Jewellery
                </a>
                {categories.map((cat) => (
                  <a key={cat.id} href={`/shop?category=${cat.slug}`}
                    className={`block text-sm py-1 border-b border-transparent hover:text-gold transition-colors flex justify-between ${searchParams.category === cat.slug ? "text-stone-900 font-medium" : "text-stone-500"}`}>
                    <span>{cat.name}</span>
                    <span className="text-stone-400 text-xs">{cat._count.products}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-[10px] tracking-widest uppercase text-stone-400 mb-4">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: "", label: "Featured" },
                  { value: "price_asc", label: "Price: Low to High" },
                  { value: "price_desc", label: "Price: High to Low" },
                ].map((opt) => (
                  <a key={opt.value}
                    href={`/shop?${new URLSearchParams({ ...searchParams, sort: opt.value }).toString()}`}
                    className={`block text-sm py-1 hover:text-gold transition-colors ${searchParams.sort === opt.value || (!searchParams.sort && !opt.value) ? "text-stone-900 font-medium" : "text-stone-500"}`}>
                    {opt.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div>
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl font-light text-stone-400">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <a key={p}
                      href={`/shop?${new URLSearchParams({ ...searchParams, page: String(p) }).toString()}`}
                      className={`h-9 w-9 flex items-center justify-center text-sm border transition-colors ${page === p ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 text-stone-600 hover:border-stone-900"}`}>
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
