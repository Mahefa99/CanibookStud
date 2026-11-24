/**
 * Local route smoke check. Fetches every implemented route and reports non-200
 * responses. Dynamic slugs mirror the demo data; keep in sync when adding demo
 * records.
 */
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";

const routes = [
  "/",
  "/studs",
  "/studs/marlo-northshore",
  "/studs/marlo-northshore/request",
  "/map",
  "/stud",
  "/stud/marlo-northshore",
  "/pet-services-map",
  "/vets",
  "/breed/french-bulldog",
  "/puppies",
  "/puppies/cedar-stone-fall-litter",
  "/puppies/cedar-stone-fall-litter/reserve",
  "/pet-services",
  "/pet-services/blue-ridge-emergency-veterinary",
  "/clubs",
  "/clubs/lone-star-french-bulldog-club",
  "/events",
  "/events/frenchie-meetup-austin",
  "/compare",
  "/compare/insurance",
  "/compare/dog-food",
  "/compare/cat-food",
  "/sponsors",
  "/breeds",
  "/breeds/french-bulldog",
  "/articles",
  "/articles/reading-a-test-date",
  "/legal/terms",
  "/legal/privacy",
  "/legal/no-delivery",
  "/checkout",
  "/checkout/pending",
  "/checkout/failed",
  "/checkout/confirmed",
  "/checkout/stud/marlo-northshore",
  "/checkout/litter/cedar-stone-fall-litter",
  "/contracts/CB-2026-1042",
  "/access-denied",
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/demo",
  "/dashboard",
  "/dashboard/animals",
  "/dashboard/animals/new/stud",
  "/dashboard/animals/new/dam",
  "/dashboard/animals/dam-sable/heat",
  "/dashboard/litters/new",
  "/dashboard/services/new",
  "/dashboard/listings",
  "/dashboard/requests",
  "/dashboard/messages",
  "/dashboard/contracts",
  "/dashboard/favorites",
  "/dashboard/billing",
  "/dashboard/settings",
  "/dashboard/business",
  "/dashboard/club",
  "/dashboard/events",
  "/dashboard/sponsorships",
  "/dashboard/reservations",
  "/clubs/new",
  "/events/new",
  "/sitemap.xml",
  "/admin",
  "/admin/verifications",
  "/admin/content",
  "/admin/users",
  "/admin/reports",
  "/admin/transactions",
  "/admin/sponsors",
  "/admin/events",
  "/robots.txt",
];

const studs = ["biscuit-harborline", "romeo-sunshine", "atlas-rocky-mountain", "gus-prairie", "winston-brickyard", "otis-circle-city", "cedar-golden-hour", "duke-salt-air", "milo-cascadia"];
const litters = ["harborline-winter-litter", "prairie-rose-working-litter", "sunshine-cream-litter"];
const pros = ["harborview-veterinary-clinic", "second-chance-rescue", "pawsitive-training-co", "the-grooming-room", "sleepy-hollow-pet-sitting", "cedar-hound-pet-supply", "lakeside-animal-hospital"];
const clubs = ["sunshine-frenchie-club", "rocky-mountain-shepherd-club"];
const events = ["frenchie-beach-walk", "rocky-mountain-handling-workshop"];
const breeds = ["labrador-retriever", "golden-retriever", "german-shepherd-dog", "boston-terrier", "english-bulldog"];
const articles = ["questions-before-a-stud-request", "one-puppy-not-the-litter"];

for (const slug of studs) routes.push(`/studs/${slug}`);
for (const slug of litters) routes.push(`/puppies/${slug}`);
for (const slug of pros) routes.push(`/pet-services/${slug}`);
for (const slug of clubs) routes.push(`/clubs/${slug}`);
for (const slug of events) routes.push(`/events/${slug}`);
for (const slug of breeds) routes.push(`/breeds/${slug}`);
for (const slug of articles) routes.push(`/articles/${slug}`);

const failures = [];
for (const route of routes) {
  const response = await fetch(`${BASE}${route}`, { redirect: "follow" });
  if (response.status !== 200) failures.push(`${route} -> ${response.status}`);
}

console.log(`${routes.length} routes checked; ${failures.length} failures`);
for (const failure of failures) console.error(`FAIL ${failure}`);
if (failures.length > 0) process.exitCode = 1;
