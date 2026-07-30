import { Link } from "react-router-dom";
import type { Category, Product } from "../../types/catalog";

export function ProductCard({ product, category }: { product: Product; category?: Category }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={product.coverImage}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-leaf">{category?.name ?? "Catalogue"}</p>
            {product.featured ? <span className="rounded bg-harvest/15 px-2 py-1 text-xs font-bold text-ink">Featured</span> : null}
          </div>
          <h2 className="mt-2 text-lg font-bold leading-tight text-ink">{product.name}</h2>
          <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            <span className="text-sm font-semibold text-slate-500">{product.weight}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(price);
}
