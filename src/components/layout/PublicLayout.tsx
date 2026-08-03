import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { getSiteSettings } from "../../services/catalogService";
import type { SiteSettings } from "../../types/catalog";
import { seedSettings } from "../../data/seedData";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];

export function PublicLayout() {
  const [settings, setSettings] = useState<SiteSettings>(seedSettings);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    void getSiteSettings().then(setSettings);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-ink">
      <header className="sticky top-0 z-40 border-b border-harvest/40 bg-ink text-white shadow-lg shadow-ink/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label={`${settings.companyName} home`}>
            <img src={settings.logo} alt="" className="h-12 w-20 rounded-md border border-harvest/50 bg-white object-contain shadow-sm" />
            <span className="text-lg font-bold tracking-normal text-white">{settings.companyName}</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-harvest text-ink" : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-md bg-harvest px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white"
            >
              <Search className="h-4 w-4" />
              Browse Catalogue
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/30 text-white md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen ? (
          <nav className="border-t border-harvest/30 bg-ink px-4 py-3 md:hidden" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </header>
      <Outlet />
      <footer className="border-t border-harvest/40 bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <img src={settings.logo} alt="" className="h-11 w-20 rounded-md border border-harvest/50 bg-white object-contain" />
              <span className="font-bold">{settings.companyName}</span>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">{settings.about}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-harvest">Contact</h2>
            <p className="mt-3 text-sm text-white/85">{settings.phone}</p>
            <p className="mt-1 text-sm text-white/85">{settings.email}</p>
            <a href={settings.whatsApp} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-harvest hover:text-white">
              WhatsApp channel
            </a>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-harvest">Hours</h2>
            <p className="mt-3 text-sm leading-6 text-white/85">{settings.businessHours}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
