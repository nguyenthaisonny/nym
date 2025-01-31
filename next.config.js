/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Unoptimized images are necessary for static exports
  },
};

module.exports = nextConfig;

