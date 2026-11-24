import Link from "next/link";
import { Icon } from "@/components/ui/icon";

/** Persistent, non-dismissible disclosure that the build uses sample data. */
export function DemoBanner() {
  return (
    <div className="border-b border-navy-800 bg-navy-900 text-navy-100">
      <div className="shell flex flex-wrap items-center justify-center gap-x-2 gap-y-1 py-2 text-center text-[11px] sm:text-xs">
        <Icon name="info" className="h-3.5 w-3.5 shrink-0 text-orange-300" />
        <span>
          <strong className="font-semibold text-white">Preview build.</strong> Sample data only — no
          payments, uploads or messages are processed.
        </span>
        <Link href="/demo" className="font-semibold text-orange-300 underline underline-offset-2 hover:text-orange-200">
          What is simulated?
        </Link>
      </div>
    </div>
  );
}
