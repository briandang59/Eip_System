'use client';

import { useState, useEffect } from 'react';
import { Button, Spin, message } from 'antd';
import { RefreshCw, Download, Eye, FileText } from 'lucide-react';

interface PdfViewerProps {
    url?: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
    const defaultUrl = '/files/blank.pdf';
    const src = url || defaultUrl;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        setLoading(true);
        setError(false);
    }, [src]);

    const handleLoad = () => {
        setLoading(false);
        setError(false);
    };

    const handleError = () => {
        setLoading(false);
        setError(true);
        message.error('Không thể tải PDF. Vui lòng thử lại.');
    };

    const handleRefresh = () => {
        setKey((prev) => prev + 1);
        setLoading(true);
        setError(false);
    };

    const handleForceReload = () => {
        // Force reload bằng cách thêm timestamp
        const currentUrl = new URL(src, window.location.origin);
        currentUrl.searchParams.set('t', Date.now().toString());
        window.location.href = currentUrl.toString();
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = src;
        link.download = 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleView = () => {
        window.open(src, '_blank');
    };

    const handleViewWithGoogleDocs = () => {
        const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + src)}&embedded=true`;
        window.open(googleDocsUrl, '_blank');
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
                <div className="text-red-500 mb-4 text-center">
                    <div className="text-lg font-medium mb-2">Không thể mở file</div>
                    <div className="text-sm text-gray-600">Có lỗi xảy ra khi tải PDF</div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                        icon={<RefreshCw className="w-4 h-4" />}
                        onClick={handleRefresh}
                        type="primary"
                    >
                        Thử lại
                    </Button>
                    <Button
                        icon={<RefreshCw className="w-4 h-4" />}
                        onClick={handleForceReload}
                        danger
                    >
                        Force Reload
                    </Button>
                    <Button icon={<Download className="w-4 h-4" />} onClick={handleDownload}>
                        Tải xuống
                    </Button>
                    <Button icon={<Eye className="w-4 h-4" />} onClick={handleView}>
                        Mở trong tab mới
                    </Button>
                    <Button
                        icon={<FileText className="w-4 h-4" />}
                        onClick={handleViewWithGoogleDocs}
                    >
                        Xem với Google Docs
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-white border rounded-lg overflow-hidden">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <Spin size="large" />
                </div>
            )}

            {/* Try multiple approaches to display PDF */}
            <div className="relative">
                {/* Approach 1: Object tag */}
                <object
                    key={`object-${key}`}
                    data={src}
                    type="application/pdf"
                    width="100%"
                    height="800px"
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{ display: loading ? 'none' : 'block' }}
                >
                    {/* Fallback content */}
                    <div className="flex flex-col items-center justify-center h-96 bg-gray-50">
                        <div className="text-gray-600 mb-4 text-center">
                            <div className="text-lg font-medium mb-2">Không thể hiển thị PDF</div>
                            <div className="text-sm">
                                Trình duyệt của bạn không hỗ trợ xem PDF trực tiếp
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Button
                                icon={<Download className="w-4 h-4" />}
                                onClick={handleDownload}
                                type="primary"
                            >
                                Tải xuống PDF
                            </Button>
                            <Button icon={<Eye className="w-4 h-4" />} onClick={handleView}>
                                Mở trong tab mới
                            </Button>
                            <Button
                                icon={<FileText className="w-4 h-4" />}
                                onClick={handleViewWithGoogleDocs}
                            >
                                Xem với Google Docs
                            </Button>
                        </div>
                    </div>
                </object>

                {/* Approach 2: Iframe as backup */}
                <iframe
                    key={`iframe-${key}`}
                    src={src}
                    width="100%"
                    height="800px"
                    style={{
                        border: 'none',
                        display: loading ? 'none' : 'none', // Hidden by default, can be enabled if needed
                    }}
                    onLoad={handleLoad}
                    onError={handleError}
                />
            </div>
        </div>
    );
}
