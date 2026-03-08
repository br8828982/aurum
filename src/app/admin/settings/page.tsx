// src/app/admin/settings/page.tsx
import { auth } from "@/lib/auth";

export default async function AdminSettingsPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="font-serif text-3xl font-light mb-8">Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="bg-white border border-stone-100">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-medium">Admin Profile</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-2">Name</label>
              <input className="w-full h-11 border border-stone-200 px-4 text-sm" defaultValue={session?.user.name ?? ""} />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-2">Email</label>
              <input className="w-full h-11 border border-stone-200 px-4 text-sm bg-stone-50" value={session?.user.email ?? ""} readOnly />
            </div>
            <button className="bg-stone-900 text-white px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-gold transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        {/* Store Settings */}
        <div className="bg-white border border-stone-100">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-medium">Store Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: "Store Name", defaultValue: "AURUM Jewellery" },
              { label: "Support Email", defaultValue: "support@aurum.com" },
              { label: "Currency", defaultValue: "INR (₹)" },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-2">{field.label}</label>
                <input className="w-full h-11 border border-stone-200 px-4 text-sm" defaultValue={field.defaultValue} />
              </div>
            ))}
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-2">Free Shipping Threshold</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-500">₹</span>
                <input className="flex-1 h-11 border border-stone-200 px-4 text-sm" defaultValue="5000" />
              </div>
              <p className="text-xs text-stone-400 mt-1">Orders above this amount get free shipping</p>
            </div>
            <button className="bg-stone-900 text-white px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-gold transition-colors">
              Save Settings
            </button>
          </div>
        </div>

        {/* Tech info */}
        <div className="bg-stone-50 border border-stone-100 p-5 text-xs text-stone-500 space-y-1">
          <p className="font-medium text-stone-600 mb-2">Stack</p>
          <p>Next.js 15 (App Router) · TypeScript · Prisma ORM · NextAuth v5</p>
          <p>Tailwind CSS · Zustand · SQLite (dev) · PostgreSQL (prod)</p>
        </div>
      </div>
    </div>
  );
}
