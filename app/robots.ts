import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config/site";

/**
 * The fictional preview is noindexed by default. Set NEXT_PUBLIC_ALLOW_INDEXING
 * to "true" only when the content, legal pages and production domain are
 * approved. Personal, transactional and administrative routes stay excluded
 * even then.
 */
export default function robots(): MetadataRoute.Robots {
  const indexingEnabled = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    rules: indexingEnabled
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/dashboard", "/admin", "/checkout", "/contracts", "/access-denied", "/api"],
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
