import type { Litter } from "@/lib/types/marketplace";
import { formatDate } from "@/lib/utils";

/**
 * Frontend-only demonstration rule for opening a reservation.
 *
 * Production must re-check listing status, readiness and the payment decision
 * server-side. Readiness is a configurable platform rule, not a legal opinion.
 */
export function getReservationAvailability(
  litter: Litter,
  referenceDate: string,
): { canReserve: boolean; reason?: string } {
  if (litter.status !== "available") {
    return { canReserve: false, reason: "This litter is no longer accepting reservations." };
  }
  if (litter.readyDate > referenceDate) {
    return {
      canReserve: false,
      reason: `The litter is not ready yet. The sample readiness date is ${formatDate(litter.readyDate)}.`,
    };
  }
  if (litter.listingPlan === "free") {
    return {
      canReserve: false,
      reason: "Free listings do not take paid reservations. Contact the breeder directly.",
    };
  }
  return { canReserve: true };
}
