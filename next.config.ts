import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'etfstore.blob.core.windows.net',
        port: '',
        pathname: '/**', // Allow any path within the hostname
      },
    ],
  },
};

export default nextConfig;
