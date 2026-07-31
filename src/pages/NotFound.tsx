import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function NotFound() {
  return (
    <>
      <Seo title="Page not found | Bez-Kin Expo Ltd" description="The requested page could not be found." path="/404" />
      <main className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black">Page not found</h1>
        <p className="mt-4 text-slate-600">The page may have moved or the link may be incorrect.</p>
        <Link to="/products" className="mt-8 inline-flex rounded-md bg-ink px-5 py-3 text-sm font-bold text-white">
          Browse products
        </Link>
      </main>
    </>
  );
}
