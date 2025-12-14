/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['cdn.brandfetch.io'],
  },
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // Fix for clsx bundling issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Optimize clsx bundling
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/](clsx|class-variance-authority)[\\/]/,
            name: 'vendor-clsx',
            chunks: 'all',
          },
        },
      },
    };

    return config;
  },
}

module.exports = nextConfig
