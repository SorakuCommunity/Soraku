import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  async redirects() {
    return [
      { source: '/ecosystem', destination: '/about', permanent: true },
      { source: '/resources', destination: '/docs/resources', permanent: true },
    ]
  },

  async rewrites() {
    return [
      // Public User Profile: /@username -> internal /u/[username]
      { source: '/@:username', destination: '/u/:username' },
    ]
  },

  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'media.discordapp.net' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'freeimage.host' },
      { protocol: 'https', hostname: 'iili.io' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'imgur.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },

  serverExternalPackages: ['postgres', 'drizzle-orm'],

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withMDX(nextConfig as any)
