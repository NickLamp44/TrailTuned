/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    "@trailtuned/db",
    "@trailtuned/strava",
    "@trailtuned/types",
    "@trailtuned/utils",
  ],
}

export default nextConfig
