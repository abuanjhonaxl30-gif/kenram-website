import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pinapayagan ang dev server na ma-access gamit ang network IP mo
  // (hal. buksan sa phone o ibang device sa parehong WiFi).
  // Kung magbago ulit ang IP ng laptop mo (lalo na sa ibang WiFi),
  // i-check ang "Network:" na linya sa terminal pagkatapos ng
  // `npm run dev` at idagdag dito kung wala pa.
  allowedDevOrigins: ["192.168.1.138", "192.168.100.5"],

  // Binawasan ang bilang ng parallel workers habang nagbi-build
  // (default ay kasing dami ng CPU cores mo, 7 sa makina mo). Mas
  // kaunting workers = mas mababang peak memory usage, kahit medyo
  // mas matagal ang build.
  experimental: {
    cpus: 2,
  },
};

export default nextConfig;