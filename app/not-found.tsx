import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full border border-line bg-cream-100 text-navy-400">
        <Icon name="paw" className="h-9 w-9" />
      </span>
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
        404 · Page not found
      </p>
      <h1 className="mt-3 max-w-xl text-balance font-display text-4xl leading-tight text-navy-900 sm:text-5xl">
        This trail ends here.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        The page may have moved, or the profile may no longer be available. The directory is the
        best place to start again.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/studs" iconRight={<Icon name="arrow-right" className="h-4 w-4" />}>
          Browse studs
        </ButtonLink>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-800"
        >
          Back home
        </Link>
      </div>
      <p className="mt-6 text-[11px] text-muted">
        Looking for a specific profile?{" "}
        <Link href="/studs?q=" className="underline underline-offset-2">
          Search the directory
        </Link>
        .
      </p>
    </div>
  );
}
