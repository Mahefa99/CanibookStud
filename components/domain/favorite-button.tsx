"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "canibookstud.favorites.v1";

function readFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Local-only favorite toggle. Persistence is intentionally client-side in the
 * preview; the backend must own favorites for signed-in users.
 */
export function FavoriteButton({ studId, studName }: { studId: string; studName: string }) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(readFavorites().includes(studId));
    setReady(true);
  }, [studId]);

  function toggle() {
    const next = new Set(readFavorites());
    if (next.has(studId)) {
      next.delete(studId);
    } else {
      next.add(studId);
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // Private browsing can block storage; the toggle still reflects the
      // current interaction and no error is surfaced to the visitor.
    }
    setSaved(next.has(studId));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${studName} from favorites` : `Save ${studName} to favorites`}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border shadow-sm backdrop-blur transition-colors",
        saved
          ? "border-orange-300 bg-orange-50 text-orange-700"
          : "border-white/70 bg-white/90 text-navy-700 hover:bg-white",
      )}
      data-ready={ready}
    >
      <Icon name="heart" className={cn("h-5 w-5", saved && "fill-orange-500 text-orange-600")} />
    </button>
  );
}
