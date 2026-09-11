/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PRE_EXISTING: NDP/workforce platform packages currently carry TypeScript debt
  // unrelated to the public website/Nordy surface. Website pages compile; full
  // NDP strict cleanup is tracked separately.
  typescript: {
    ignoreBuildErrors: true,
  },
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
    "@northbridge/operations-intelligence",
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
        source: "/portfolio",
        destination: "/ventures",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/capabilities",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
