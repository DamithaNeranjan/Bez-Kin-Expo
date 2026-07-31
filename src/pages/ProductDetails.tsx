import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/catalog/ProductCard";
import { Seo } from "../components/Seo";
import { LoadingState } from "../components/ui/LoadingSpinner";
import { getCategories, getProductBySlug, getProducts } from "../services/catalogService";
import type { Category, Product } from "../types/catalog";

export function ProductDetails() {
  const { slug = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void Promise.all([getProductBySlug(slug), getProducts(), getCategories()]).then(([nextProduct, nextProducts, nextCategories]) => {
      setProduct(nextProduct);
      setProducts(nextProducts);
      setCategories(nextCategories);
      setLoading(false);
    });
  }, [slug]);

  const category = categories.find((item) => item.id === product?.categoryId);
  const related = useMemo(
    () => products.filter((item) => item.categoryId === product?.categoryId && item.id !== product?.id).slice(0, 4),
    [product?.categoryId, product?.id, products]
  );

  if (loading) {
    return <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><LoadingState label="Loading product..." /></main>;
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black">Product not found</h1>
        <Link to="/products" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-leaf">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.length ? product.images : [product.coverImage],
    description: product.shortDescription,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <>
      <Seo title={`${product.name} | Bez-Kin Expo Ltd`} description={product.shortDescription} path={`/products/${product.slug}`} image={product.coverImage} jsonLd={jsonLd} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-leaf">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
        <section className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <img src={product.coverImage} alt={product.name} className="aspect-[4/3] w-full object-cover" />
            </div>
            {product.images.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((image) => (
                  <img key={image} src={image} alt="" className="aspect-square rounded-md object-cover" loading="lazy" />
                ))}
              </div>
            ) : null}
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-leaf">{category?.name}</p>
            <h1 className="mt-2 text-4xl font-black">{product.name}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{product.description}</p>
            <dl className="mt-8 grid gap-4 rounded-lg border border-slate-200 bg-white p-6 sm:grid-cols-2">
              <Spec label="Price" value={new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(product.price)} />
              <Spec label="Weight" value={product.weight} />
              <Spec label="Brand" value={product.brand} />
              <Spec label="Country of origin" value={product.origin} />
              <Spec label="SKU" value={product.sku} />
              <Spec label="Availability" value={product.available ? "Available" : "Unavailable"} />
            </dl>
          </div>
        </section>
        {related.length ? (
          <section className="mt-16">
            <h2 className="text-2xl font-black">Related products</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} category={category} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
