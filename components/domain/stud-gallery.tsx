"use client";

import { useState } from "react";
import { DemoPortrait } from "@/components/domain/demo-portrait";
import { Icon } from "@/components/ui/icon";
import type { DemoPhoto } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

/**
 * Accessible gallery for illustrative portraits.
 *
 * Controls are real buttons with labels; the image count is announced politely.
 * Arrow keys move between images when focus is inside the gallery. No lightbox
 * is used so keyboard and screen-reader behaviour stays predictable.
 */
export function StudGallery({
  photos,
  name,
}: {
  photos: DemoPhoto[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const safePhotos = photos.length > 0 ? photos : [];
  const current = safePhotos[index];

  if (!current) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-line bg-cream-100 text-sm text-muted">
        No photos supplied
      </div>
    );
  }

  const go = (direction: -1 | 1) => {
    setIndex((value) => (value + direction + safePhotos.length) % safePhotos.length);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${name} photo gallery`}
      className="overflow-hidden rounded-2xl border border-line bg-white"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(1);
        }
      }}
    >
      <div className="relative aspect-[4/3] bg-cream-100">
        <DemoPortrait photo={current} alt={current.alt} className="h-full w-full" />

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted backdrop-blur">
          Illustration · sample
        </span>

        {safePhotos.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/90 text-navy-800 shadow-sm hover:bg-white"
            >
              <Icon name="chevron-left" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/90 text-navy-800 shadow-sm hover:bg-white"
            >
              <Icon name="chevron-right" className="h-4 w-4" />
            </button>
          </>
        ) : null}

        <p className="sr-only" aria-live="polite">
          Photo {index + 1} of {safePhotos.length}
        </p>
      </div>

      {safePhotos.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto p-3">
          {safePhotos.map((photo, photoIndex) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setIndex(photoIndex)}
              aria-label={`Show photo ${photoIndex + 1} of ${safePhotos.length}`}
              aria-pressed={photoIndex === index}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                photoIndex === index ? "border-navy-700" : "border-transparent hover:border-navy-200",
              )}
            >
              <DemoPortrait photo={photo} className="h-full w-full" />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
