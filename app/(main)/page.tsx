'use client';
import { useManageBulletins, useManageBulletinsSelf } from '@/apis/useSwr/bulletins';
import BulletinUI from '@/components/ui/BulletinUI';
import { useFactoryStore } from '@/stores/useFactoryStore';
import { useTranslationCustom } from '@/utils/hooks';
import { getInfomation } from '@/utils/functions/getInfomation';
import { Pagination, Spin, Tabs } from 'antd';
import { useState } from 'react';
import { Newspaper, User, UsersRound } from 'lucide-react';

function Home() {
    const { t } = useTranslationCustom();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const { selectedFactoryId } = useFactoryStore();
    const myInfo = getInfomation();
    const selectedWorkPlace = selectedFactoryId || myInfo?.work_place_id || 0;
    const { bulletins: bulletinsGeneral, isLoading: isLoadingBulletinGeneral } = useManageBulletins(
        {
            pageNum: page,
            pageSize,
            work_places: selectedWorkPlace ? `[${selectedWorkPlace}]` : undefined,
        },
    );

    const { bulletins: bulletinsDepartment, isLoading: isLoadingBulletinDepartment } =
        useManageBulletins({
            pageNum: page,
            pageSize,
            work_places: selectedWorkPlace ? `[${selectedWorkPlace}]` : undefined,
            cardNumber: myInfo?.card_number, // ✅ chỉ tab2 dùng
        });

    const { bulletinsSelf, isLoading: isLoadingBulletinsSelf } = useManageBulletinsSelf(
        myInfo?.card_number || '',
    );
    if (isLoadingBulletinGeneral || isLoadingBulletinDepartment || isLoadingBulletinsSelf) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin />
            </div>
        );
    }
    //a
    const tabs = [
        {
            key: '1',
            label: t.bulletins.general,
            children: (
                <>
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                            {bulletinsGeneral?.map((item) => (
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
            label: t.bulletins.department,
            children: (
                <>
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                            {bulletinsDepartment?.map((item) => (
                                <BulletinUI key={item.id} record={item} />
                            ))}
                        </div>
                    </div>
                </>
            ),
            icon: <UsersRound strokeWidth={1.5} />,
        },
        {
            key: '3',
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
