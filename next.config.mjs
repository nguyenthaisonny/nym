/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // This is the correct way to set output to "export"
  images: {
    unoptimized: true, // Unoptimized images are necessary for static exports
  },
};

module.exports = nextConfig;
