import { useEffect, useState } from "react";
import { CategoryCard } from "../components/catalog/CategoryCard";
import { Seo } from "../components/Seo";
import { LoadingState } from "../components/ui/LoadingSpinner";
import { getCategories } from "../services/catalogService";
import type { Category } from "../types/catalog";

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getCategories().then((nextCategories) => {
      setCategories(nextCategories);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Seo
        title="Sri Lankan Grocery Categories | Bez-Kin Expo Ltd"
        description="Browse Sri Lankan grocery ranges including Ceylon tea, rice staples, fragrant spices, frozen foods, beverages, and snacks."
        path="/categories"
      />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-wide text-leaf">Sri Lankan grocery ranges</p>
        <h1 className="mt-2 text-4xl font-black">Browse the flavours of home</h1>
        {loading ? <div className="mt-8"><LoadingState label="Loading categories..." /></div> : null}
        {!loading ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div> : null}
      </main>
    </>
  );
}
