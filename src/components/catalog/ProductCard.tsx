import { Link } from "react-router-dom";
import { OptimizedImage } from "../ui/OptimizedImage";
import type { Category, Product } from "../../types/catalog";
import { optimizeImageUrl } from "../../utils/imageUrl";
import { formatProductPrice, getSeasonalOfferPrice } from "../../utils/productPrice";

export function ProductCard({ product, category }: { product: Product; category?: Category }) {
  const ambientImage = optimizeImageUrl(product.coverImage, 96);
  const offerPrice = getSeasonalOfferPrice(product);

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <span
            aria-hidden="true"
            className="absolute inset-0 scale-150 bg-cover bg-center opacity-45 blur-2xl saturate-150"
            style={{ backgroundImage: ambientImage ? `url("${ambientImage}")` : undefined }}
          />
          <span aria-hidden="true" className="absolute inset-0 bg-white/35" />
          <OptimizedImage
            src={product.coverImage}
            alt={product.name}
            className="relative z-10 flex h-full w-full items-center justify-center p-3 transition duration-300 group-hover:scale-105"
            fill={false}
            style={{ backgroundColor: "transparent" }}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            widthHint={640}
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-leaf">{category?.name ?? "Catalogue"}</p>
            {offerPrice !== null ? (
              <span className="rounded bg-berry px-2 py-1 text-xs font-bold text-white">Seasonal offer</span>
            ) : product.featured ? (
              <span className="rounded bg-harvest/15 px-2 py-1 text-xs font-bold text-ink">Featured</span>
            ) : null}
          </div>
          <h2 className="mt-2 text-lg font-bold leading-tight text-ink">{product.name}</h2>
          <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            {offerPrice !== null ? (
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-sm font-semibold text-slate-500 line-through">{formatProductPrice(product.price)}</span>
                <span className="text-xl font-black text-berry">{formatProductPrice(offerPrice)}</span>
              </span>
            ) : (
              <span className="text-lg font-bold">{formatProductPrice(product.price)}</span>
            )}
            <span className="text-sm font-semibold text-slate-500">{product.weight}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
