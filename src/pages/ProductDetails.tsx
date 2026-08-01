import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/catalog/ProductCard";
import { Seo } from "../components/Seo";
import { LoadingState } from "../components/ui/LoadingSpinner";
import { OptimizedImage } from "../components/ui/OptimizedImage";
import { getCategories, getProductBySlug, getProducts } from "../services/catalogService";
import type { Category, Product } from "../types/catalog";
import { buildSrcSet, optimizeImageUrl } from "../utils/imageUrl";

export function ProductDetails() {
  const { slug = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

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
  const galleryImages = useMemo(() => {
    if (!product) {
      return [];
    }
    return Array.from(new Set(product.images.length ? product.images : [product.coverImage]));
  }, [product]);
  const related = useMemo(
    () => products.filter((item) => item.categoryId === product?.categoryId && item.id !== product?.id).slice(0, 4),
    [product?.categoryId, product?.id, products]
  );

  useEffect(() => {
    if (activeImageIndex === null || galleryImages.length === 0) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImageIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveImageIndex((currentIndex) => (currentIndex === null ? currentIndex : (currentIndex - 1 + galleryImages.length) % galleryImages.length));
      }

      if (event.key === "ArrowRight") {
        setActiveImageIndex((currentIndex) => (currentIndex === null ? currentIndex : (currentIndex + 1) % galleryImages.length));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeImageIndex, galleryImages.length]);

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
              <OptimizedImage
                src={galleryImages[0] ?? product.coverImage}
                alt={product.name}
                className="aspect-[4/3] w-full object-cover"
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 55vw, 100vw"
                widthHint={1200}
              />
            </div>
            {product.images.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {galleryImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className="group relative overflow-hidden rounded-md border border-slate-200 bg-slate-100 focus-ring"
                    aria-label={`Open image ${index + 1} of ${galleryImages.length}`}
                  >
                    <OptimizedImage src={image} alt="" className="aspect-square object-cover transition duration-300 group-hover:scale-105" sizes="25vw" widthHint={320} />
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-white opacity-0 transition group-hover:bg-ink/35 group-hover:opacity-100">
                      <Maximize2 className="h-5 w-5" />
                    </span>
                  </button>
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
      {activeImageIndex !== null && galleryImages[activeImageIndex] ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} image preview`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveImageIndex(null);
            }
          }}
        >
          <button
            type="button"
            onClick={() => setActiveImageIndex(null)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-soft focus-ring"
            aria-label="Close image preview"
          >
            <X className="h-5 w-5" />
          </button>
          {galleryImages.length > 1 ? (
            <button
              type="button"
              onClick={() => setActiveImageIndex((activeImageIndex - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-soft focus-ring"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : null}
          <img
            src={optimizeImageUrl(galleryImages[activeImageIndex], 1600)}
            srcSet={buildSrcSet(galleryImages[activeImageIndex], [800, 1200, 1600, 2000])}
            sizes="100vw"
            alt={`${product.name} enlarged image ${activeImageIndex + 1}`}
            className="block max-h-[86vh] max-w-[92vw] rounded-lg bg-white object-contain shadow-soft"
            loading="eager"
            decoding="async"
          />
          {galleryImages.length > 1 ? (
            <button
              type="button"
              onClick={() => setActiveImageIndex((activeImageIndex + 1) % galleryImages.length)}
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-soft focus-ring"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          ) : null}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-soft">
            {activeImageIndex + 1} / {galleryImages.length}
          </p>
        </div>
      ) : null}
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
