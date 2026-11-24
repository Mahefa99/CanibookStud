import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Icon } from "@/components/ui/icon";

/** Shared split layout for the authentication screens. */
export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="shell py-10 lg:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-line bg-white shadow-card lg:grid-cols-[0.95fr_1.05fr]">
        <div className="on-dark relative overflow-hidden bg-navy-900 p-7 text-white sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-2xl"
          />
          <Logo variant="on-dark" />
          <h2 className="mt-10 text-balance font-display text-3xl leading-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-100">{subtitle}</p>

          <ul className="mt-8 space-y-3 text-sm text-navy-100">
            {[
              "Separate subscription, document and club signals",
              "Approximate locations; contact details stay private",
              "One account, several activities",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
                {item}
              </li>
            ))}
          </ul>


        </div>

        <div className="p-7 sm:p-10 lg:p-12">{children}</div>
      </div>

      <p className="mx-auto mt-6 max-w-5xl text-center text-[11px] text-muted">
        <Link href="/" className="underline underline-offset-2 hover:text-navy-800">
          Return to the public site
        </Link>
        {" · "}
        <Link href="/demo" className="underline underline-offset-2 hover:text-navy-800">
          What is simulated?
        </Link>
      </p>
    </div>
  );
}

