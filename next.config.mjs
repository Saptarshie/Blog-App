/** @type {import('next').NextConfig} */
// const nextConfig = {};
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'n2g9pcp2-3000.inc1.devtunnels.ms'],
    },
  },
  images: {
    domains: ['localhost','res.cloudinary.com'], 
  },
  // Ensure public directory is properly served
  assetPrefix: '',
  // Add webpack configuration here
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'cloudinary' module on the client side
      config.resolve.fallback = { 
        ...config.resolve.fallback,
        cloudinary: false 
      };
    }
    return config;
  },
};

export default nextConfig;
