import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/icon";

type AlertTone = "info" | "success" | "warning" | "danger" | "neutral";

const alertTones: Record<AlertTone, { wrapper: string; icon: IconName }> = {
  info: { wrapper: "border-info-600/20 bg-info-50 text-info-700", icon: "info" },
  success: { wrapper: "border-success-600/20 bg-success-50 text-success-700", icon: "check" },
  warning: { wrapper: "border-warning-600/25 bg-warning-50 text-warning-700", icon: "warning" },
  danger: { wrapper: "border-danger-600/20 bg-danger-50 text-danger-700", icon: "warning" },
  neutral: { wrapper: "border-line bg-cream-50 text-[#46505E]", icon: "info" },
};

/**
 * Inline notice. Pass `role="alert"` for validation failures that need
 * immediate announcement; default is a polite status region.
 */
export function Alert({
  tone = "neutral",
  title,
  children,
  role,
  className,
  action,
}: {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  role?: "status" | "alert";
  className?: string;
  action?: ReactNode;
}) {
  const config = alertTones[tone];
  return (
    <div
      role={role ?? (tone === "danger" ? "alert" : "status")}
      className={cn("flex gap-3 rounded-xl border p-3.5 text-sm", config.wrapper, className)}
    >
      <Icon name={config.icon} className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={cn("leading-relaxed", title && "mt-0.5", "text-[13px]")}>{children}</div>
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  );
}

export function EmptyState({
  icon = "search",
  title,
  description,
  action,
  secondaryAction,
}: {
  icon?: IconName;
  title: string;
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#D5CCBD] bg-cream-50 px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-navy-600 shadow-sm">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-display text-2xl text-navy-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {action || secondaryAction ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: IconName;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
        {icon ? (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-navy-50 text-navy-700">
            <Icon name={icon} className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      <p className="tabular mt-3 font-display text-3xl leading-none text-navy-900">{value}</p>
      {hint ? <p className="mt-2 text-xs leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}
