import { parseCivilDate } from "../../../lib/dates";

/** Day 56 is eligible from midnight UTC, regardless of browser time zone. */
export function litterReadiness(birth: string, now = new Date()) {
  const date = parseCivilDate(birth);
  date.setUTCDate(date.getUTCDate() + 56);
  const readyDate = date.toISOString().slice(0, 10);
  return { readyDate, ready: date.getTime() <= now.getTime() };
}
