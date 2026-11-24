import type { Metadata } from "next";
import { FavoritesList } from "@/components/domain/favorites-list";
import { DEMO_STUDS } from "@/lib/data/demo/studs";

export const metadata: Metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Favorites</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Saved studs</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          A shortlist for comparing profiles later. In production, favorites belong to the account
          and sync across devices; here they are local to this browser.
        </p>
      </header>

      <FavoritesList studs={DEMO_STUDS} />
    </div>
  );
}
