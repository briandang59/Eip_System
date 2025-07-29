'use client';
import { useManageBulletins } from '@/apis/useSwr/bulletins';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import BulletinUI from '@/components/ui/BulletinUI';
import { getInfomation } from '@/utils/functions/getInfomation';
import { Pagination, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';

function Home() {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [selectedWorkPlace, setSelectedWorkPlace] = useState<number>();
    const myInfo = getInfomation();
    const { workPlaces, isLoading: isLoadingWorkplaces } = useWorkPlaces();
    const { bulletins, isLoading: isLoadingBulletins } = useManageBulletins({
        pageNum: page,
        pageSize,
        work_places: selectedWorkPlace ? String(selectedWorkPlace) : undefined,
    });

    useEffect(() => {
        if (myInfo?.work_place_id) {
            setSelectedWorkPlace(myInfo.work_place_id);
        }
    }, [myInfo?.work_place_id]);
    if (isLoadingBulletins) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin />
            </div>
        );
    }
    return (
        <div>
            <div className="flex items-end gap-2">
                <Select
                    options={workPlaces?.map((item) => ({
                        label: item.name_en,
                        value: item.id,
                    }))}
                    placeholder="Select Work Place"
                    value={selectedWorkPlace}
                    onChange={(value) => setSelectedWorkPlace(value)}
                    className="w-[150px]"
                    loading={isLoadingWorkplaces}
                />
                <Pagination
                    defaultCurrent={page}
                    onChange={(value) => setPage(value)}
                    total={pageSize}
                />
            </div>
            <div className="flex items-center justify-center">
                <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                    {bulletins?.map((item) => (
                        <BulletinUI key={item.id} record={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
