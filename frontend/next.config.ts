import type { NextConfig } from "next";

const mediaUrl = process.env.PROPERTY_MEDIA_URL ? new URL(process.env.PROPERTY_MEDIA_URL) : null;
const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    remotePatterns: [
      ...(mediaUrl ? [{ protocol: mediaUrl.protocol.slice(0, -1) as 'https' | 'http', hostname: mediaUrl.hostname, port: mediaUrl.port, pathname: `${mediaUrl.pathname.replace(/\/+$/, '')}/**` }] : []),
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.up.railway.app',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },
};

export default nextConfig;
