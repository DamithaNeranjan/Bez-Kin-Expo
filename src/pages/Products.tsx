import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../components/catalog/ProductCard";
import { Seo } from "../components/Seo";
import { getCategories, getProducts } from "../services/catalogService";
import type { Category, Product, ProductSort } from "../types/catalog";

const pageSize = 8;

export function Products() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [sort, setSort] = useState<ProductSort>("featured");
  const [page, setPage] = useState(1);

  useEffect(() => {
    void Promise.all([getCategories(), getProducts()]).then(([nextCategories, nextProducts]) => {
      setCategories(nextCategories);
      setProducts(nextProducts);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products
      .filter((product) => categoryId === "all" || product.categoryId === categoryId)
      .filter((product) => {
        if (!normalizedQuery) {
          return true;
        }
        return [product.name, product.shortDescription, product.brand, product.origin, ...product.tags].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((a, b) => {
        if (sort === "name-asc") return a.name.localeCompare(b.name);
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name);
      });
  }, [categoryId, products, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [categoryId, query, sort]);

  return (
    <>
      <Seo
        title="Sri Lankan Products | Bez-Kin Expo Ltd"
        description="Search Sri Lankan groceries, Ceylon tea, rice, spices, snacks, beverages, and frozen favourites available for UK buyers."
        path="/products"
      />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-leaf">Sri Lankan product catalogue</p>
            <h1 className="mt-2 text-4xl font-black">Browse authentic groceries</h1>
          </div>
          <p className="text-sm font-semibold text-slate-500">{filteredProducts.length} products found</p>
        </div>
        <section className="mt-8 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px]">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tea, spices, snacks, staples, or origin"
              className="h-11 w-full rounded-md border border-slate-200 pl-10 pr-3 text-sm focus-ring"
            />
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm focus-ring">
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Sort products</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as ProductSort)} className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm focus-ring">
              <option value="featured">Featured first</option>
              <option value="name-asc">Name A to Z</option>
              <option value="price-asc">Price low to high</option>
              <option value="price-desc">Price high to low</option>
            </select>
          </label>
        </section>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} category={categories.find((category) => category.id === product.categoryId)} />
          ))}
        </div>
        {visibleProducts.length === 0 ? <p className="mt-10 rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">No products match your filters.</p> : null}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40">
            Previous
          </button>
          <span className="text-sm font-semibold text-slate-600">
            Page {page} of {pageCount}
          </span>
          <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40">
            Next
          </button>
        </div>
      </main>
    </>
  );
}
