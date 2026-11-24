/** @type {import("next").NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: { outputFileTracingRoot: process.cwd(), serverActions: { bodySizeLimit: "5mb" } },
  poweredByHeader: false,
  // Demo assets are local. No remote image host is trusted until the client
  // confirms where animal photos will be stored (Supabase Storage is the
  // documented candidate, not a validated decision).
  images: {
    remotePatterns: [],
  },

  /**
   * Compatibility routes from the source specification. The current navigation
   * uses /studs, /pet-services and /breeds; these redirects keep the CDC URLs
   * (and any existing links) working without duplicating screens.
   */
  async redirects() {
    return [
      { source: "/map", destination: "/studs?view=map", permanent: false },
      { source: "/stud", destination: "/studs", permanent: false },
      { source: "/stud/:slug", destination: "/studs/:slug", permanent: false },
      { source: "/pet-services-map", destination: "/pet-services?view=map", permanent: false },
      { source: "/vets", destination: "/pet-services?category=vet", permanent: false },
      { source: "/breed/:breed", destination: "/breeds/:breed", permanent: false },
      { source: "/dashboard/dams", destination: "/dashboard/animals", permanent: false },
      { source: "/dashboard/studs", destination: "/dashboard/animals", permanent: false },
      { source: "/dashboard/litters", destination: "/dashboard/listings", permanent: false },
      { source: "/sponsors/new", destination: "/sponsors#apply", permanent: false },
    ];
  },
};

export default nextConfig;


