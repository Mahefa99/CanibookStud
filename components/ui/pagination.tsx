import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

/**
 * Server-rendered pagination. Links preserve the active filter query.
 * The current page is exposed with aria-current; prev/next become plain text
 * when unavailable, so keyboard order stays predictable.
 */
export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  hrefForPage,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  hrefForPage: (page: number) => string;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Directory pagination"
      className="flex flex-col items-center justify-between gap-4 border-t border-line pt-5 sm:flex-row"
    >
      <p className="text-xs text-muted">
        Showing <span className="tabular font-semibold text-ink">{start}</span>–
        <span className="tabular font-semibold text-ink">{end}</span> of{" "}
        <span className="tabular font-semibold text-ink">{total}</span> studs
      </p>

      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <Link
            href={hrefForPage(page - 1)}
            className="inline-flex h-9 items-center gap-1 rounded-full border border-line bg-white px-3 text-xs font-semibold text-navy-800 hover:border-navy-300"
            rel="prev"
          >
            <Icon name="chevron-left" className="h-4 w-4" />
            Previous
          </Link>
        ) : (
          <span className="inline-flex h-9 cursor-not-allowed items-center gap-1 rounded-full border border-line bg-cream-50 px-3 text-xs font-semibold text-muted">
            <Icon name="chevron-left" className="h-4 w-4" />
            Previous
          </span>
        )}

        {pages.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={hrefForPage(pageNumber)}
            aria-current={pageNumber === page ? "page" : undefined}
            aria-label={`Page ${pageNumber}`}
            className={cn(
              "tabular grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold",
              pageNumber === page
                ? "border-navy-700 bg-navy-700 text-white"
                : "border-line bg-white text-navy-800 hover:border-navy-300",
            )}
          >
            {pageNumber}
          </Link>
        ))}

        {page < pageCount ? (
          <Link
            href={hrefForPage(page + 1)}
            className="inline-flex h-9 items-center gap-1 rounded-full border border-line bg-white px-3 text-xs font-semibold text-navy-800 hover:border-navy-300"
            rel="next"
          >
            Next
            <Icon name="chevron-right" className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex h-9 cursor-not-allowed items-center gap-1 rounded-full border border-line bg-cream-50 px-3 text-xs font-semibold text-muted">
            Next
            <Icon name="chevron-right" className="h-4 w-4" />
          </span>
        )}
      </div>
    </nav>
  );
}

export function RatingStars({ value, className }: { value: number; className?: string }) {
  const rounded = Math.round(value);
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-orange-600", className)}
      role="img"
      aria-label={`${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          className={cn("h-3.5 w-3.5", star <= rounded ? "fill-current" : "text-navy-200")}
        />
      ))}
    </span>
  );
}

