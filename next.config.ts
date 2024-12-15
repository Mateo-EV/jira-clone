import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: "all"
    }
  },
  serverExternalPackages: ["@node-rs/argon2"]
}

export default nextConfig
