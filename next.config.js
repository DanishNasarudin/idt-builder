/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
    // serverActions: true,
  },
  images: {
    domains: ["idealtech.com.my"],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
  // api: {
  //   bodyParser: {
  //     sizeLimit: "10mb",
  //   },
  //   responseLimit: "10mb",
  // },
  // output: {
  //   globalObject: `typeof self !== 'undefined' ? self : this`,
  // },
};

module.exports = nextConfig;
