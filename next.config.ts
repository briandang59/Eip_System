import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // transpilePackages: ['handsontable', '@handsontable/react'],
    // swcMinify: false,
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
