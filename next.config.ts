import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable modern image formats for better compression
  images: {
    formats: ["image/avif", "image/webp"],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  outputFileTracingIncludes: {
    "/blog": ["./content/blog/**/*"],
    "/blog/[slug]": ["./content/blog/**/*"],
  },
  async redirects() {
    return [
      {
        source: '/product/ampenterprise',
        destination: '/product',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
