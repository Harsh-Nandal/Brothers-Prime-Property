/** @type {import('next').NextConfig} */
const repoName = 'brothers-prime';

const nextConfig = {
  reactStrictMode: true,

  // GitHub Pages static deployment
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : undefined,
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repoName}/` : undefined,

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },

  // three.js ships ESM that Next should transpile for the client bundle
  transpilePackages: ['three'],
};

export default nextConfig;