const responsiveWidths = [320, 480, 640, 800, 1200];

export function optimizeImageUrl(src: string, width: number) {
  if (!src || src.startsWith("/") || src.startsWith("data:")) {
    return src;
  }

  try {
    const url = new URL(src);

    if (url.hostname.includes("res.cloudinary.com") && url.pathname.includes("/image/upload/")) {
      const transformation = `f_auto,q_auto,c_limit,w_${width}`;
      url.pathname = url.pathname.replace("/image/upload/", `/image/upload/${transformation}/`);
      return url.toString();
    }

    if (url.hostname.includes("images.unsplash.com")) {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", url.searchParams.get("fit") || "crop");
      url.searchParams.set("w", String(width));
      url.searchParams.set("q", "75");
      return url.toString();
    }
  } catch {
    return src;
  }

  return src;
}

export function buildSrcSet(src: string, widths = responsiveWidths) {
  if (!src || src.startsWith("/") || src.startsWith("data:")) {
    return undefined;
  }

  return widths.map((width) => `${optimizeImageUrl(src, width)} ${width}w`).join(", ");
}
