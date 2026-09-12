import type { MetadataRoute } from "next";
import { RESTAURANT } from "@/data/restaurant";

const PAGES = [
  { chemin: "", priorite: 1 },
  { chemin: "/carte", priorite: 0.9 },
  { chemin: "/a-propos", priorite: 0.6 },
  { chemin: "/contact", priorite: 0.6 },
  { chemin: "/mentions-legales", priorite: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? RESTAURANT.url;

  return PAGES.map(({ chemin, priorite }) => ({
    url: `${base}${chemin}`,
    lastModified: new Date(),
    changeFrequency: chemin === "/carte" ? "daily" : "monthly",
    priority: priorite,
  }));
}
