/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["idealtech.com.my", "img.clerk.com"],
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
};

const millionConfig = {
  auto: true, // if you're using RSC: auto: { rsc: true },
  rsc: true,
};

export default nextConfig;

// export default million.next(nextConfig, millionConfig);
