// src/app/admin/products/product-form.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { slugify } from "@/lib/utils";
import type { Category, Product } from "@prisma/client";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(
    product ? JSON.parse(product.images || "[]") : []
  );
  const [imageInput, setImageInput] = useState("");

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      comparePrice: product?.comparePrice ?? "",
      stock: product?.stock ?? 0,
      featured: product?.featured ?? false,
      active: product?.active ?? true,
      material: product?.material ?? "",
      categoryId: product?.categoryId ?? "",
    },
  });

  const nameValue = watch("name");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("name", e.target.value);
    if (!product) setValue("slug", slugify(e.target.value));
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput("");
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const url = product ? `/api/products/${product.id}` : "/api/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, images }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) { toast(json.error ?? "Error saving product", "error"); return; }
    toast(`Product ${product ? "updated" : "created"} successfully`, "success");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
      <div className="bg-white border border-stone-100 divide-y divide-stone-100">
        {/* Basic Info */}
        <div className="p-6 space-y-4">
          <h2 className="text-[10px] tracking-widest uppercase text-stone-400">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Product Name *" placeholder="e.g. Celestial Diamond Ring"
                {...register("name", { required: "Name is required" })}
                onChange={handleNameChange}
                error={errors.name?.message as string}
              />
            </div>
            <Input label="Slug *" placeholder="celestial-diamond-ring"
              {...register("slug", { required: "Slug is required" })}
              error={errors.slug?.message as string}
            />
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2">Category *</label>
              <select className="w-full h-11 border border-stone-200 bg-white px-4 text-sm focus:outline-none focus:border-stone-900"
                {...register("categoryId", { required: "Category is required" })}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message as string}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2">Description *</label>
              <textarea className="w-full border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-stone-900 resize-none h-28"
                placeholder="Describe the product..."
                {...register("description", { required: "Description is required" })} />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-6 space-y-4">
          <h2 className="text-[10px] tracking-widest uppercase text-stone-400">Pricing & Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Price (₹) *" type="number" {...register("price", { required: true, min: 1 })} />
            <Input label="Compare Price (₹)" type="number" placeholder="Original price (optional)" {...register("comparePrice")} />
            <Input label="Stock *" type="number" {...register("stock", { required: true, min: 0 })} />
          </div>
          <Input label="Material" placeholder="e.g. 18K Gold, Sterling Silver" {...register("material")} />
        </div>

        {/* Images */}
        <div className="p-6 space-y-4">
          <h2 className="text-[10px] tracking-widest uppercase text-stone-400">Product Images</h2>
          <div className="flex gap-2">
            <input className="flex-1 h-11 border border-stone-200 px-4 text-sm focus:outline-none focus:border-stone-900"
              placeholder="Image URL (e.g. https://... or /images/...)"
              value={imageInput} onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
            />
            <button type="button" onClick={addImage}
              className="px-4 border border-stone-200 text-sm hover:bg-stone-50 transition-colors">
              Add
            </button>
          </div>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <div className="h-20 w-16 bg-stone-100 overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flags */}
        <div className="p-6">
          <h2 className="text-[10px] tracking-widest uppercase text-stone-400 mb-4">Visibility</h2>
          <div className="flex gap-8">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="accent-stone-900" {...register("active")} />
              Active (visible in store)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="accent-stone-900" {...register("featured")} />
              Featured (show on homepage)
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <Button type="submit" loading={loading}>
          {product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
