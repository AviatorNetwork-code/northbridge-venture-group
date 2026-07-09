/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@northbridge/conversation-state"],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
    };
    return config;
  },
  async redirects() {
    return [
      {
        source: "/digital",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
