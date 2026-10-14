import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pinapayagan ang dev server na ma-access gamit ang network IP mo
  // (hal. buksan sa phone o ibang device sa parehong WiFi).
  allowedDevOrigins: ["192.168.1.138", "192.168.100.5"],

  // Binawasan ang bilang ng parallel workers habang nagbi-build.
  experimental: {
    cpus: 2,
  },

  // HUWAG i-bundle ang firebase-admin — malaki ang dependencies nito
  // (grpc, protobufjs, atbp.) kaya kapag sinusubukan itong i-bundle ng
  // Next.js, umuubos ito ng napakalaking memory habang nagbi-build,
  // kaya nagdudulot ng OOM crash (ito ang nahanap nating tunay na
  // dahilan, dahil nangyari rin ito kahit sa Vercel cloud). Sa halip,
  // direktang gagamitin ito mula sa node_modules sa runtime, walang
  // bundling.
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;