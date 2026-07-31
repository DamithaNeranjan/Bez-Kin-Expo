type LoadingSpinnerProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light" | "accent";
};

const sizeClass = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4"
};

const toneClass = {
  dark: "border-slate-300 border-t-ink",
  light: "border-white/35 border-t-white",
  accent: "border-harvest/25 border-t-harvest"
};

export function LoadingSpinner({ label = "Loading", size = "md", tone = "dark" }: LoadingSpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`inline-block animate-spin rounded-full ${sizeClass[size]} ${toneClass[tone]}`} aria-hidden="true" />
      <span className={label ? "" : "sr-only"}>{label}</span>
    </span>
  );
}

export function LoadingState({ label = "Loading content..." }: { label?: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-600 shadow-sm">
      <LoadingSpinner label={label} size="lg" />
    </div>
  );
}
