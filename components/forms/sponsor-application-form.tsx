"use client";
import { SponsorBooking } from "./sponsor-booking";
export function SponsorApplicationForm({
  eventTitle,
}: {
  eventSlug?: string;
  eventTitle?: string;
}) {
  return <SponsorBooking eventTitle={eventTitle} />;
}
