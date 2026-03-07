import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
