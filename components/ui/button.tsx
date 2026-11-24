import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55";

/**
 * Button classes are shared by <button> and <Link> so keyboard, hover and
 * disabled states stay identical. Orange is never used for white text: navy on
 * orange passes AA (5.03:1), white on orange does not (2.81:1).
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  const sizes: Record<ButtonSize, string> = {
    sm: "min-h-9 px-3.5 py-1.5 text-[13px]",
    md: "min-h-11 px-5 py-2.5 text-sm",
    lg: "min-h-12 px-6 py-3 text-[15px]",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "border-navy-700 bg-navy-700 text-white shadow-sm hover:border-navy-800 hover:bg-navy-800",
    secondary:
      "border-[#CFC6B8] bg-white text-navy-800 hover:border-navy-700 hover:bg-cream-50",
    accent:
      "border-orange-500 bg-orange-500 text-navy-900 hover:border-orange-400 hover:bg-orange-400",
    ghost:
      "border-transparent bg-transparent text-navy-700 hover:bg-navy-50 hover:text-navy-800",
    danger:
      "border-danger-600 bg-danger-600 text-white hover:border-danger-700 hover:bg-danger-700",
  };

  return cn(base, sizes[size], variants[variant], fullWidth && "w-full", className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Icon name="spinner" className="h-4 w-4 animate-spin" /> : iconLeft}
      {children}
      {!loading ? iconRight : null}
    </button>
  );
}

interface ButtonLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    ButtonStyleOptions {
  href: string;
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

/** Internal navigation styled as a button. Use <a> for external destinations. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  iconLeft,
  iconRight,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Link>
  );
}
