import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pinapayagan ang dev server na ma-access gamit ang network IP mo
  // (hal. buksan sa phone o ibang device sa parehong WiFi).
  allowedDevOrigins: ["192.168.1.138", "192.168.100.5"],
};

export default nextConfig;