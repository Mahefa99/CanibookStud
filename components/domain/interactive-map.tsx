"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";

export interface MapPoint {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  href: string;
  color: string;
  size: number;
  inactive?: boolean;
  sponsored?: boolean;
}
/** Local US geometry: no tile provider or exact address is sent to another service. */
export function InteractiveMap({
  points,
  compact = false,
}: {
  points: MapPoint[];
  compact?: boolean;
}) {
  const element = useRef<HTMLDivElement>(null),
    mapRef = useRef<LeafletMap | null>(null);
  const [failed, setFailed] = useState(false),
    [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const resetView = useRef<(() => void) | null>(null);
  useEffect(() => {
    let disposed = false;
    const abort = new AbortController();
    setLoaded(false);
    setFailed(false);
    void Promise.all([
      import("leaflet"),
      fetch("/maps/us-states.json", { signal: abort.signal }).then((r) => {
        if (!r.ok) throw Error("geometry");
        return r.json();
      }),
    ])
      .then(([L, geometry]) => {
        if (disposed || !element.current) return;
        const map = L.map(element.current, {
          scrollWheelZoom: false,
          minZoom: 2,
          maxZoom: 12,
        }).setView([38, -97], compact ? 3 : 4);
        mapRef.current = map;
        L.geoJSON(geometry, {
          style: {
            color: "#8AAFD2",
            weight: 1,
            fillColor: "#DCE7F3",
            fillOpacity: 0.9,
          },
        }).addTo(map);
        map.attributionControl.addAttribution(
          "US Atlas / US Census · approximate sample locations",
        );
        const group = L.featureGroup();
        for (const p of points) {
          const label = document.createElement("a");
          label.href = p.href;
          label.textContent = `${p.name} · ${p.city}${p.inactive ? " · Activate listing" : ""}`;
          const icon = L.divIcon({
            className: "marketplace-map-pin",
            html: `<span style="display:block;width:${p.size}px;height:${p.size}px;border:3px solid white;border-radius:50%;background:${/^#[0-9a-f]{6}$/i.test(p.color) ? p.color : "#002B58"};opacity:${p.inactive ? 0.5 : 1};box-shadow:0 2px 8px #002b5840"></span>`,
            iconSize: [p.size, p.size],
            iconAnchor: [p.size / 2, p.size / 2],
          });
          const marker = L.marker([p.lat, p.lng], {
            icon,
            title: `${p.name}, ${p.city}`,
            alt: `${p.name}, ${p.city}`,
            zIndexOffset: p.size === 45 ? 500 : 0,
          })
            .bindPopup(label)
            .addTo(group);
          marker.on("add", () => {
            if (p.sponsored)
              marker.getElement()?.setAttribute("data-sponsor-pin", "true");
          });
        }
        group.addTo(map);
        resetView.current = () => {
          if (points.length > 1)
            map.fitBounds(group.getBounds(), { padding: [35, 35], maxZoom: 6 });
          else if (points[0]) map.setView([points[0].lat, points[0].lng], 6);
          else map.setView([38, -97], compact ? 3 : 4);
        };
        resetView.current();
        setLoaded(true);
        map.invalidateSize();
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });
    return () => {
      disposed = true;
      abort.abort();
      mapRef.current?.remove();
      mapRef.current = null;
      resetView.current = null;
    };
  }, [points, compact, attempt]);
  return (
    <figure>
      <div className="relative isolate overflow-hidden rounded-2xl border border-line bg-[#EDF3F9]">
        <div
          ref={element}
          role="region"
          aria-label="Interactive US marketplace map. Use plus and minus to zoom and arrow keys to pan."
          className={compact ? "h-72 w-full" : "h-[420px] w-full"}
        />
        {!loaded ? (
          <div
            role="status"
            className="absolute left-3 top-3 z-[500] rounded-lg bg-white p-3 text-sm"
          >
            {failed
              ? "Map unavailable. Use the listing links below."
              : "Loading interactive map…"}
            {failed ? (
              <button
                type="button"
                className="ml-3 underline"
                onClick={() => setAttempt((value) => value + 1)}
              >
                Retry map
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      {loaded ? (
        <button
          type="button"
          className="mt-2 min-h-11 rounded-full border border-line bg-white px-4 text-xs font-semibold hover:bg-cream-100"
          onClick={() => resetView.current?.()}
        >
          Show all map listings
        </button>
      ) : null}
      <figcaption className="mt-3 text-xs text-muted">
        Approximate city locations only. Zoom with + / −, drag to pan or open a
        marker. No street address or exact animal GPS is displayed.
      </figcaption>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-semibold">
          Accessible map listings ({points.length})
        </summary>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {points.map((p) => (
            <li key={p.id}>
              <a className="underline" href={p.href}>
                {p.name} · {p.city}
                {p.inactive ? " · Activate listing" : ""}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </figure>
  );
}
