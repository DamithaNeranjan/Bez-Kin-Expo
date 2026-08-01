import { useState, type ImgHTMLAttributes } from "react";
import { buildSrcSet, optimizeImageUrl } from "../../utils/imageUrl";

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string;
  widthHint?: number;
  widths?: number[];
};

export function OptimizedImage({
  src,
  widthHint = 800,
  widths,
  sizes = "100vw",
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  className = "",
  style,
  onLoad,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const priorityProps = fetchPriority ? ({ fetchpriority: fetchPriority } as Record<string, string>) : {};
  const placeholderUrl = optimizeImageUrl(src, 48);
  const wrapperStyle = {
    ...style,
    backgroundColor: "#e2e8f0"
  };
  const placeholderStyle = placeholderUrl
    ? {
        backgroundImage: `url("${placeholderUrl}")`,
        backgroundPosition: "center",
        backgroundSize: "cover"
      }
    : undefined;

  return (
    <span className={`relative block overflow-hidden ${className}`} style={wrapperStyle}>
      <span
        aria-hidden="true"
        className={`absolute inset-0 scale-110 bg-cover bg-center blur-xl transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
        style={placeholderStyle}
      />
      <img
        {...props}
        {...priorityProps}
        src={optimizeImageUrl(src, widthHint)}
        srcSet={buildSrcSet(src, widths)}
        sizes={sizes}
        loading={loading}
        decoding={decoding}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}
