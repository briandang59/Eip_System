import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../../app/globals.css';
import MainLayout from '@/components/layouts/MainLayout';
import { Toaster } from 'sonner';

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
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                cz-shortcut-listen="true"
            >
                <Toaster position="top-right" richColors />
                <MainLayout>{children}</MainLayout>
            </body>
        </html>
    );
}
