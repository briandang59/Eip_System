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
    title: 'EIP System',
    icons: {
        icon: '/images/favicon.png',
        shortcut: '/images/favicon.png',
        apple: '/images/favicon.png',
    },
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
                    <Toaster position="top-center" richColors />
                    <AntdProvider>
                        <AuthLayout>{children}</AuthLayout>
                    </AntdProvider>
                </ClientOnly>
            </body>
        </html>
    );
}
