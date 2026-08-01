import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Trash2, Upload } from "lucide-react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormFeedback, type FormFeedbackMessage } from "../../components/admin/FormFeedback";
import { LoadingSpinner, LoadingState } from "../../components/ui/LoadingSpinner";
import { deleteCategory, getCategories, saveCategory } from "../../services/catalogService";
import { uploadImage } from "../../services/storageService";
import type { Category } from "../../types/catalog";
import { slugify } from "../../utils/slug";

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  image: z.string().url("Enter a valid image URL."),
  order: z.coerce.number().int().min(0),
  active: z.boolean()
});

type CategoryForm = z.infer<typeof categorySchema>;

const emptyCategory: CategoryForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  image: "",
  order: 1,
  active: true
};

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<FormFeedbackMessage>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const form = useForm<CategoryForm>({ resolver: zodResolver(categorySchema), defaultValues: emptyCategory });
  const name = form.watch("name");
  const id = form.watch("id");

  useEffect(() => {
    if (!id && name) {
      form.setValue("slug", slugify(name), { shouldValidate: true });
    }
  }, [form, id, name]);

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

  const load = useCallback(() =>
    getCategories(true).then((nextCategories) => {
      setCategories(nextCategories);
      setLoading(false);
    }), []);

  useEffect(() => {
    void load();
  }, [load]);

  const onSubmit = form.handleSubmit(
    async (values) => {
      setMessage(null);
      try {
        await saveCategory({
          id: values.id ?? "",
          name: values.name,
          slug: slugify(values.slug),
          description: values.description,
          image: values.image,
          order: values.order,
          active: values.active,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        await load();
        form.reset({ ...emptyCategory, order: categories.length + 1 });
        setMessage({ status: "success", text: "Category saved successfully." });
      } catch (error) {
        setMessage({ status: "error", text: error instanceof Error ? error.message : "Could not save category." });
      }
    },
    () => setMessage({ status: "error", text: "Please fix the highlighted category fields before saving." })
  );

  const editCategory = (category: Category) => {
    setMessage(null);
    form.reset(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeCategory = async (category: Category) => {
    if (!window.confirm(`Delete ${category.name}? Existing products will keep their categoryId.`)) return;
    try {
      await deleteCategory(category.id);
      await load();
      setMessage({ status: "success", text: "Category deleted successfully." });
    } catch (error) {
      setMessage({ status: "error", text: error instanceof Error ? error.message : "Could not delete category." });
    }
  };

  const uploadCategoryImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      setMessage(null);
      const categoryId = form.getValues("id") || slugify(form.getValues("name")) || "new-category";
      const url = await uploadImage(file, `categories/${categoryId}.webp`);
      form.setValue("image", url, { shouldValidate: true });
      setMessage({ status: "success", text: "Category image uploaded and added to the form." });
    } catch (error) {
      setMessage({ status: "error", text: error instanceof Error ? error.message : "Could not upload image." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[400px_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black">{id ? "Edit category" : "Add category"}</h1>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Input label="Category name" {...form.register("name")} error={form.formState.errors.name?.message} />
          <Input label="Slug" {...form.register("slug")} error={form.formState.errors.slug?.message} />
          <Textarea label="Description" {...form.register("description")} error={form.formState.errors.description?.message} />
          <Input label="Image URL" {...form.register("image")} error={form.formState.errors.image?.message} />
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Upload category image</span>
            <span className="mt-1 flex items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-600">
              <Upload className="h-4 w-4" />
              <input type="file" accept="image/*" disabled={uploading} onChange={(event) => void uploadCategoryImage(event.target.files?.[0])} className="w-full text-sm" />
            </span>
          </label>
          <Input label="Order" type="number" {...form.register("order")} error={form.formState.errors.order?.message} />
          <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold">
            <input type="checkbox" {...form.register("active")} />
            Active
          </label>
          <FormFeedback message={message} />
          <div className="flex gap-2">
            <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {form.formState.isSubmitting ? <LoadingSpinner label="Saving..." size="sm" tone="light" /> : (
                <>
                  <Plus className="h-4 w-4" />
                  Save category
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setMessage(null);
                form.reset({ ...emptyCategory, order: categories.length + 1 });
              }}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold"
            >
              Clear
            </button>
          </div>
        </form>
      </section>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-black">Categories</h2>
        </div>
        {loading ? <div className="p-5"><LoadingState label="Loading categories..." /></div> : null}
        {!loading ? <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-3"><img src={category.image} alt="" className="h-12 w-12 rounded-md object-cover" /></td>
                  <td className="px-4 py-3 font-semibold">{category.name}</td>
                  <td className="px-4 py-3">{category.order}</td>
                  <td className="px-4 py-3">{category.active ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => editCategory(category)} className="h-9 w-9 rounded-md border border-slate-200" title="Edit category"><Edit className="mx-auto h-4 w-4" /></button>
                      <button type="button" onClick={() => void removeCategory(category)} className="h-9 w-9 rounded-md border border-slate-200 text-berry" title="Delete category"><Trash2 className="mx-auto h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> : null}
      </section>
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };
const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, ...props }, ref) => {
  return (
    <label className="block">
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
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <textarea ref={ref} {...props} rows={3} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus-ring" />
      {error ? <span className="mt-1 block text-xs font-semibold text-berry">{error}</span> : null}
    </label>
  );
});
Textarea.displayName = "Textarea";
