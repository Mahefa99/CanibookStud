import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { DemoBanner } from "@/components/layout/demo-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DEMO_DISCLOSURE, SITE } from "@/lib/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: {
    default: "CanibookStud — Stud discovery for US breeders",
    template: "%s · CanibookStud",
  },
  description:
    "Find studs with documented health records, private contact details and clear request states. A US marketplace for responsible breeding.",
  keywords: ["stud dog", "French Bulldog stud", "dog breeding", "AKC", "brucellosis"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE.name,
    title: "CanibookStud — Stud discovery, with the records in view",
    description:
      "A calmer marketplace for studs: separate subscription, document and club signals; no delivery by the platform.",
    url: SITE.url,
  },
  // Fictional demo content must not be indexed. Flip via env only once the
  // production content and legal pages are approved.
  robots:
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#002B58",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <DemoBanner />
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <p className="sr-only">{DEMO_DISCLOSURE}</p>
      </body>
    </html>
  );
}
