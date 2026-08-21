import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];

  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-08-21T00:00:00.000Z"),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
