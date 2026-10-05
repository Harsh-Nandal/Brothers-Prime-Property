/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  // Vercel deployment
  output: 'export',
  trailingSlash: true,

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },

  // three.js
  transpilePackages: ['three'],
};

export default nextConfig;