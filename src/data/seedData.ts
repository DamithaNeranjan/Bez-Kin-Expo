import type { AuditLog, Category, Product, SiteSettings } from "../types/catalog";

const now = "2026-07-30T00:00:00.000Z";

export const seedCategories: Category[] = [
  {
    id: "tea",
    name: "Ceylon Tea",
    slug: "tea",
    description: "Ceylon black tea and everyday blends that bring a familiar Sri Lankan cup to UK shelves.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
    order: 1,
    active: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "rice",
    name: "Rice & Staples",
    slug: "rice",
    description: "Sri Lankan pantry staples, rice varieties, flours, and cooking essentials for home kitchens.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80",
    order: 2,
    active: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "spices",
    name: "Sri Lankan Spices",
    slug: "spices",
    description: "Fragrant spices, curry powders, and sambol essentials for authentic Sri Lankan cooking.",
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
    description: "Frozen Sri Lankan favourites for quick meals, retail freezers, and catering menus.",
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
    description: "Sri Lankan drinks, tropical flavours, and ambient beverage lines for UK customers.",
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
    description: "Sweet and savoury Sri Lankan snacks that deliver the warmth of home in every bite.",
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
    shortDescription: "Bright, brisk Ceylon tea packed for Sri Lankan grocery shelves and food service.",
    description:
      "A classic high-grown Ceylon black tea with a clean finish and dependable cup colour. It brings the authentic flavour of a Sri Lankan tea break to homes, cafes, and specialist grocers across the UK.",
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
    seasonalOffer: false,
    active: true,
    tags: ["tea", "ceylon", "black tea", "retail"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "sri-lankan-samba-rice",
    name: "Sri Lankan Samba Rice",
    slug: "sri-lankan-samba-rice",
    shortDescription: "Aromatic samba rice for rice and curry, lamprais, and everyday family meals.",
    description:
      "A Sri Lankan staple with a familiar aroma and satisfying texture, sourced for customers who want to cook the food they remember from home.",
    categoryId: "rice",
    price: 12.5,
    currency: "GBP",
    brand: "Bez-Kin Pantry",
    origin: "Sri Lanka",
    weight: "5 kg",
    sku: "RCE-SAM-5KG",
    coverImage: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80"],
    available: true,
    featured: true,
    seasonalOffer: false,
    active: true,
    tags: ["rice", "samba", "sri lankan groceries", "bulk"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "roasted-curry-powder",
    name: "Roasted Curry Powder",
    slug: "roasted-curry-powder",
    shortDescription: "Fragrant roasted curry powder for rich Sri Lankan meat and vegetable curries.",
    description:
      "A warm, deeply roasted spice blend made for the unmistakable flavour of Sri Lankan curry. Ideal for grocers, caterers, and home cooks looking for authentic taste.",
    categoryId: "spices",
    price: 3.75,
    currency: "GBP",
    brand: "Bez-Kin Spice Co.",
    origin: "Sri Lanka",
    weight: "100 g",
    sku: "SPC-RCP-100",
    coverImage: "https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?auto=format&fit=crop&w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?auto=format&fit=crop&w=1200&q=80"],
    available: true,
    featured: true,
    seasonalOffer: false,
    active: true,
    tags: ["spices", "curry powder", "sri lankan", "rice and curry"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "frozen-string-hoppers",
    name: "Frozen String Hoppers",
    slug: "frozen-string-hoppers",
    shortDescription: "Ready-to-steam string hoppers for breakfast, dinner, and catering trays.",
    description:
      "A freezer-friendly Sri Lankan favourite that makes it easier for UK households to serve string hoppers with kiri hodi, pol sambol, or curry.",
    categoryId: "frozen-foods",
    price: 5.25,
    currency: "GBP",
    brand: "Bez-Kin Freezer",
    origin: "Sri Lanka",
    weight: "500 g",
    sku: "FRZ-STH-500",
    coverImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80"],
    available: true,
    featured: false,
    seasonalOffer: false,
    active: true,
    tags: ["frozen", "string hoppers", "sri lankan breakfast"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "king-coconut-water",
    name: "King Coconut Water",
    slug: "king-coconut-water",
    shortDescription: "Refreshing Sri Lankan king coconut water in shelf-ready ambient packs.",
    description:
      "Naturally refreshing king coconut water with a tropical Sri Lankan profile, ready for grocery aisles, chilled cabinets, and convenience retail.",
    categoryId: "beverages",
    price: 1.65,
    currency: "GBP",
    brand: "Tropical Line",
    origin: "Sri Lanka",
    weight: "330 ml",
    sku: "BEV-KCW-330",
    coverImage: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=80"],
    available: true,
    featured: false,
    seasonalOffer: false,
    active: true,
    tags: ["beverage", "king coconut", "sri lankan drink"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "spicy-murukku",
    name: "Spicy Murukku",
    slug: "spicy-murukku",
    shortDescription: "Crunchy Sri Lankan-style murukku with a bold chilli and spice kick.",
    description:
      "A savoury snack with strong impulse appeal, bringing the taste of Sri Lankan corner shops and family gatherings to UK customers.",
    categoryId: "snacks",
    price: 1.25,
    currency: "GBP",
    brand: "Snack Yard",
    origin: "Sri Lanka",
    weight: "150 g",
    sku: "SNK-MUR-150",
    coverImage: "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?auto=format&fit=crop&w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1613919113640-25732ec5e61f?auto=format&fit=crop&w=1200&q=80"],
    available: true,
    featured: true,
    seasonalOffer: false,
    active: true,
    tags: ["snack", "murukku", "spicy", "sri lankan groceries"],
    createdAt: now,
    updatedAt: now
  }
];

export const seedSettings: SiteSettings = {
  companyName: "Bez-Kin Expo Ltd",
  logo: "/bezkin-logo.jpeg",
  phone: "+44 77 2323 8966",
  email: "admin@bez-kin.com",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  whatsApp: "https://whatsapp.com/channel/0029Vb6elFkDJ6H8BG2mbT0K",
  businessHours: "Monday to Friday, 9:00 to 17:30",
  seasonalOffersEnabled: false,
  about:
    "Bez-Kin Expo Ltd brings the authentic flavours of Sri Lanka to the UK, supplying groceries, fragrant spices, snacks, tea, staples, and frozen favourites for retailers, caterers, and families who want a real taste of home."
};

export const seedAuditLogs: AuditLog[] = [];
