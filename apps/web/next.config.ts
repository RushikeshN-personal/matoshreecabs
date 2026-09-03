import type { NextConfig } from "next";
import path from "path";

// Backend origin to proxy /api/* to. Set BACKEND_ORIGIN on Vercel to the
// Render URL (e.g. https://matoshreecabs.onrender.com). Locally it falls
// back to the dev identity service. Proxying keeps API calls same-origin,
// so the browser never does a cross-origin (CORS) request.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN ?? "http://localhost:4001";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
    ];
  },
  // The floating "N" dev-tools badge only ever shows in local `next dev` —
  // real visitors and production builds never see it — but it's a
  // distraction while working, so turn it off.
  devIndicators: false,
};

export default nextConfig;