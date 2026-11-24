"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "@/components/domain/interactive-map";
const LeafletMap = dynamic(() => import("@/components/domain/interactive-map").then(module => module.InteractiveMap), {
  ssr: false, loading: () => <p role="status">Loading map…</p>,
});
export function MapWrapper({ points, compact }: { points: MapPoint[]; compact?: boolean }) {
  return <LeafletMap points={points} compact={compact} />;
}
