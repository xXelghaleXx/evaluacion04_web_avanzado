import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Actualizado para Next.js 15
  serverExternalPackages: ["pg", "pg-hstore"],
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.externals.push("pg", "pg-hstore");
    }
    return config;
  },
  // Configuración para Vercel
  output: 'standalone',
  // Optimizaciones para producción
  images: {
    domains: [],
    dangerouslyAllowSVG: true,
  },
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
