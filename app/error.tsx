"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Global error boundary. It intentionally shows no stack trace or internal
 * detail; the digest is the only reference exposed to the visitor.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell flex min-h-[60vh] flex-col items-start justify-center py-16">
      <p className="eyebrow">Unexpected error</p>
      <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight text-navy-900">
        Something went wrong on this page.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
        Your data has not been submitted anywhere. Try the page again, or return to the directory.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <a
          href="/studs"
          className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-800"
        >
          Back to studs
        </a>
      </div>
      {error.digest ? (
        <p className="mt-6 text-[11px] text-muted">Reference: {error.digest}</p>
      ) : null}
    </div>
  );
}
