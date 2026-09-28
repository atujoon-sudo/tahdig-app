import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // production: add the Shopify CDN host here (e.g. { protocol: 'https', hostname: 'cdn.shopify.com' })
    remotePatterns: [],
  },
};

export default nextConfig;
