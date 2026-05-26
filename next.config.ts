import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['edge-tts'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
}

export default nextConfig
