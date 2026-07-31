import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Seo } from "../components/Seo";
import { seedSettings } from "../data/seedData";
import { getSiteSettings } from "../services/catalogService";
import type { SiteSettings } from "../types/catalog";

export function About() {
  const [settings, setSettings] = useState<SiteSettings>(seedSettings);

  useEffect(() => {
    void getSiteSettings().then(setSettings);
  }, []);

  return (
    <>
      <Seo
        title="About | Bez-Kin Expo Ltd"
        description="Learn how Bez-Kin Expo Ltd brings authentic Sri Lankan groceries, spices, snacks, tea, and staples to the UK."
        path="/about"
      />
      <main>
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-leaf">About</p>
              <h1 className="mt-2 text-4xl font-black">Authentic Sri Lankan groceries for the UK</h1>
            </div>
            <div className="space-y-5 text-base leading-8 text-slate-600">
              <p>{settings.about}</p>
              <p>
                From fragrant spices to delicious snacks, the catalogue helps UK buyers discover the products they need to cook up a storm. It is built for clear product discovery today and future online ordering later.
              </p>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {["Sri Lankan grocery focus", "Supplier-ready product data", "Future e-commerce structure"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <CheckCircle2 className="h-6 w-6 text-leaf" />
                <h2 className="mt-4 text-lg font-bold">{item}</h2>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
