import type { Event } from "@/lib/types/marketplace";
import { stateName } from "@/lib/data/us-states";

/**
 * Fictional events. The ticket example is $25 + $2 = $27. The time zone is
 * explicit per event and rendered in US English.
 */
export const DEMO_EVENTS: Event[] = [
  {
    id: "event-austin-meetup",
    slug: "frenchie-meetup-austin",
    title: "Frenchie Meetup Austin",
    clubSlug: "lone-star-french-bulldog-club",
    startsAt: "2026-12-12T18:00:00-06:00",
    timeZone: "America/Chicago",
    timeZoneLabel: "Central Time (CT)",
    locationName: "Riverside Commons picnic area",
    address: "2100 Riverside Commons",
    city: "Austin",
    stateCode: "TX",
    stateName: stateName("TX"),
    capacity: 100,
    ticketsSold: 64,
    ticketPriceUsd: 25,
    feeUsd: 2,
    totalUsd: 27,
    status: "on_sale",
    description:
      "An evening meetup with a shaded play area, a short handling demo and a quiet corner for older dogs. Tickets include a drink and a small treat bag.",
    sponsors: [{ name: "Sample sponsor (demo)", tier: "premium", sample: true }],
  },
  {
    id: "event-miami-walk",
    slug: "frenchie-beach-walk",
    title: "Frenchie Beach Walk",
    clubSlug: "sunshine-frenchie-club",
    startsAt: "2027-01-17T09:00:00-05:00",
    timeZone: "America/New_York",
    timeZoneLabel: "Eastern Time (ET)",
    locationName: "Harbor Point boardwalk",
    address: "1 Harbor Point",
    city: "Miami",
    stateCode: "FL",
    stateName: stateName("FL"),
    capacity: 60,
    ticketsSold: 60,
    ticketPriceUsd: 25,
    feeUsd: 2,
    totalUsd: 27,
    status: "sold_out",
    description:
      "A short morning walk followed by a cooling station and a breed Q&A. The sample event is sold out; joining the waitlist is not connected.",
    sponsors: [],
  },
  {
    id: "event-boulder-workshop",
    slug: "rocky-mountain-handling-workshop",
    title: "Rocky Mountain Handling Workshop",
    clubSlug: "rocky-mountain-shepherd-club",
    startsAt: "2027-02-07T10:00:00-07:00",
    timeZone: "America/Denver",
    timeZoneLabel: "Mountain Time (MT)",
    locationName: "Foothill Training Field",
    address: "5400 Foothill Road",
    city: "Boulder",
    stateCode: "CO",
    stateName: stateName("CO"),
    capacity: 40,
    ticketsSold: 12,
    ticketPriceUsd: 40,
    feeUsd: 2,
    totalUsd: 42,
    status: "on_sale",
    description:
      "A two-hour handling workshop for working breeds. Handlers rotate through gaiting, stand-for-exam and crowd-neutral exercises. Dogs must be at least six months old.",
    sponsors: [],
  },
];

export function findDemoEvent(slug: string): Event | undefined {
  return DEMO_EVENTS.find((event) => event.slug === slug);
}
