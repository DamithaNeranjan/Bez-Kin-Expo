import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Upload } from "lucide-react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormFeedback, type FormFeedbackMessage } from "../../components/admin/FormFeedback";
import { LoadingSpinner, LoadingState } from "../../components/ui/LoadingSpinner";
import { seedSettings } from "../../data/seedData";
import { getSiteSettings, saveSiteSettings } from "../../services/catalogService";
import { uploadImage } from "../../services/storageService";
import type { SiteSettings } from "../../types/catalog";

const settingsSchema = z.object({
  companyName: z.string().min(2),
  logo: z.string().min(1),
  phone: z.string().min(3),
  email: z.string().email(),
  facebook: z.string().url().or(z.literal("")),
  instagram: z.string().url().or(z.literal("")),
  whatsApp: z.string().url().or(z.literal("")),
  businessHours: z.string().min(3),
  about: z.string().min(20)
});

export function AdminSettings() {
  const [message, setMessage] = useState<FormFeedbackMessage>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const form = useForm<SiteSettings>({ resolver: zodResolver(settingsSchema), defaultValues: seedSettings });

  useEffect(() => {
    void getSiteSettings().then((settings) => {
      form.reset(settings);
      setLoading(false);
    });
  }, [form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      setMessage((currentMessage) => (currentMessage?.status === "success" ? null : currentMessage));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (message?.status !== "success") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setMessage(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  const onSubmit = form.handleSubmit(
    async (values) => {
      setMessage(null);
      try {
        await saveSiteSettings(values);
        setMessage({ status: "success", text: "Settings saved successfully." });
      } catch (error) {
        setMessage({ status: "error", text: error instanceof Error ? error.message : "Could not save settings." });
      }
    },
    () => setMessage({ status: "error", text: "Please fix the highlighted settings fields before saving." })
  );

  const uploadLogo = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "branding/logo.webp");
      form.setValue("logo", url, { shouldValidate: true });
      setMessage({ status: "success", text: "Logo uploaded and added to the form." });
    } catch (error) {
      setMessage({ status: "error", text: error instanceof Error ? error.message : "Could not upload logo." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-black">Settings</h1>
      {loading ? <div className="mt-6"><LoadingState label="Loading settings..." /></div> : null}
      {!loading ? <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <Input label="Company name" {...form.register("companyName")} error={form.formState.errors.companyName?.message} />
        <Input label="Phone" {...form.register("phone")} error={form.formState.errors.phone?.message} />
        <Input label="Email" {...form.register("email")} error={form.formState.errors.email?.message} />
        <Input label="Logo URL" {...form.register("logo")} error={form.formState.errors.logo?.message} />
        <label className="md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Upload logo</span>
          <span className="mt-1 flex items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-600">
            <Upload className="h-4 w-4" />
            <input type="file" accept="image/*" disabled={uploading} onChange={(event) => void uploadLogo(event.target.files?.[0])} className="w-full text-sm" />
          </span>
        </label>
        <Input label="Facebook" {...form.register("facebook")} error={form.formState.errors.facebook?.message} />
        <Input label="Instagram" {...form.register("instagram")} error={form.formState.errors.instagram?.message} />
        <Input label="WhatsApp channel URL" {...form.register("whatsApp")} error={form.formState.errors.whatsApp?.message} />
        <Input label="Business hours" {...form.register("businessHours")} error={form.formState.errors.businessHours?.message} />
        <Textarea label="About company" {...form.register("about")} error={form.formState.errors.about?.message} />
        <FormFeedback message={message} className="md:col-span-2" />
        <div className="md:col-span-2">
          <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {form.formState.isSubmitting ? <LoadingSpinner label="Saving..." size="sm" tone="light" /> : (
              <>
                <Save className="h-4 w-4" />
                Save settings
              </>
            )}
          </button>
        </div>
      </form> : null}
    </section>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; wrapperClassName?: string };
const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, wrapperClassName = "", ...props }, ref) => {
  return (
    <label className={`block ${wrapperClassName}`}>
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input ref={ref} {...props} className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm focus-ring" />
      {error ? <span className="mt-1 block text-xs font-semibold text-berry">{error}</span> : null}
    </label>
  );
});
Input.displayName = "Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string };
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, ...props }, ref) => {
  return (
    <label className="block md:col-span-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <textarea ref={ref} {...props} rows={3} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus-ring" />
      {error ? <span className="mt-1 block text-xs font-semibold text-berry">{error}</span> : null}
    </label>
  );
});
Textarea.displayName = "Textarea";
