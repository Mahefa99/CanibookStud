import { parseCivilDate } from "../../../lib/dates";

type PublicationInput = { akcNumber: string | null; brucellosisDate: string | null };
type Eligibility = { eligible: true } | {
  eligible: false;
  reason: "missing_akc" | "invalid_test_date" | "future_test" | "expired_test";
};

/** The UTC collection date is day zero. Day fourteen is already expired. */
export function checkStudEligibility(input: PublicationInput, now = new Date()): Eligibility {
  if (!input.akcNumber?.trim()) return { eligible: false, reason: "missing_akc" };
  if (!input.brucellosisDate) return { eligible: false, reason: "invalid_test_date" };
  let testDate: Date;
  try {
    testDate = parseCivilDate(input.brucellosisDate);
  } catch {
    return { eligible: false, reason: "invalid_test_date" };
  }
  const today = parseCivilDate(now.toISOString().slice(0, 10));
  const days = (today.getTime() - testDate.getTime()) / 86_400_000;
  if (days < 0) return { eligible: false, reason: "future_test" };
  if (days >= 14) return { eligible: false, reason: "expired_test" };
  return { eligible: true };
}
