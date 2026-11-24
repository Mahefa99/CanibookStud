"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { Icon } from "@/components/ui/icon";
import { PRIMARY_NAV } from "@/lib/config/site";
import { cn } from "@/lib/utils";

/**
 * Public header with an accessible mobile disclosure. The menu closes on route
 * change and on Escape, and returns focus to the trigger. Body scrolling is
 * locked only while the mobile panel is open.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-cream-50/95 backdrop-blur supports-[backdrop-filter]:bg-cream-50/85">
      <div className="shell flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
                isActive(item.href)
                  ? "bg-white text-navy-900 shadow-sm"
                  : "text-[#3E4A59] hover:bg-white/70 hover:text-navy-900",
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 xl:flex">
          <Link
            href="/login"
            className="rounded-full px-3.5 py-2 text-sm font-semibold text-navy-800 hover:bg-white/80"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-800"
          >
            Create account
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <Link
            href="/signup"
            className="inline-flex min-h-9 items-center rounded-full bg-navy-700 px-3.5 py-1.5 text-[13px] font-semibold text-white"
          >
            Join
          </Link>
          <button
            ref={triggerRef}
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy-800"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        ref={panelRef}
        hidden={!open}
        className="border-t border-line bg-cream-50 xl:hidden"
      >
        <nav aria-label="Mobile" className="shell py-4">
          <ul className="space-y-1">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-medium text-navy-900 hover:bg-white"
                >
                  <span>{item.label}</span>
                  <Icon name="chevron-right" className="h-4 w-4 text-navy-300" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#CFC6B8] bg-white px-4 text-sm font-semibold text-navy-800"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy-700 px-4 text-sm font-semibold text-white"
            >
              Create account
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
