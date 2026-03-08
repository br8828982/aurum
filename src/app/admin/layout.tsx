// src/app/admin/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Store } from "lucide-react";
import { SessionProvider } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return (
    <SessionProvider>
      <div className="flex h-screen bg-stone-50 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-stone-900 flex flex-col flex-shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-stone-800">
            <span className="font-serif text-white text-lg tracking-[0.2em]">AURUM</span>
            <span className="ml-2 text-[9px] tracking-widest uppercase text-stone-500 mt-1">Admin</span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors group">
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="p-3 border-t border-stone-800 space-y-0.5">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors">
              <Store className="h-4 w-4" />
              View Store
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          </div>

          <div className="px-4 py-3 border-t border-stone-800">
            <p className="text-xs text-stone-500 truncate">{session.user.name}</p>
            <p className="text-[11px] text-stone-600 truncate">{session.user.email}</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-16 bg-white border-b border-stone-100 px-8 flex items-center">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Admin</span>
            </div>
          </div>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
