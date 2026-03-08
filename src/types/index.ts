// src/types/index.ts
import type { User, Product, Category, Order, OrderItem, CartItem, Address } from "@prisma/client";

export type ProductWithCategory = Product & { category: Category };

export type CartItemWithProduct = CartItem & {
  product: Product & { category: Category };
};

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
  address: Address | null;
  user: Pick<User, "id" | "name" | "email">;
};

export type OrderItemWithProduct = OrderItem & { product: Product };

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: OrderWithItems[];
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
}

// Extend NextAuth session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}
