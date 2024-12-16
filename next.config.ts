import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: "all"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/*"
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/*"
      }
    ]
  },
  serverExternalPackages: ["@node-rs/argon2"]
}

export default nextConfig
