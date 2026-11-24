"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DemoPortrait } from "@/components/domain/demo-portrait";
import { PlanBadge } from "@/components/domain/signal-badges";
import { EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import type { Stud } from "@/lib/types/domain";
import { formatUsd } from "@/lib/utils";

const STORAGE_KEY = "canibookstud.favorites.v1";

/**
 * Favorites are stored in localStorage by FavoriteButton. This view reads the
 * same key after mount, so the server-rendered shell does not flash a false
 * empty state on first paint.
 */
export function FavoritesList({ studs }: { studs: Stud[] }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setIds(parsed.filter((value): value is string => typeof value === "string"));
      }
    } catch {
      // Storage can be blocked; the empty state is still accurate.
    } finally {
      setReady(true);
    }
  }, []);

  function remove(id: string) {
    const next = ids.filter((value) => value !== id);
    setIds(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage restrictions.
    }
  }

  if (!ready) {
    return (
      <div className="space-y-3" aria-busy="true">
        {[0, 1].map((index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl border border-line bg-white" />
        ))}
        <p className="sr-only" role="status">
          Loading saved favorites.
        </p>
      </div>
    );
  }

  const saved = studs.filter((stud) => ids.includes(stud.id));

  if (saved.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="No saved studs yet"
        description="Use the heart button on any profile card to save it. Favorites stay in this browser for the preview."
        action={<ButtonLink href="/studs" size="sm">Browse studs</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <p className="text-[11px] text-muted">
        {saved.length} saved {saved.length === 1 ? "profile" : "profiles"} · stored in this browser
        only
      </p>
      <ul className="mt-3 space-y-3">
        {saved.map((stud) => (
          <li
            key={stud.id}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-card sm:flex-row sm:items-center"
          >
            <Link
              href={`/studs/${stud.slug}`}
              tabIndex={-1}
              aria-hidden="true"
              className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-100"
            >
              <DemoPortrait photo={stud.photos[0]!} className="h-full w-full" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/studs/${stud.slug}`} className="font-display text-xl text-navy-900 hover:underline">
                  {stud.name}
                </Link>
                <PlanBadge plan={stud.plan} status={stud.subscriptionStatus} />
              </div>
              <p className="mt-0.5 text-[12px] text-muted">
                {stud.breed} · {stud.location.city}, {stud.location.stateCode} ·{" "}
                {formatUsd(stud.studFeeUsd)} stud fee
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(stud.id)}
              className="inline-flex min-h-9 items-center gap-1.5 self-start rounded-full border border-line px-3 text-[11px] font-semibold text-muted hover:border-danger-600/30 hover:text-danger-700 sm:self-auto"
            >
              <Icon name="heart" className="h-3.5 w-3.5 fill-orange-500 text-orange-600" />
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
