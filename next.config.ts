import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera .next/standalone — o Dockerfile copia só isso pra imagem final.
  output: "standalone",
};

export default nextConfig;
