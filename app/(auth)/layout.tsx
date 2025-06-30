import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../../app/globals.css';
import AuthLayout from '@/components/layouts/AuthLayout';
import ClientOnly from '@/components/common/ClientOnly';
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
    title: 'Login',
    description: 'Login to your account',
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
                    <AuthLayout>{children}</AuthLayout>
                </ClientOnly>
            </body>
        </html>
    );
}
