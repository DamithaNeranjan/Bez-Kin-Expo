import type { Category, Product, SiteSettings } from "../types/catalog";

const now = "2026-07-30T00:00:00.000Z";

export const seedCategories: Category[] = [
  {
    id: "tea",
    name: "Tea",
    slug: "tea",
    description: "Ceylon black tea, herbal blends, and food-service packs for UK retailers.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
    order: 1,
    active: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "rice",
    name: "Rice",
    slug: "rice",
    description: "Everyday and premium rice varieties sourced for consistent quality.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80",
    order: 2,
    active: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "spices",
    name: "Spices",
    slug: "spices",
    description: "Whole and ground spices for independent grocers, caterers, and wholesalers.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
    order: 3,
    active: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "frozen-foods",
    name: "Frozen Foods",
    slug: "frozen-foods",
    description: "Frozen convenience foods and specialty ranges for retail freezers.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80",
    order: 4,
    active: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "beverages",
    name: "Beverages",
    slug: "beverages",
    description: "Ambient drinks, concentrates, and cafe-ready beverage lines.",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
    order: 5,
    active: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "snacks",
    name: "Snacks",
    slug: "snacks",
    description: "Shelf-ready savoury snacks, biscuits, and impulse lines.",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=1200&q=80",
    order: 6,
    active: true,
    createdAt: now,
    updatedAt: now
  }
];

export const seedProducts: Product[] = [
  {
    id: "ceylon-black-tea",
    name: "Ceylon Black Tea",
    slug: "ceylon-black-tea",
    shortDescription: "Bright, brisk black tea packed for retail shelves and food service.",
    description:
      "A classic high-grown Ceylon black tea with a clean finish and dependable cup colour. Suitable for independent retailers, cafes, and hospitality buyers.",
    categoryId: "tea",
    price: 4.95,
    currency: "GBP",
    brand: "Bez-Kin Select",
    origin: "Sri Lanka",
    weight: "250 g",
    sku: "TEA-CBT-250",
    coverImage: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80"
    ],
    available: true,
    featured: true,
    active: true,
    tags: ["tea", "ceylon", "black tea", "retail"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "premium-basmati-rice",
    name: "Premium Basmati Rice",
    slug: "premium-basmati-rice",
    shortDescription: "Long-grain basmati with strong aroma and a fluffy cooked texture.",
    description:
      "A premium basmati line for grocery, catering, and wholesale customers who need reliable grain length, fragrance, and cooking performance.",
    categoryId: "rice",
    price: 12.5,
    currency: "GBP",
    brand: "Bez-Kin Pantry",
    origin: "India",
    weight: "5 kg",
    sku: "RCE-BAS-5KG",
    coverImage: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80"],
    available: true,
    featured: true,
    active: true,
    tags: ["rice", "basmati", "bulk"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "whole-cardamom-pods",
    name: "Whole Cardamom Pods",
    slug: "whole-cardamom-pods",
    shortDescription: "Aromatic green cardamom pods for baking, tea, and savoury dishes.",
    description:
      "Carefully sourced whole cardamom pods with a strong fragrance profile, supplied for retail spice racks and food-service kitchens.",
    categoryId: "spices",
    price: 3.75,
    currency: "GBP",
    brand: "Bez-Kin Spice Co.",
    origin: "Guatemala",
    weight: "50 g",
    sku: "SPC-CAR-050",
    coverImage: "https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?auto=format&fit=crop&w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?auto=format&fit=crop&w=1200&q=80"],
    available: true,
    featured: true,
    active: true,
    tags: ["spices", "cardamom", "whole spice"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "vegetable-samosas",
    name: "Vegetable Samosas",
    slug: "vegetable-samosas",
    shortDescription: "Crisp frozen samosas with a lightly spiced vegetable filling.",
    description:
      "Retail-ready frozen samosas designed for easy merchandising in specialist grocers and convenience freezer cabinets.",
    categoryId: "frozen-foods",
    price: 5.25,
    currency: "GBP",
    brand: "Bez-Kin Freezer",
    origin: "United Kingdom",
    weight: "600 g",
    sku: "FRZ-SAM-600",
    coverImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80"],
    available: true,
    featured: false,
    active: true,
    tags: ["frozen", "samosa", "vegetarian"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "mango-nectar",
    name: "Mango Nectar",
    slug: "mango-nectar",
    shortDescription: "Smooth mango drink in shelf-ready ambient packs.",
    description:
      "A bright mango nectar range for chilled or ambient drink displays, with dependable case configuration for wholesale buyers.",
    categoryId: "beverages",
    price: 1.65,
    currency: "GBP",
    brand: "Tropical Line",
    origin: "Pakistan",
    weight: "1 L",
    sku: "BEV-MNG-1L",
    coverImage: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=80"],
    available: true,
    featured: false,
    active: true,
    tags: ["beverage", "mango", "ambient"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "spiced-lentil-crisps",
    name: "Spiced Lentil Crisps",
    slug: "spiced-lentil-crisps",
    shortDescription: "Crunchy lentil crisps with a warm chilli and cumin seasoning.",
    description:
      "A savoury snack line with strong impulse appeal, packed for independent stores and lunch-time displays.",
    categoryId: "snacks",
    price: 1.25,
    currency: "GBP",
    brand: "Snack Yard",
    origin: "United Kingdom",
    weight: "80 g",
    sku: "SNK-LEN-080",
    coverImage: "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?auto=format&fit=crop&w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1613919113640-25732ec5e61f?auto=format&fit=crop&w=1200&q=80"],
    available: true,
    featured: true,
    active: true,
    tags: ["snack", "lentil", "crisps"],
    createdAt: now,
    updatedAt: now
  }
];

export const seedSettings: SiteSettings = {
  companyName: "Bez-Kin Expo",
  logo: "/favicon.svg",
  phone: "+44 20 7946 0820",
  email: "sales@example.co.uk",
  address: "Unit 14, Meridian Trade Park, London, UK",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  whatsApp: "https://wa.me/442079460820",
  businessHours: "Monday to Friday, 9:00 to 17:30",
  mapEmbedUrl: "https://www.google.com/maps?q=London%20UK&output=embed",
  about:
    "Bez-Kin Expo supplies carefully sourced ambient, frozen, and speciality food products to retailers, caterers, and wholesale partners across the UK."
};
