import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import statesTopology from "us-atlas/states-10m.json";
import type { FeatureCollection, Geometry } from "geojson";

/**
 * Shared schematic US geometry. No tile provider is involved, so the preview
 * does not send a visitor IP to a map vendor.
 */
export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 470;

interface MapGeometry {
  statePaths: string;
  project: (coordinates: [number, number]) => [number, number] | null;
}

let cachedGeometry: MapGeometry | null = null;

export function getUsMapGeometry(): MapGeometry {
  if (cachedGeometry) return cachedGeometry;

  const topology = statesTopology as unknown as { objects: { states: unknown } };
  const states = feature(
    topology as never,
    topology.objects.states as never,
  ) as unknown as FeatureCollection<Geometry, { name?: string }>;

  const projection = geoAlbersUsa().fitSize([MAP_WIDTH, MAP_HEIGHT], states);
  const path = geoPath(projection);

  cachedGeometry = {
    statePaths: path(states) ?? "",
    project: (coordinates) => {
      const point = projection(coordinates);
      return point ? [point[0], point[1]] : null;
    },
  };
  return cachedGeometry;
}
