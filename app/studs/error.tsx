"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Route error boundary. Values entered in filters are preserved in the URL, so
 * "Try again" can re-render the same query. No error details are shown to the
 * visitor; the digest is available to the platform logs.
 */
export default function StudsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where the error reporter would be called.
    console.error(error);
  }, [error]);

  return (
    <div className="shell flex min-h-[50vh] flex-col items-start justify-center py-16">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-4 max-w-xl font-display text-4xl text-navy-900">
        The directory could not load.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
        Your filter choices are still in the address bar. Try again, or return to the full
        directory.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <a
          href="/studs"
          className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-800"
        >
          Reset the directory
        </a>
      </div>
      {error.digest ? (
        <p className="mt-6 text-[11px] text-muted">Reference: {error.digest}</p>
      ) : null}
    </div>
  );
}
