// src/app/admin/products/new/page.tsx
import { ProductForm } from "../product-form";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="font-serif text-3xl font-light mb-8">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
