// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@aurum.com" },
    update: {},
    create: {
      email: "admin@aurum.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Test customer
  const customerPassword = await bcrypt.hash("customer123", 12);
  await prisma.user.upsert({
    where: { email: "customer@test.com" },
    update: {},
    create: {
      email: "customer@test.com",
      name: "Test Customer",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  // Categories
  const rings = await prisma.category.upsert({
    where: { slug: "rings" },
    update: {},
    create: { name: "Rings", slug: "rings", description: "Fine rings for every occasion" },
  });
  const necklaces = await prisma.category.upsert({
    where: { slug: "necklaces" },
    update: {},
    create: { name: "Necklaces", slug: "necklaces", description: "Elegant necklaces and pendants" },
  });
  const earrings = await prisma.category.upsert({
    where: { slug: "earrings" },
    update: {},
    create: { name: "Earrings", slug: "earrings", description: "Statement earrings" },
  });
  const bracelets = await prisma.category.upsert({
    where: { slug: "bracelets" },
    update: {},
    create: { name: "Bracelets", slug: "bracelets", description: "Wrist adornments" },
  });

  // Products
  const products = [
    {
      name: "Celestial Diamond Ring",
      slug: "celestial-diamond-ring",
      description: "An 18K gold ring featuring a 0.35ct IGI-certified diamond with hand-engraved celestial motifs. A masterpiece of understated luxury.",
      price: 48000,
      comparePrice: 56000,
      images: JSON.stringify(["/images/ring-1.jpg", "/images/ring-1b.jpg"]),
      stock: 12,
      featured: true,
      material: "18K Gold",
      categoryId: rings.id,
    },
    {
      name: "Moonstone Solitaire",
      slug: "moonstone-solitaire",
      description: "A delicate sterling silver ring cradling a luminous moonstone — nature's own galaxy captured in metal.",
      price: 12500,
      comparePrice: null,
      images: JSON.stringify(["/images/ring-2.jpg"]),
      stock: 20,
      featured: true,
      material: "Sterling Silver",
      categoryId: rings.id,
    },
    {
      name: "Jhumka Heritage Drops",
      slug: "jhumka-heritage-drops",
      description: "Traditional 22K gold jhumkas reimagined with a modern silhouette. Handcrafted by master artisans in Jaipur.",
      price: 32000,
      comparePrice: 38000,
      images: JSON.stringify(["/images/earring-1.jpg"]),
      stock: 8,
      featured: true,
      material: "22K Gold",
      categoryId: earrings.id,
    },
    {
      name: "Pearl Strand Necklace",
      slug: "pearl-strand-necklace",
      description: "A 18-inch strand of AAA freshwater pearls on an 18K gold clasp. Timeless, elegant, forever.",
      price: 22500,
      comparePrice: null,
      images: JSON.stringify(["/images/necklace-1.jpg"]),
      stock: 15,
      featured: false,
      material: "Gold & Pearl",
      categoryId: necklaces.id,
    },
    {
      name: "Emerald Tennis Bracelet",
      slug: "emerald-tennis-bracelet",
      description: "A continuous line of emerald-cut Colombian emeralds set in 18K white gold. The ultimate statement piece.",
      price: 65000,
      comparePrice: null,
      images: JSON.stringify(["/images/bracelet-1.jpg"]),
      stock: 5,
      featured: true,
      material: "18K White Gold",
      categoryId: bracelets.id,
    },
    {
      name: "Amethyst Teardrop Pendant",
      slug: "amethyst-teardrop-pendant",
      description: "A pear-cut amethyst suspended in rose gold. Minimal design, maximum impact.",
      price: 12000,
      comparePrice: 15000,
      images: JSON.stringify(["/images/necklace-2.jpg"]),
      stock: 18,
      featured: false,
      material: "Rose Gold",
      categoryId: necklaces.id,
    },
    {
      name: "Ruby Solitaire Ring",
      slug: "ruby-solitaire-ring",
      description: "A Burmese ruby of exceptional colour set in a classic 22K gold prong setting. Passion embodied.",
      price: 55000,
      comparePrice: null,
      images: JSON.stringify(["/images/ring-3.jpg"]),
      stock: 6,
      featured: false,
      material: "22K Gold",
      categoryId: rings.id,
    },
    {
      name: "Diamond Hoop Earrings",
      slug: "diamond-hoop-earrings",
      description: "Classic diamond-studded hoops in 18K white gold. Versatile enough for every day, special enough for every occasion.",
      price: 38000,
      comparePrice: 42000,
      images: JSON.stringify(["/images/earring-2.jpg"]),
      stock: 10,
      featured: false,
      material: "18K White Gold",
      categoryId: earrings.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("✅ Seed complete!");
  console.log("👤 Admin: admin@aurum.com / admin123");
  console.log("👤 Customer: customer@test.com / customer123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
