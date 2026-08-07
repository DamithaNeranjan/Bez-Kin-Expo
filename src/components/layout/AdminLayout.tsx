import { Boxes, History, LayoutDashboard, LogOut, Settings, Tags } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/audit", label: "Audit trail", icon: History }
];

export function AdminLayout() {
  const { logOut, profile } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <div className="text-lg font-bold">Admin Dashboard</div>
        <p className="mt-1 text-sm text-slate-500">{profile?.email}</p>
        <nav className="mt-8 space-y-1" aria-label="Admin navigation">
          {adminNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${
                  isActive ? "bg-ink text-white" : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => void logOut()}
          className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-md border border-berry bg-berry px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-ink"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>
      <div className="lg:pl-64">
        <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          {adminNav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200"
              title={label}
            >
              <Icon className="h-4 w-4" />
            </NavLink>
          ))}
          <button type="button" onClick={() => void logOut()} className="ml-auto h-10 w-10 rounded-md border border-berry bg-berry text-white shadow-sm" title="Sign out">
            <LogOut className="mx-auto h-4 w-4" />
          </button>
        </div>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
