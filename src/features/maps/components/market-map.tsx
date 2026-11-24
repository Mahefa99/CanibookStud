import { MapWrapper } from "./MapWrapper";
import type { Database } from "@/src/types/database";
type Pin = Pick<Database["public"]["Tables"]["studs"]["Row"], "id" | "name" | "breed" | "lat" | "lng">;

export function MarketMap({ studs }: { studs: Pin[] }) {
  return <MapWrapper points={studs.map(stud => ({
    id: stud.id, name: stud.name, city: stud.breed, lat: stud.lat, lng: stud.lng,
    href: "/studs/" + stud.id, color: "#002B58", size: 32,
  }))} />;
}
