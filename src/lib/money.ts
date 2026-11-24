const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatUsdCents(cents: number): string {
  if (!Number.isSafeInteger(cents)) throw new RangeError("Expected integer USD cents.");
  // Split dollars and cents before formatting to preserve large integer amounts.
  const absolute = Math.abs(cents);
  const dollars = Math.floor(absolute / 100);
  const fraction = String(absolute % 100).padStart(2, "0");
  return usd.formatToParts(cents < 0 ? -dollars : dollars)
    .map(part => part.type === "fraction" ? fraction : part.value).join("");
}
