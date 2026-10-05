/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // three.js ships ESM that Next should transpile for the client bundle
  transpilePackages: ['three'],
};

export default nextConfig;
