import type { MetadataRoute } from "next";
import { BLOG_ARTICLES, DEMO_ARTICLES } from "@/lib/data/demo/articles";
import { DEMO_BREEDS } from "@/lib/data/demo/breeds";
import { DEMO_CLUBS } from "@/lib/data/demo/clubs";
import { DEMO_EVENTS } from "@/lib/data/demo/events";
import { DEMO_LITTERS } from "@/lib/data/demo/litters";
import { DEMO_PROFESSIONALS } from "@/lib/data/demo/professionals";
import { DEMO_STUDS } from "@/lib/data/demo/studs";
import { SITE } from "@/lib/config/site";

/**
 * Production sitemap. The preview is noindexed by robots.ts until the client
 * approves indexing; the sitemap is still generated so the deployment can be
 * verified without changing code.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const lastModified = new Date("2026-11-04T00:00:00Z");

  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/studs", priority: 0.9 },
    { path: "/puppies", priority: 0.9 },
    { path: "/pet-services", priority: 0.8 },
    { path: "/clubs", priority: 0.7 },
    { path: "/events", priority: 0.7 },
    { path: "/compare", priority: 0.6 },
    { path: "/compare/insurance", priority: 0.6 },
    { path: "/compare/dog-food", priority: 0.6 },
    { path: "/compare/cat-food", priority: 0.6 },
    { path: "/sponsors", priority: 0.5 },
    { path: "/breeds", priority: 0.6 },
    { path: "/articles", priority: 0.5 },
    { path: "/blog", priority: 0.7 },
    { path: "/godpet", priority: 0.7 },
    { path: "/legal/terms", priority: 0.3 },
    { path: "/legal/privacy", priority: 0.3 },
    { path: "/legal/no-delivery", priority: 0.3 },
  ];

  const dynamicRoutes = [
    ...DEMO_STUDS.map((stud) => `/studs/${stud.slug}`),
    ...DEMO_LITTERS.map((litter) => `/puppies/${litter.slug}`),
    ...DEMO_PROFESSIONALS.map((professional) => `/pet-services/${professional.slug}`),
    ...DEMO_CLUBS.map((club) => `/clubs/${club.slug}`),
    ...DEMO_EVENTS.map((event) => `/events/${event.slug}`),
    ...DEMO_BREEDS.map((breed) => `/breeds/${breed.slug}`),
    ...DEMO_ARTICLES.map((article) => `/articles/${article.slug}`),
    ...BLOG_ARTICLES.map((article) => `/blog/${article.slug}`),
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route.path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: route.priority,
    })),
    ...dynamicRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
