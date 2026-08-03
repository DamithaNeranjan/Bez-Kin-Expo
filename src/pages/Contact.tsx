import { Mail, MessageCircle, Phone } from "lucide-react";
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
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <ContactCard icon={<Phone className="h-5 w-5" />} label="Phone" value={settings.phone} />
            <ContactCard icon={<Mail className="h-5 w-5" />} label="Email" value={settings.email} />
            <ContactCard icon={<MessageCircle className="h-5 w-5" />} label="WhatsApp" value="Follow our WhatsApp channel" href={settings.whatsApp} />
          </section>
          <section className="rounded-lg border border-harvest/40 bg-ink p-8 text-white shadow-soft">
            <p className="text-sm font-bold uppercase tracking-wide text-harvest">Sri Lankan groceries for the UK</p>
            <h2 className="mt-3 text-3xl font-black">Get ready to taste the real Sri Lanka in the UK.</h2>
            <p className="mt-4 text-base leading-8 text-white/80">
              From fragrant spices to delicious snacks, Bez-Kin Expo Ltd brings the authentic flavours of home to retailers, caterers, and family kitchens across the UK.
            </p>
            <a href={settings.whatsApp} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-md bg-harvest px-5 py-3 text-sm font-bold text-ink transition hover:bg-white">
              Open WhatsApp channel
            </a>
          </section>
        </div>
      </main>
    </>
  );
}

function ContactCard({ icon, label, value, href }: { icon: JSX.Element; label: string; value: string; href?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-leaf">
        {icon}
        <h2 className="text-sm font-bold uppercase tracking-wide">{label}</h2>
      </div>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="mt-3 inline-block text-base font-semibold text-ink hover:text-leaf">
          {value}
        </a>
      ) : (
        <p className="mt-3 text-base font-semibold text-ink">{value}</p>
      )}
    </div>
  );
}
