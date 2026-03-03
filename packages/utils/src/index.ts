import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// ─── Tailwind class merger ────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date / Time formatting ───────────────────────────────────────────────────

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`
}

export function formatSpeed(kmh: number): string {
  return `${kmh.toFixed(1)} km/h`
}

export function formatElevation(meters: number): string {
  return `${Math.round(meters)} m`
}

// ─── Strava polyline decoder ──────────────────────────────────────────────────
// Pure algorithm — works identically in web (Leaflet) and native (react-native-maps)

export function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let result = 0
    let shift = 0
    let byte = 0

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const dlat = result & 1 ? ~(result >> 1) : result >> 1
    lat += dlat

    result = 0
    shift = 0

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const dlng = result & 1 ? ~(result >> 1) : result >> 1
    lng += dlng

    points.push([lat / 1e5, lng / 1e5])
  }

  return points
}
