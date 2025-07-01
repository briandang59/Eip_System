import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Cú pháp mới cho Turbopack (thay vì experimental.turbo)
    turbopack: {
        resolveAlias: {
            '@': './',
        },
    },
};

export default nextConfig;
