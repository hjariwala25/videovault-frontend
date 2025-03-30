import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
    // Alternatively, you can use remotePatterns for more control
    // remotePatterns: [
    //   {
    //     protocol: 'http',
    //     hostname: 'res.cloudinary.com',
    //     port: '',
    //     pathname: '/dj3jx05g0/image/upload/**',
    //   },
    // ],
  },
};

export default nextConfig;
