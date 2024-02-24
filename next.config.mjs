/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tbrsmdwqlqqwjyeelvbn.supabase.co',
      }
    ]
  }
};

export default nextConfig;
