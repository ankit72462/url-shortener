import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    // Strip trailing slash if present
    const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    return [
      {
        source: '/api/:path*',
        destination: `${cleanApiUrl}/api/:path*`
      }
    ]
  },
  async headers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://adservice.google.com https://www.googletagservices.com https://partner.googleadservices.com https://tpc.googlesyndication.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://pagead2.googlesyndication.com https://www.google.com https://www.gstatic.com https://googleads.g.doubleclick.net",
              "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com",
              `connect-src 'self' ${apiUrl} https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net`,
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
