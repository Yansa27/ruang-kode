import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    optimizePackageImports: ['lucide-react', 'canvas-confetti', '@monaco-editor/react'],
  },
};

export default nextConfig;
