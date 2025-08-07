import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // transpilePackages: ['handsontable', '@handsontable/react'],
    // swcMinify: false,
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Warning: This allows production builds to successfully complete even if
        // your project has TypeScript errors.
        ignoreBuildErrors: true,
    },
    async headers() {
        return [
            {
                source: '/files/:path*',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/pdf',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
