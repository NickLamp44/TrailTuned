"use client";

import { useEffect, useState } from "react";

interface ActivityMapProps {
  polyline: string;
  height?: string;
}

// Decode Strava polyline encoding
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

// Calculate bounds from points
function calculateBounds(points: [number, number][]) {
  let minLat = points[0][0],
    maxLat = points[0][0];
  let minLng = points[0][1],
    maxLng = points[0][1];

  for (const [lat, lng] of points) {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }

  return { minLat, maxLat, minLng, maxLng };
}

// Project lat/lng to SVG coordinates
function projectPoint(
  lat: number,
  lng: number,
  bounds: ReturnType<typeof calculateBounds>,
  width: number,
  height: number
) {
  const padding = 40;
  const x =
    ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) *
      (width - padding * 2) +
    padding;
  const y =
    height -
    (((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) *
      (height - padding * 2) +
      padding);
  return { x, y };
}

export function ActivityMap({ polyline, height = "h-64" }: ActivityMapProps) {
  const [pathData, setPathData] = useState<string>("");
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (!polyline) return;

    const width = 500;
    const heightPx = 250;

    try {
      const points = decodePolyline(polyline);
      if (points.length === 0) return;

      const bounds = calculateBounds(points);

      // Create SVG path
      const pathPoints = points.map((point) => {
        const { x, y } = projectPoint(
          point[0],
          point[1],
          bounds,
          width,
          heightPx
        );
        return `${x},${y}`;
      });

      setPathData(pathPoints.join(" L "));

      // Set start and end points
      const startProjected = projectPoint(
        points[0][0],
        points[0][1],
        bounds,
        width,
        heightPx
      );
      const endProjected = projectPoint(
        points[points.length - 1][0],
        points[points.length - 1][1],
        bounds,
        width,
        heightPx
      );

      setStartPoint(startProjected);
      setEndPoint(endProjected);
    } catch (error) {
      console.error("Error decoding polyline:", error);
    }
  }, [polyline]);

  const heightClass = height || "h-64";

  return (
    <div
      className={`w-full ${heightClass} bg-muted rounded-lg flex items-center justify-center overflow-hidden`}
    >
      <svg
        viewBox="0 0 500 250"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect width="500" height="250" fill="hsl(var(--muted))" />

        {/* Route polyline */}
        {pathData && (
          <polyline
            points={pathData}
            fill="none"
            stroke="#ea580c"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        )}

        {/* Start marker (green) */}
        {startPoint && (
          <g>
            <circle
              cx={startPoint.x}
              cy={startPoint.y}
              r="5"
              fill="#22c55e"
              stroke="white"
              strokeWidth="2"
            />
            <circle
              cx={startPoint.x}
              cy={startPoint.y}
              r="8"
              fill="none"
              stroke="#22c55e"
              strokeWidth="1"
              opacity="0.5"
            />
          </g>
        )}

        {/* End marker (red) */}
        {endPoint && (
          <g>
            <circle
              cx={endPoint.x}
              cy={endPoint.y}
              r="5"
              fill="#ef4444"
              stroke="white"
              strokeWidth="2"
            />
            <circle
              cx={endPoint.x}
              cy={endPoint.y}
              r="8"
              fill="none"
              stroke="#ef4444"
              strokeWidth="1"
              opacity="0.5"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
