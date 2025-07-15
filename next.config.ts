import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com',  // Google 프로필 이미지
      'avatars.githubusercontent.com'  // GitHub 프로필 이미지
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  }
};

export default nextConfig;
