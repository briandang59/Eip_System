'use client';

import { useManageBulletinsDetails } from '@/apis/useSwr/bulletins';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Spin } from 'antd';
import { ArrowLeft, Calendar, File } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

function BulletinsDetail() {
    const params = useParams();
    const router = useRouter();
    const { lang, t } = useTranslationCustom();
    const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid || '';

    // Move hook call to the top level
    const { bulletinsDetail, isLoading: isLoadingBulletinDetail } = useManageBulletinsDetails(uuid);

    // Handle invalid UUID
    if (!uuid) {
        return <div>Invalid bulletin UUID.</div>;
    }

    // Handle loading state
    if (isLoadingBulletinDetail) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spin />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-start">
                <Button
                    icon={<ArrowLeft className="size-[14px]" />}
                    onClick={() => router.replace('/')}
                >
                    Back
                </Button>
            </div>
            <div className="flex flex-col gap-2 mx-auto p-4">
                <div className="flex flex-col justify-between gap-2 mb-4 shadow-md p-4 rounded-lg border border-gray-200 min-h-[500px] min-w-[1200px]">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 pb-4 border-b border-gray-300">
                            <h1 className="text-[24px] font-bold">
                                {getLocalizedName(
                                    bulletinsDetail?.title_en ?? '',
                                    bulletinsDetail?.title_zh ?? '',
                                    bulletinsDetail?.title_vn ?? '',
                                    lang,
                                )}
                            </h1>
                            <div className="flex items-center gap-2">
                                <Calendar className="size-[16px] !text-blue-600" />
                                <p>
                                    {bulletinsDetail?.start_date} - {bulletinsDetail?.end_date}
                                </p>
                            </div>
                        </div>
                        <p className="my-4">
                            <ReactMarkdown>
                                {getLocalizedName(
                                    bulletinsDetail?.content_en ?? '',
                                    bulletinsDetail?.content_zh ?? '',
                                    bulletinsDetail?.content_vn ?? '',
                                    lang,
                                )}
                            </ReactMarkdown>
                        </p>
                    </div>
                    <div className="flex flex-col p-2 border-t border-t-gray-200">
                        <h2 className="text-[18px] font-medium">{t.bulletins.attachments}</h2>
                        <div className="flex items-center gap-2 mt-4">
                            {bulletinsDetail?.attachments?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center w-fit gap-2 border border-green-700 p-4 rounded-lg cursor-pointer hover:bg-green-100"
                                >
                                    <File className="!text-green-700" />
                                    <p className="text-green-700">{item.file_name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BulletinsDetail;
