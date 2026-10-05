import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'canvas-confetti', '@monaco-editor/react'],
  },
};

export default nextConfig;
