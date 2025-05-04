/** @type {import('next').NextConfig} */
const nextConfig = {
  // skip ESLint errors when running `next build`
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;