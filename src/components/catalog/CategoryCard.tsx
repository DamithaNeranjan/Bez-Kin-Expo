import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Category } from "../../types/catalog";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group grid min-h-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <img src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">{category.name}</h2>
          <ArrowRight className="h-5 w-5 text-leaf" />
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
      </div>
    </Link>
  );
}
