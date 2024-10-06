/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("_http_common");
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/internals"],
  },
};

export default nextConfig;
