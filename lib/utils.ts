/**
 * Small, dependency-free helpers shared by server and client components.
 */

/** Joins conditional class names without pulling in a utility dependency. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdFormatterWithCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats whole-dollar marketplace amounts, e.g. 400 -> "$400". */
export function formatUsd(amount: number): string {
  return usdFormatter.format(amount);
}

/** Formats amounts that may include cents (subtotal/fee breakdowns). */
export function formatUsdDetailed(amount: number): string {
  return Number.isInteger(amount)
    ? usdFormatter.format(amount)
    : usdFormatterWithCents.format(amount);
}

/**
 * Formats an ISO date in US English. The marketplace is US-only, so dates are
 * rendered as "Nov 4, 2026" rather than the visitor's locale.
 */
export function formatDate(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" },
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    ...options,
  }).format(new Date(`${isoDate.slice(0, 10)}T00:00:00Z`));
}

/**
 * Formats an event timestamp in its explicit US time zone. Event dates without
 * a zone are not accepted by the domain type in practice.
 */
export function formatEventDateTime(isoDateTime: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  }).format(new Date(isoDateTime));
}

/** Whole years between two ISO dates, used for animal ages. */
export function ageInYears(birthDate: string, referenceDate: string): number {
  const birth = new Date(`${birthDate.slice(0, 10)}T00:00:00Z`);
  const reference = new Date(`${referenceDate.slice(0, 10)}T00:00:00Z`);
  let years = reference.getUTCFullYear() - birth.getUTCFullYear();
  const monthDelta = reference.getUTCMonth() - birth.getUTCMonth();
  if (monthDelta < 0 || (monthDelta === 0 && reference.getUTCDate() < birth.getUTCDate())) {
    years -= 1;
  }
  return Math.max(0, years);
}

/** Number of days between an ISO date and a reference date. */
export function daysSince(isoDate: string, referenceDate: string): number {
  const from = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`).getTime();
  const to = new Date(`${referenceDate.slice(0, 10)}T00:00:00Z`).getTime();
  return Math.max(0, Math.round((to - from) / 86_400_000));
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}

/** Stable pseudo-random integer from a string, for deterministic demo art. */
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
