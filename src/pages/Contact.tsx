import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Seo } from "../components/Seo";
import { seedSettings } from "../data/seedData";
import { getSiteSettings } from "../services/catalogService";
import type { SiteSettings } from "../types/catalog";

export function Contact() {
  const [settings, setSettings] = useState<SiteSettings>(seedSettings);

  useEffect(() => {
    void getSiteSettings().then(setSettings);
  }, []);

  return (
    <>
      <Seo title="Contact | Bez-Kin Expo Ltd" description="Contact Bez-Kin Expo Ltd for Sri Lankan grocery import and product catalogue enquiries in the UK." path="/contact" />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-wide text-leaf">Contact</p>
        <h1 className="mt-2 text-4xl font-black">Bring Sri Lankan flavour to your shelves</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <section className="space-y-4">
            <ContactCard icon={<Phone className="h-5 w-5" />} label="Phone" value={settings.phone} />
            <ContactCard icon={<Mail className="h-5 w-5" />} label="Email" value={settings.email} />
            <ContactCard icon={<MapPin className="h-5 w-5" />} label="Address" value={settings.address} />
          </section>
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <iframe title="Company location map" src={settings.mapEmbedUrl} className="h-[420px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </section>
        </div>
      </main>
    </>
  );
}

function ContactCard({ icon, label, value }: { icon: JSX.Element; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-leaf">
        {icon}
        <h2 className="text-sm font-bold uppercase tracking-wide">{label}</h2>
      </div>
      <p className="mt-3 text-base font-semibold text-ink">{value}</p>
    </div>
  );
}
