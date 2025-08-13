'use client';
import { useManageBulletins, useManageBulletinsSelf } from '@/apis/useSwr/bulletins';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import BulletinUI from '@/components/ui/BulletinUI';
import { useFactoryStore } from '@/stores/useFactoryStore';
import { useTranslationCustom } from '@/utils/hooks';
import { getInfomation } from '@/utils/functions/getInfomation';
import { Pagination, Select, Spin, Tabs } from 'antd';
import { useState } from 'react';
import { Newspaper, User } from 'lucide-react';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';

function Home() {
    const { t, lang } = useTranslationCustom();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const { selectedFactoryId, setSelectedFactoryId } = useFactoryStore();
    const myInfo = getInfomation();
    const selectedWorkPlace = selectedFactoryId || myInfo?.work_place_id || 0;
    const { filterWorkPlaces, isLoading: isLoadingWorkplaces } = useWorkPlaces();
    const { bulletins, isLoading: isLoadingBulletins } = useManageBulletins({
        pageNum: page,
        pageSize,
        work_places: selectedWorkPlace ? `[${selectedWorkPlace}]` : undefined,
    });
    const { bulletinsSelf, isLoading: isLoadingBulletinsSelf } = useManageBulletinsSelf(
        myInfo?.card_number || '',
    );
    if (isLoadingBulletins || isLoadingBulletinsSelf) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin />
            </div>
        );
    }
    const tabs = [
        {
            key: '1',
            label: t.bulletins.general,
            children: (
                <>
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                            {bulletins?.map((item) => (
                                <BulletinUI key={item.id} record={item} />
                            ))}
                        </div>
                    </div>
                </>
            ),
            icon: <Newspaper strokeWidth={1.5} />,
        },
        {
            key: '2',
            label: t.bulletins.self,
            children: (
                <>
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                            {bulletinsSelf?.map((item) => (
                                <BulletinUI key={item.id} record={item} />
                            ))}
                        </div>
                    </div>
                </>
            ),
            icon: <User strokeWidth={1.5} />,
        },
    ];
    return (
        <div className="flex flex-col gap-4">
            <div className="sticky top-[100px] z-[50] bg-white p-2">
                <div className="flex items-end gap-2">
                    <Select
                        options={filterWorkPlaces?.map((item) => ({
                            label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                            value: item.id,
                        }))}
                        placeholder="Select Work Place"
                        value={selectedWorkPlace}
                        onChange={(value) => setSelectedFactoryId(value)}
                        className="w-[150px]"
                        loading={isLoadingWorkplaces}
                    />
                    <Pagination
                        defaultCurrent={page}
                        onChange={(value) => setPage(value)}
                        total={pageSize}
                        simple
                    />
                </div>
            </div>
            <Tabs defaultActiveKey="1" items={tabs} centered />
        </div>
    );
}
export default Home;
