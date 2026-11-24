import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-navy-800 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="max-w-[14rem] truncate text-ink">
                  {item.label}
                </span>
              )}
              {!isLast ? <Icon name="chevron-right" className="h-3 w-3 text-navy-200" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
  tone = "cream",
  breadcrumbs,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  tone?: "cream" | "white";
  breadcrumbs?: ReactNode;
}) {
  return (
    <header
      className={cn(
        "border-b border-line",
        tone === "cream" ? "bg-cream-50" : "bg-white",
      )}
    >
      <div className="shell py-8 sm:py-10 lg:py-14">
        {breadcrumbs ? <div className="mb-4">{breadcrumbs}</div> : null}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1 className="mt-3 text-balance font-display text-4xl leading-[1.05] text-navy-900 sm:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
        {children}
      </div>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  dark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className={cn("eyebrow", dark && "text-orange-300 before:bg-orange-400")}>{eyebrow}</p>
        ) : null}
        <h2
          className={cn(
            "mt-3 text-balance font-display text-3xl leading-tight sm:text-4xl",
            dark ? "text-white" : "text-navy-900",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className={cn("mt-3 text-pretty text-sm leading-relaxed sm:text-[15px]", dark ? "text-navy-100" : "text-muted")}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
