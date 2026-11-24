import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/icon";

export type BadgeTone = "neutral" | "navy" | "accent" | "success" | "warning" | "danger" | "info" | "plum";

const tones: Record<BadgeTone, string> = {
  neutral: "border-[#D8D0C3] bg-white text-[#46505E]",
  navy: "border-navy-200 bg-navy-50 text-navy-800",
  accent: "border-orange-200 bg-orange-50 text-orange-800",
  success: "border-success-600/20 bg-success-50 text-success-700",
  warning: "border-warning-600/25 bg-warning-50 text-warning-700",
  danger: "border-danger-600/20 bg-danger-50 text-danger-700",
  info: "border-info-600/20 bg-info-50 text-info-700",
  plum: "border-plum-600/20 bg-plum-50 text-plum-700",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: IconName;
  className?: string;
  /** Optional longer explanation exposed to pointer and assistive tech. */
  description?: string;
  size?: "sm" | "md";
}

/**
 * Text-first badge. Status is always conveyed by words, never by color alone.
 */
export function Badge({
  children,
  tone = "neutral",
  icon,
  className,
  description,
  size = "sm",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold leading-tight",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
        tones[tone],
        className,
      )}
      title={description}
    >
      {icon ? <Icon name={icon} className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} /> : null}
      <span>{children}</span>
      {description ? <span className="sr-only">. {description}</span> : null}
    </span>
  );
}
