import "server-only";

export type CityCenter = { lat: number; lng: number };

/** Accept a public city centroid. Persist the result once when creating the listing. */
export function createPublicLocation({ lat, lng }: CityCenter): CityCenter {
  // Reject centroids whose offset envelope would cross the coordinate bounds.
  if (!Number.isFinite(lat) || Math.abs(lat) > 89.98 ||
      !Number.isFinite(lng) || Math.abs(lng) > 179.98) {
    throw new RangeError("City center is outside the supported map bounds.");
  }
  return {
    lat: lat + (Math.random() - 0.5) * 0.04,
    lng: lng + (Math.random() - 0.5) * 0.04,
  };
}
