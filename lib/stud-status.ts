import type { Stud } from "@/lib/types/domain";

/**
 * Listing-level rule for opening a breeding request.
 *
 * The 14-day brucellosis window comes from the client documents but is NOT a
 * verified legal rule. It is implemented as a configurable platform rule and
 * labelled as such in the UI. The backend must re-check it; the frontend is
 * never the authority for unlocking contact details.
 */
export function getRequestAvailability(stud: Stud): {
  canRequest: boolean;
  reason?: string;
} {
  if (stud.listingStatus !== "active") {
    return { canRequest: false, reason: "This profile is not currently accepting requests." };
  }

  if (stud.brucellosis.status === "missing") {
    return {
      canRequest: false,
      reason: "A brucellosis test must be on file before a request can be accepted.",
    };
  }

  if (stud.brucellosis.status === "expired") {
    return {
      canRequest: false,
      reason:
        "The brucellosis test is outside the 14-day listing window. The owner must upload a current test first.",
    };
  }

  return { canRequest: true };
}
