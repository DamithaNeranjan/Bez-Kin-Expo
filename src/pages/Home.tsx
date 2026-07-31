import { ArrowRight, Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryCard } from "../components/catalog/CategoryCard";
import { ProductCard } from "../components/catalog/ProductCard";
import { Seo } from "../components/Seo";
import { getCategories, getProducts, getSiteSettings } from "../services/catalogService";
import { seedSettings } from "../data/seedData";
import type { Category, Product, SiteSettings } from "../types/catalog";

export function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(seedSettings);

  useEffect(() => {
    void Promise.all([getCategories(), getProducts(), getSiteSettings()]).then(([nextCategories, nextProducts, nextSettings]) => {
      setCategories(nextCategories);
      setProducts(nextProducts);
      setSettings(nextSettings);
    });
  }, []);

  const featuredProducts = useMemo(() => products.filter((product) => product.featured).slice(0, 4), [products]);

  return (
    <>
      <Seo
        title={`${settings.companyName} | Sri Lankan Groceries in the UK`}
        description="Taste the real Sri Lanka in the UK with authentic groceries, fragrant spices, snacks, tea, staples, and frozen favourites."
      />
      <main>
        <section className="relative overflow-hidden bg-ink text-white">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=80"
              alt=""
              className="h-full w-full object-cover opacity-25"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/95 to-ink/70" />
          <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-harvest">Sri Lankan groceries in the UK</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">{settings.companyName}</h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white drop-shadow">
                Get ready to taste the real Sri Lanka in the UK. From fragrant spices to delicious snacks, we bring the authentic flavours of home to every shelf and every kitchen.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/products" className="inline-flex items-center gap-2 rounded-md bg-harvest px-5 py-3 text-sm font-bold text-ink transition hover:bg-white">
                  View Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                  <Phone className="h-4 w-4" />
                  Contact Sales
                </Link>
              </div>
            </div>
            <div className="rounded-lg border border-harvest/40 bg-white p-5 text-ink shadow-soft">
              <p className="mb-4 text-sm font-bold uppercase tracking-wide text-berry">Authentic ranges</p>
              <div className="grid grid-cols-2 gap-3">
                {categories.slice(0, 4).map((category) => (
                  <Link key={category.id} to={`/categories/${category.slug}`} className="overflow-hidden rounded-md border border-slate-200 bg-white text-ink shadow-sm">
                    <img src={category.image} alt={category.name} className="h-28 w-full object-cover" />
                    <span className="block px-3 py-2 text-sm font-bold">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-leaf">Featured categories</p>
              <h2 className="mt-2 text-3xl font-black">Cook up a Sri Lankan storm</h2>
            </div>
            <Link to="/categories" className="inline-flex items-center gap-2 text-sm font-bold text-leaf">
              All categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 3).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-leaf">Featured products</p>
                <h2 className="mt-2 text-3xl font-black">Flavours of home</h2>
              </div>
              <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-leaf">
                Full catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} category={categories.find((category) => category.id === product.categoryId)} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-leaf">About the company</p>
            <h2 className="mt-2 text-3xl font-black">The warmth of Sri Lankan cuisine in every bite</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{settings.about}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold">Contact information</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-bold text-slate-500">Phone</dt>
                <dd className="text-slate-800">{settings.phone}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">Email</dt>
                <dd className="text-slate-800">{settings.email}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">Address</dt>
                <dd className="text-slate-800">{settings.address}</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </>
  );
}
