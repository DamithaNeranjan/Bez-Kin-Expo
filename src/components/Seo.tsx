import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
};

export function Seo({ title, description, path = "/", image = "/bezkin-logo.jpeg", jsonLd }: SeoProps) {
  const baseUrl = import.meta.env.VITE_PUBLIC_SITE_URL || "https://example.co.uk";
  const canonical = `${baseUrl}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image.startsWith("http") ? image : `${baseUrl}${image}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  );
}
