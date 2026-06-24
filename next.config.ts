import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'logo.clearbit.com' },
    ],
  },
}

export default nextConfig
