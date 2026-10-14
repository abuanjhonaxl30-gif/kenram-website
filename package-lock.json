import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pinapayagan ang dev server na ma-access gamit ang network IP mo
  // (hal. buksan sa phone o ibang device sa parehong WiFi).
  allowedDevOrigins: ["192.168.1.138", "192.168.100.5"],

  experimental: {
    // Opisyal na Next.js memory optimization para sa Webpack builds —
    // binabawasan ang peak memory usage habang nagbi-build, kahit
    // medyo bumagal nang kaunti. Ito ang susunod nating susubukan
    // para sa paulit-ulit na OOM crash habang nagbi-build.
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;