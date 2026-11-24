import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Wordmark + vector trace of the supplied logo. The white tile preserves the
 * existing lockup on both light and dark surfaces. Original JPG is retained.
 */
export function Logo({
  variant = "default",
  href = "/",
  showTagline = true,
  className,
}: {
  variant?: "default" | "on-dark";
  href?: string;
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg",
        className,
      )}
    >
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <Image
          src="/brand/canibookstud-logo.svg"
          alt=""
          width={44}
          height={42}
          className="h-[38px] w-[38px] object-contain"
          priority
        />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[22px] tracking-[-0.02em]",
            variant === "on-dark" ? "text-white" : "text-navy-900",
          )}
        >
          Canibook
          <span
            className={
              variant === "on-dark" ? "text-orange-400" : "text-orange-700"
            }
          >
            Stud
          </span>
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em]",
              variant === "on-dark" ? "text-navy-200" : "text-muted",
            )}
          >
            Stud marketplace · USA
          </span>
        ) : null}
      </span>
    </Link>
  );
}
