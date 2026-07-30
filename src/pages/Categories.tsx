import { useEffect, useState } from "react";
import { CategoryCard } from "../components/catalog/CategoryCard";
import { Seo } from "../components/Seo";
import { getCategories } from "../services/catalogService";
import type { Category } from "../types/catalog";

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    void getCategories().then(setCategories);
  }, []);

  return (
    <>
      <Seo title="Categories | Bez-Kin Expo" description="Browse imported food ranges including tea, rice, spices, frozen foods, beverages, and snacks." path="/categories" />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-wide text-leaf">Categories</p>
        <h1 className="mt-2 text-4xl font-black">Browse product ranges</h1>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </main>
    </>
  );
}
