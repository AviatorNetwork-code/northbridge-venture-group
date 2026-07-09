/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@northbridge/adaptive-cards",
    "@northbridge/assistant-cards",
    "@northbridge/assistant-contracts",
    "@northbridge/context-actions",
    "@northbridge/conversation-engine",
    "@northbridge/conversation-state",
    "@northbridge/core-conversation",
    "@northbridge/interaction-engine",
    "@northbridge/interaction-standards",
    "@northbridge/platform-ai",
    "@northbridge/presentation-policy",
    "@northbridge/progressive-forms",
  ],
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
      {
        source: "/ventures",
        destination: "/portfolio",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
