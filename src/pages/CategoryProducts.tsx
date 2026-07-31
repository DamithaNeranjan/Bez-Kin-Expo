import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/catalog/ProductCard";
import { Seo } from "../components/Seo";
import { getCategories, getCategoryBySlug, getProducts } from "../services/catalogService";
import type { Category, Product } from "../types/catalog";

export function CategoryProducts() {
  const { slug = "" } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void Promise.all([getCategoryBySlug(slug), getCategories(), getProducts()]).then(([nextCategory, nextCategories, nextProducts]) => {
      setCategory(nextCategory);
      setCategories(nextCategories);
      setProducts(nextProducts);
    });
  }, [slug]);

  const categoryProducts = useMemo(() => products.filter((product) => product.categoryId === category?.id), [category?.id, products]);

  if (!category) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black">Category not found</h1>
        <Link to="/categories" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-leaf">
          <ArrowLeft className="h-4 w-4" />
          Back to categories
        </Link>
      </main>
    );
  }

  return (
    <>
      <Seo title={`${category.name} | Bez-Kin Expo Ltd`} description={category.description} path={`/categories/${category.slug}`} image={category.image} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/categories" className="inline-flex items-center gap-2 text-sm font-bold text-leaf">
          <ArrowLeft className="h-4 w-4" />
          Back to categories
        </Link>
        <section className="mt-8 overflow-hidden rounded-lg bg-ink text-white">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <img src={category.image} alt={category.name} className="h-72 w-full object-cover lg:h-full" />
            <div className="p-8 lg:p-12">
              <p className="text-sm font-bold uppercase tracking-wide text-harvest">Sri Lankan range</p>
              <h1 className="mt-2 text-4xl font-black">{category.name}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-100">{category.description}</p>
            </div>
          </div>
        </section>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} category={categories.find((item) => item.id === product.categoryId)} />
          ))}
        </div>
        {categoryProducts.length === 0 ? <p className="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-slate-600">No available products are listed in this category yet.</p> : null}
      </main>
    </>
  );
}
