import { Boxes, Settings, Tags } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, getProducts, getSiteSettings } from "../../services/catalogService";
import type { Category, Product, SiteSettings } from "../../types/catalog";

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    void Promise.all([getProducts(true), getCategories(true), getSiteSettings()]).then(([nextProducts, nextCategories, nextSettings]) => {
      setProducts(nextProducts);
      setCategories(nextCategories);
      setSettings(nextSettings);
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Manage catalogue content, category ranges, and website settings.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard to="/admin/products" icon={<Boxes className="h-5 w-5" />} label="Products" value={String(products.length)} />
        <MetricCard to="/admin/categories" icon={<Tags className="h-5 w-5" />} label="Categories" value={String(categories.length)} />
        <MetricCard to="/admin/settings" icon={<Settings className="h-5 w-5" />} label="Company" value={settings?.companyName ?? "Settings"} />
      </div>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">Firebase setup note</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Seed data is used until Firebase environment variables are configured. Once connected, these modules read and write Firestore and Storage directly.
        </p>
      </section>
    </div>
  );
}

function MetricCard({ to, icon, label, value }: { to: string; icon: JSX.Element; label: string; value: string }) {
  return (
    <Link to={to} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-center gap-3 text-leaf">
        {icon}
        <span className="text-sm font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-4 text-3xl font-black text-ink">{value}</p>
    </Link>
  );
}
