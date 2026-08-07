import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export type SortDirection = "asc" | "desc";

export function SortableHeader({
  label,
  active,
  direction,
  onClick
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}) {
  const Icon = active ? (direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded px-1 py-1 text-left transition hover:bg-slate-200/70">
      {label}
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

export function PaginationControls({
  page,
  pageSize,
  totalItems,
  itemLabel,
  onPageChange
}: {
  page: number;
  pageSize: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const firstItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing <span className="font-bold text-ink">{firstItem}</span> to <span className="font-bold text-ink">{lastItem}</span> of{" "}
        <span className="font-bold text-ink">{totalItems}</span> {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 px-3 font-bold text-ink disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <span className="min-w-20 text-center font-semibold text-slate-700">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 px-3 font-bold text-ink disabled:cursor-not-allowed disabled:opacity-45"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
