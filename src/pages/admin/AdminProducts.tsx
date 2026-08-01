import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Trash2, Upload } from "lucide-react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormFeedback, type FormFeedbackMessage } from "../../components/admin/FormFeedback";
import { LoadingSpinner, LoadingState } from "../../components/ui/LoadingSpinner";
import { deleteProduct, getCategories, getProducts, saveProduct } from "../../services/catalogService";
import { uploadImage } from "../../services/storageService";
import type { Category, Product } from "../../types/catalog";
import { slugify } from "../../utils/slug";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  categoryId: z.string().min(1),
  price: z.coerce.number().min(0),
  brand: z.string().min(1),
  origin: z.string().min(1),
  weight: z.string().min(1),
  sku: z.string().min(1),
  coverImage: z.string().url("Enter a valid cover image URL."),
  imageList: z.string().optional(),
  tags: z.string().optional(),
  available: z.boolean(),
  featured: z.boolean(),
  active: z.boolean()
});

type ProductForm = z.infer<typeof productSchema>;

const emptyProduct: ProductForm = {
  id: "",
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  categoryId: "",
  price: 0,
  brand: "",
  origin: "",
  weight: "",
  sku: "",
  coverImage: "",
  imageList: "",
  tags: "",
  available: true,
  featured: false,
  active: true
};

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<FormFeedbackMessage>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const form = useForm<ProductForm>({ resolver: zodResolver(productSchema), defaultValues: emptyProduct });
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
    Promise.all([getProducts(true), getCategories(true)]).then(([nextProducts, nextCategories]) => {
      setProducts(nextProducts);
      setCategories(nextCategories);
      if (!form.getValues("categoryId") && nextCategories[0]) {
        form.setValue("categoryId", nextCategories[0].id);
      }
      setLoading(false);
    }), [form]);

  useEffect(() => {
    void load();
  }, [load]);

  const categoryMap = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);

  const onSubmit = form.handleSubmit(
    async (values) => {
      setMessage(null);
      try {
        const images = values.imageList
          ? values.imageList.split("\n").map((value) => value.trim()).filter(Boolean)
          : [values.coverImage];
        await saveProduct({
          id: values.id ?? "",
          name: values.name,
          slug: slugify(values.slug),
          shortDescription: values.shortDescription,
          description: values.description,
          categoryId: values.categoryId,
          price: values.price,
          currency: "GBP",
          brand: values.brand,
          origin: values.origin,
          weight: values.weight,
          sku: values.sku,
          coverImage: values.coverImage,
          images,
          available: values.available,
          featured: values.featured,
          active: values.active,
          tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        await load();
        form.reset({ ...emptyProduct, categoryId: categories[0]?.id ?? "" });
        setMessage({ status: "success", text: "Product saved successfully." });
      } catch (error) {
        setMessage({ status: "error", text: error instanceof Error ? error.message : "Could not save product." });
      }
    },
    () => setMessage({ status: "error", text: "Please fix the highlighted product fields before saving." })
  );

  const editProduct = (product: Product) => {
    setMessage(null);
    form.reset({
      ...product,
      imageList: product.images.join("\n"),
      tags: product.tags.join(", ")
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeProduct = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    try {
      await deleteProduct(product.id);
      await load();
      setMessage({ status: "success", text: "Product deleted successfully." });
    } catch (error) {
      setMessage({ status: "error", text: error instanceof Error ? error.message : "Could not delete product." });
    }
  };

  const uploadCover = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      setMessage(null);
      const productId = form.getValues("id") || slugify(form.getValues("name")) || "new-product";
      const url = await uploadImage(file, `products/${productId}/cover.webp`);
      form.setValue("coverImage", url, { shouldValidate: true });
      form.setValue("imageList", [url, form.getValues("imageList")].filter(Boolean).join("\n"));
      setMessage({ status: "success", text: "Cover image uploaded and added to the form." });
    } catch (error) {
      setMessage({ status: "error", text: error instanceof Error ? error.message : "Could not upload image." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black">{id ? "Edit product" : "Add product"}</h1>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Input label="Product name" {...form.register("name")} error={form.formState.errors.name?.message} />
          <Input label="Slug" {...form.register("slug")} error={form.formState.errors.slug?.message} />
          <Textarea label="Short description" {...form.register("shortDescription")} error={form.formState.errors.shortDescription?.message} />
          <Textarea label="Description" {...form.register("description")} error={form.formState.errors.description?.message} />
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Category</span>
            <select {...form.register("categoryId")} className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm focus-ring">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price" type="number" step="0.01" {...form.register("price")} error={form.formState.errors.price?.message} />
            <Input label="Weight" {...form.register("weight")} error={form.formState.errors.weight?.message} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Brand" {...form.register("brand")} error={form.formState.errors.brand?.message} />
            <Input label="Origin" {...form.register("origin")} error={form.formState.errors.origin?.message} />
          </div>
          <Input label="SKU" {...form.register("sku")} error={form.formState.errors.sku?.message} />
          <Input label="Cover image URL" {...form.register("coverImage")} error={form.formState.errors.coverImage?.message} />
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Upload cover image</span>
            <span className="mt-1 flex items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-600">
              <Upload className="h-4 w-4" />
              <input type="file" accept="image/*" disabled={uploading} onChange={(event) => void uploadCover(event.target.files?.[0])} className="w-full text-sm" />
            </span>
          </label>
          <Textarea label="Additional image URLs, one per line" {...form.register("imageList")} />
          <Input label="Tags, comma separated" {...form.register("tags")} />
          <div className="grid grid-cols-3 gap-2 text-sm font-semibold">
            <Checkbox label="Available" {...form.register("available")} />
            <Checkbox label="Featured" {...form.register("featured")} />
            <Checkbox label="Active" {...form.register("active")} />
          </div>
          <FormFeedback message={message} />
          <div className="flex gap-2">
            <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {form.formState.isSubmitting ? <LoadingSpinner label="Saving..." size="sm" tone="light" /> : (
                <>
                  <Plus className="h-4 w-4" />
                  Save product
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setMessage(null);
                form.reset({ ...emptyProduct, categoryId: categories[0]?.id ?? "" });
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
          <h2 className="text-xl font-black">Products</h2>
        </div>
        {loading ? <div className="p-5"><LoadingState label="Loading products..." /></div> : null}
        {!loading ? <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3"><img src={product.coverImage} alt="" className="h-12 w-12 rounded-md object-cover" /></td>
                  <td className="px-4 py-3 font-semibold">{product.name}</td>
                  <td className="px-4 py-3">{categoryMap.get(product.categoryId)?.name ?? product.categoryId}</td>
                  <td className="px-4 py-3">GBP {product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">{product.available ? "Available" : "Unavailable"}{product.featured ? " / Featured" : ""}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => editProduct(product)} className="h-9 w-9 rounded-md border border-slate-200" title="Edit product"><Edit className="mx-auto h-4 w-4" /></button>
                      <button type="button" onClick={() => void removeProduct(product)} className="h-9 w-9 rounded-md border border-slate-200 text-berry" title="Delete product"><Trash2 className="mx-auto h-4 w-4" /></button>
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

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & { label: string };
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, ...props }, ref) => {
  return (
    <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
      <input ref={ref} {...props} type="checkbox" />
      {label}
    </label>
  );
});
Checkbox.displayName = "Checkbox";
