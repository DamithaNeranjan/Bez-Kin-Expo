import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "../firebase/config";
import { seedCategories, seedProducts, seedSettings } from "../data/seedData";
import type { Category, Product, SiteSettings } from "../types/catalog";

const dateFields = (existing?: Partial<Category | Product>) => ({
  createdAt: existing?.createdAt ?? new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const withProductDefaults = (product: Product): Product => ({
  ...product,
  seasonalOffer: product.seasonalOffer ?? false
});

export async function getCategories(includeInactive = false): Promise<Category[]> {
  if (!db) {
    return seedCategories.filter((category) => includeInactive || category.active).sort((a, b) => a.order - b.order);
  }

  const categoryQuery = includeInactive ? collection(db, "categories") : query(collection(db, "categories"), where("active", "==", true));
  const snapshot = await getDocs(categoryQuery);
  return snapshot.docs
    .map((categoryDoc) => ({ id: categoryDoc.id, ...categoryDoc.data() }) as Category)
    .filter((category) => includeInactive || category.active)
    .sort((a, b) => a.order - b.order);
}

export async function getProducts(includeUnavailable = false): Promise<Product[]> {
  if (!db) {
    return seedProducts
      .map(withProductDefaults)
      .filter((product) => includeUnavailable || (product.available && product.active))
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  }

  const productQuery = includeUnavailable
    ? collection(db, "products")
    : query(collection(db, "products"), where("available", "==", true), where("active", "==", true));
  const snapshot = await getDocs(productQuery);
  return snapshot.docs
    .map((productDoc) => withProductDefaults({ id: productDoc.id, ...productDoc.data() } as Product))
    .filter((product) => includeUnavailable || (product.available && product.active))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
}

export async function getCategoryBySlug(slug: string, includeInactive = false) {
  const categories = await getCategories(includeInactive);
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getProductBySlug(slug: string, includeUnavailable = false) {
  const products = await getProducts(includeUnavailable);
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!db) {
    return seedSettings;
  }

  const snapshot = await getDoc(doc(db, "settings", "site"));
  return snapshot.exists() ? ({ ...seedSettings, ...snapshot.data() } as SiteSettings) : seedSettings;
}

export async function saveProduct(product: Product) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured yet.");
  }

  const { id, ...payload } = product;
  const productRef = id ? doc(db, "products", id) : doc(collection(db, "products"));
  await setDoc(
    productRef,
    {
      ...payload,
      ...dateFields(product),
      createdAt: product.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
  return productRef.id;
}

export async function saveCategory(category: Category) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured yet.");
  }

  const { id, ...payload } = category;
  const categoryRef = id ? doc(db, "categories", id) : doc(collection(db, "categories"));
  await setDoc(
    categoryRef,
    {
      ...payload,
      ...dateFields(category),
      createdAt: category.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
  return categoryRef.id;
}

export async function deleteProduct(id: string) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured yet.");
  }

  await deleteDoc(doc(db, "products", id));
}

export async function deleteCategory(id: string) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured yet.");
  }

  await deleteDoc(doc(db, "categories", id));
}

export async function saveSiteSettings(settings: SiteSettings) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured yet.");
  }

  const payload: SiteSettings = {
    companyName: settings.companyName,
    logo: settings.logo,
    phone: settings.phone,
    email: settings.email,
    facebook: settings.facebook,
    instagram: settings.instagram,
    whatsApp: settings.whatsApp,
    businessHours: settings.businessHours,
    about: settings.about,
    seasonalOffersEnabled: settings.seasonalOffersEnabled
  };

  await setDoc(doc(db, "settings", "site"), payload);
}

export async function ensureAdminProfile(uid: string, email: string, name: string) {
  if (!db) {
    return null;
  }

  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    return null;
  }

  await updateDoc(userRef, {
    email,
    name,
    updatedAt: serverTimestamp()
  });
  return snapshot.data();
}
