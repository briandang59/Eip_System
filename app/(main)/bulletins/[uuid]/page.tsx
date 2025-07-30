'use client';

import { useManageBulletinsDetails } from '@/apis/useSwr/bulletins';
import BulletinsDetailUI from '@/components/ui/BulletinsDetailUI';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Spin } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

function BulletinsDetail() {
    const params = useParams();
    const router = useRouter();
    const { t } = useTranslationCustom();
    const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid || '';

    const { bulletinsDetail, isLoading: isLoadingBulletinDetail } = useManageBulletinsDetails(uuid);

    if (!uuid) {
        return <div>Invalid bulletin UUID.</div>;
    }

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
                    {t.bulletins.back}
                </Button>
            </div>
            <div className="flex flex-col gap-2 mx-auto p-4">
                {bulletinsDetail && <BulletinsDetailUI bulletinsDetail={bulletinsDetail} />}
            </div>
        </div>
    );
}

export default BulletinsDetail;
