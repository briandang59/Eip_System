import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../../app/globals.css';
import AuthLayout from '@/components/layouts/AuthLayout';
import ClientOnly from '@/components/common/ClientOnly';
import { Toaster } from 'sonner';
import AntdProvider from '@/components/common/AntdProvider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        template: '%s | EIP System',
        default: 'EIP System',
    },
    description: 'Enterprise Information Portal System',
    icons: {
        icon: [{ url: '/assets/svgs/logo.svg', type: 'image/svg+xml' }],
        shortcut: [{ url: '/assets/svgs/logo.svg', type: 'image/svg+xml' }],
        apple: [{ url: '/assets/svgs/logo.svg', type: 'image/svg+xml' }],
        other: [
            {
                rel: 'mask-icon',
                url: '/assets/svgs/logo.svg',
            },
        ],
    },
    manifest: '/manifest.json',
    applicationName: 'EIP System',
    keywords: ['EIP', 'Portal', 'Enterprise'],
    authors: [{ name: 'Your Company Name' }],
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function AuthLayoutComponent({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ClientOnly>
                    <Toaster position="top-right" richColors />
                    <AntdProvider>
                        <AuthLayout>{children}</AuthLayout>
                    </AntdProvider>
                </ClientOnly>
            </body>
        </html>
    );
}
