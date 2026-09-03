import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
  // The floating "N" dev-tools badge only ever shows in local `next dev` —
  // real visitors and production builds never see it — but it's a
  // distraction while working, so turn it off.
  devIndicators: false,
};

export default nextConfig;