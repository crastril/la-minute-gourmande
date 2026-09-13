import type { MetadataRoute } from "next";
import { indexationAutorisee, urlSite } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Version de validation : rien n'est indexé tant que ce n'est pas explicitement autorisé.
  if (!indexationAutorisee()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panier", "/commande/", "/api/"],
    },
    sitemap: `${urlSite()}/sitemap.xml`,
  };
}
