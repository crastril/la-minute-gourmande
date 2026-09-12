import type { MetadataRoute } from "next";
import { RESTAURANT } from "@/data/restaurant";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? RESTAURANT.url;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panier", "/commande/", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
