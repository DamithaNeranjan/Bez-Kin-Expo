export type AdminRole = "administrator" | "editor" | "viewer";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  price: number;
  currency: "GBP";
  brand: string;
  origin: string;
  weight: string;
  sku: string;
  coverImage: string;
  images: string[];
  available: boolean;
  featured: boolean;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type SiteSettings = {
  companyName: string;
  logo: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  whatsApp: string;
  businessHours: string;
  about: string;
};

export type AdminUser = {
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
};

export type AuditEntityType = "auth" | "product" | "category" | "settings";

export type AuditAction = "login" | "login_denied" | "create" | "update" | "delete" | "upload";

export type AuditLog = {
  id: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  entityName: string;
  actorUid: string;
  actorEmail: string;
  actorName: string;
  summary: string;
  createdAt: string;
};

export type ProductSort = "featured" | "name-asc" | "price-asc" | "price-desc";
