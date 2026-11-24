const civilDate = /^\d{4}-\d{2}-\d{2}$/;
const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
});

// Round-trip verification rejects normalized dates such as February 30.
export function parseCivilDate(input: string): Date {
  if (!civilDate.test(input)) throw new RangeError("Expected YYYY-MM-DD.");
  const result = new Date(input + "T00:00:00.000Z");
  if (!Number.isFinite(result.getTime()) || result.toISOString().slice(0, 10) !== input) {
    throw new RangeError("Invalid calendar date.");
  }
  return result;
}

export function formatCivilDate(input: string): string {
  return formatter.format(parseCivilDate(input));
}
