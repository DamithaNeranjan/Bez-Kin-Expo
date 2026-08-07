import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Trash2, Upload } from "lucide-react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormFeedback, type FormFeedbackMessage } from "../../components/admin/FormFeedback";
import { PaginationControls, SortableHeader, type SortDirection } from "../../components/admin/TableControls";
import { LoadingSpinner, LoadingState } from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { buildActor, recordAuditLog } from "../../services/auditService";
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
type CategorySortKey = "image" | "name" | "order" | "active";

const pageSize = 10;

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
  const [sortKey, setSortKey] = useState<CategorySortKey>("order");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const { user, profile } = useAuth();
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

  const sortedCategories = useMemo(() => {
    return [...categories].sort((first, second) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      const firstValue = getCategorySortValue(first, sortKey);
      const secondValue = getCategorySortValue(second, sortKey);

      if (typeof firstValue === "number" && typeof secondValue === "number") {
        return (firstValue - secondValue) * direction;
      }

      return String(firstValue).localeCompare(String(secondValue), undefined, { numeric: true, sensitivity: "base" }) * direction;
    });
  }, [categories, sortDirection, sortKey]);
  const pageCount = Math.max(1, Math.ceil(sortedCategories.length / pageSize));
  const pagedCategories = useMemo(() => sortedCategories.slice((page - 1) * pageSize, page * pageSize), [page, sortedCategories]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount));
  }, [pageCount]);

  const toggleSort = (nextSortKey: CategorySortKey) => {
    setPage(1);
    setSortKey((currentSortKey) => {
      if (currentSortKey === nextSortKey) {
        setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"));
        return currentSortKey;
      }

      setSortDirection("asc");
      return nextSortKey;
    });
  };

  const onSubmit = form.handleSubmit(
    async (values) => {
      setMessage(null);
      try {
        const isUpdate = Boolean(values.id);
        const categoryId = await saveCategory({
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
        await recordAuditLog({
          ...buildActor(user, profile),
          action: isUpdate ? "update" : "create",
          entityType: "category",
          entityId: categoryId,
          entityName: values.name,
          summary: `${isUpdate ? "Updated" : "Created"} category "${values.name}".`
        }).catch(() => undefined);
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
      await recordAuditLog({
        ...buildActor(user, profile),
        action: "delete",
        entityType: "category",
        entityId: category.id,
        entityName: category.name,
        summary: `Deleted category "${category.name}".`
      }).catch(() => undefined);
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
      await recordAuditLog({
        ...buildActor(user, profile),
        action: "upload",
        entityType: "category",
        entityId: categoryId,
        entityName: form.getValues("name") || "Category form",
        summary: `Uploaded category image for "${form.getValues("name") || categoryId}".`
      }).catch(() => undefined);
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
        {!loading ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">
                      <SortableHeader label="Image" active={sortKey === "image"} direction={sortDirection} onClick={() => toggleSort("image")} />
                    </th>
                    <th className="px-4 py-3">
                      <SortableHeader label="Name" active={sortKey === "name"} direction={sortDirection} onClick={() => toggleSort("name")} />
                    </th>
                    <th className="px-4 py-3">
                      <SortableHeader label="Order" active={sortKey === "order"} direction={sortDirection} onClick={() => toggleSort("order")} />
                    </th>
                    <th className="px-4 py-3">
                      <SortableHeader label="Active" active={sortKey === "active"} direction={sortDirection} onClick={() => toggleSort("active")} />
                    </th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedCategories.map((category) => (
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
                  {!pagedCategories.length ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center font-semibold text-slate-500">
                        No categories found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            <PaginationControls page={page} pageSize={pageSize} totalItems={sortedCategories.length} itemLabel="categories" onPageChange={setPage} />
          </>
        ) : null}
      </section>
    </div>
  );
}

function getCategorySortValue(category: Category, sortKey: CategorySortKey) {
  if (sortKey === "image") return category.image;
  if (sortKey === "name") return category.name;
  if (sortKey === "order") return category.order;
  return category.active ? 1 : 0;
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
