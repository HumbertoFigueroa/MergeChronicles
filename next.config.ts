import type {NextConfig} from 'next';
import withPWA from '@ducanh2912/next-pwa';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // This allows the Next.js dev server to accept requests from the
  // Firebase Studio environment.
  allowedDevOrigins: [
    '6000-firebase-studio-1758335378879.cluster-c72u3gwiofapkvxrcwjq5zllcu.cloudworkstations.dev',
  ],
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Disabling in dev is the default, but we're enabling it to allow testing
  // in the Studio environment.
  disable: false, // process.env.NODE_ENV === 'development',
});

export default pwaConfig(nextConfig);
