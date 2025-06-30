'use client';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Forbidden</h2>
                <p className="text-gray-600 mb-8">
                    Sorry, you don&apos;t have permission to access this page.
                </p>
                <Button type="primary" onClick={() => router.push('/')} className="bg-blue-500">
                    Go to Homepage
                </Button>
            </div>
        </div>
    );
}
