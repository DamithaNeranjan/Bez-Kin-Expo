import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PaginationControls } from "../../components/admin/TableControls";
import { LoadingState } from "../../components/ui/LoadingSpinner";
import { getAuditLogs } from "../../services/auditService";
import type { AuditAction, AuditEntityType, AuditLog } from "../../types/catalog";

type EntityFilter = "all" | AuditEntityType;
type ActionFilter = "all" | AuditAction;

const pageSize = 15;
const entityLabels: Record<AuditEntityType, string> = {
  auth: "Login",
  product: "Product",
  category: "Category",
  settings: "Settings"
};

const actionLabels: Record<AuditAction, string> = {
  login: "Login",
  login_denied: "Denied login",
  create: "Create",
  update: "Update",
  delete: "Delete",
  upload: "Upload"
};

export function AdminAuditTrail() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState<EntityFilter>("all");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    void getAuditLogs().then((nextLogs) => {
      setLogs(nextLogs);
      setLoading(false);
    });
  }, []);

  const filteredLogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesEntity = entityFilter === "all" || log.entityType === entityFilter;
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      const searchableText = `${log.summary} ${log.entityName} ${log.actorName} ${log.actorEmail}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);

      return matchesEntity && matchesAction && matchesSearch;
    });
  }, [actionFilter, entityFilter, logs, search]);
  const pageCount = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const pagedLogs = useMemo(() => filteredLogs.slice((page - 1) * pageSize, page * pageSize), [filteredLogs, page]);

  useEffect(() => {
    setPage(1);
  }, [actionFilter, entityFilter, search]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount));
  }, [pageCount]);

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-black">Audit trail</h1>
            <p className="mt-1 text-sm text-slate-600">Track administrator logins and changes to products, categories, and settings.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_170px_170px] xl:w-[720px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search user, item, or summary"
                className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm focus-ring"
              />
            </label>
            <select value={entityFilter} onChange={(event) => setEntityFilter(event.target.value as EntityFilter)} className="h-10 rounded-md border border-slate-200 px-3 text-sm focus-ring">
              <option value="all">All areas</option>
              <option value="auth">Logins</option>
              <option value="product">Products</option>
              <option value="category">Categories</option>
              <option value="settings">Settings</option>
            </select>
            <select value={actionFilter} onChange={(event) => setActionFilter(event.target.value as ActionFilter)} className="h-10 rounded-md border border-slate-200 px-3 text-sm focus-ring">
              <option value="all">All actions</option>
              <option value="login">Login</option>
              <option value="login_denied">Denied login</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="upload">Upload</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? <div className="p-5"><LoadingState label="Loading audit trail..." /></div> : null}
      {!loading ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Area</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDateTime(log.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded px-2 py-1 text-xs font-bold ${actionTone(log.action)}`}>{actionLabels[log.action]}</span>
                    </td>
                    <td className="px-4 py-3">{entityLabels[log.entityType]}</td>
                    <td className="px-4 py-3 font-semibold">{log.entityName}</td>
                    <td className="px-4 py-3">
                      <span className="block font-semibold">{log.actorName}</span>
                      <span className="block text-xs text-slate-500">{log.actorEmail}</span>
                    </td>
                    <td className="min-w-64 px-4 py-3 text-slate-600">{log.summary}</td>
                  </tr>
                ))}
                {!pagedLogs.length ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center font-semibold text-slate-500">
                      No audit entries match the current filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <PaginationControls page={page} pageSize={pageSize} totalItems={filteredLogs.length} itemLabel="audit entries" onPageChange={setPage} />
        </>
      ) : null}
    </section>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function actionTone(action: AuditAction) {
  if (action === "delete" || action === "login_denied") return "bg-berry/10 text-berry";
  if (action === "create" || action === "login") return "bg-leaf/10 text-leaf";
  if (action === "upload") return "bg-sky-100 text-sky-700";
  return "bg-harvest/20 text-ink";
}
