/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "antd",
    "@ant-design/icons",
    "rc-util",
    "rc-table",
    "rc-pagination",
    "rc-select",
    "rc-menu",
    "rc-dropdown",
  ],
  // Add Turbopack configuration to silence the warning
  turbopack: {
    // Empty config is fine for now
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
