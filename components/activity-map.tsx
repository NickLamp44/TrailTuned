"use client";

import { useEffect, useRef } from "react";

interface ActivityMapProps {
  polyline: string;
  height?: string;
}

function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0,
    lat = 0,
    lng = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    result = 0;
    shift = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

export function ActivityMap({ polyline, height = "h-64" }: ActivityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!polyline || !mapRef.current) {
      return;
    }
    import("leaflet").then((L) => {
      try {
        const points = decodePolyline(polyline);

        if (points.length === 0) {
          return;
        }

      
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        
        const mapContainer = mapRef.current;
        if (!mapContainer) return;

        const map = L.map(mapContainer, {
          zoomControl: true,
          attributionControl: false,
        });
        mapInstanceRef.current = map;
        L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
          maxZoom: 17,
          minZoom: 2,
          attribution:
            "Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap",
        }).addTo(map);

        // polyline route
        const polylineLayer = L.polyline(points, {
          color: "#ea580c",
          weight: 3,
          opacity: 0.8,
        }).addTo(map);

        // start marker 
        L.circleMarker(points[0], {
          radius: 8,
          fillColor: "#22c55e",
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);

        // end marker 
        L.circleMarker(points[points.length - 1], {
          radius: 8,
          fillColor: "#ef4444",
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);

        
        map.fitBounds(polylineLayer.getBounds(), {
          padding: [20, 20],
        });
      } catch (error) {
        console.error("Error rendering map:", error);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [polyline]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <style>{`
        .activity-map .leaflet-tile-pane {
          filter: grayscale(100%) brightness(1.1) contrast(1.05);
        }
      `}</style>
      <div
        ref={mapRef}
        className={`w-full ${height} rounded-lg overflow-hidden activity-map`}
        style={{
          background: "#e5e7eb",
        }}
      />
    </>
  );
}
