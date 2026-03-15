import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Set root to project root to avoid workspace inference issues
  },
  // Ensure we can handle the subfolder deployment
  distDir: ".next",
};

export default nextConfig;


