'use client';
import { useAttendanceV2 } from '@/apis/useSwr/attendance';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { GenericTable } from '@/components/common/GenericTable';
import { getInfomation } from '@/utils/functions/getInfomation';
import { StatisticalWorkdayType } from '@/types/response/attendance';
import { useStatisticalWorkdayCols } from '@/utils/constants/cols/statisticalWorkdayCols';
import { DatePicker, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

function StatisticalWorkday() {
    const { workPlaces, isLoading: isLoadingWorkPlaces } = useWorkPlaces();
    const workdayCols = useStatisticalWorkdayCols();
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs().startOf('month'));
    const myInfo = getInfomation();
    const { t } = useTranslationCustom();
    const [selectWorkPlace, setSelectWorkPlace] = useState<number | null>(
        myInfo?.work_place?.id || null,
    );
    const [dateRange, setDateRange] = useState<{ start: Dayjs; end: Dayjs }>({
        start: dayjs().startOf('month'),
        end: dayjs().endOf('month'),
    });
    const {
        statisticalWorkday,
        isError,
        isLoading: isLoadingAttendance,
    } = useAttendanceV2(
        {
            start: dateRange.start.format('YYYY-MM-DD') || '',
            end: dateRange.end.format('YYYY-MM-DD') || '',
            work_place_id: selectWorkPlace || undefined,
        },
        {
            year: selectedMonth.year(),
            month: selectedMonth.month() + 1,
        },
    );
    if (isError) {
        return <div className="text-red-500 text-center">{t.statistical.error}</div>;
    }
    const handleChangeMonth = (value: Dayjs) => {
        setSelectedMonth(value);
        setDateRange({
            start: value.startOf('month'),
            end: value.endOf('month'),
        });
    };

    const onChangeWorkPlace = (value: number) => {
        setSelectWorkPlace(value);
    };
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Select
                    options={workPlaces?.map((item) => ({
                        label: item.name_en,
                        value: item.id,
                    }))}
                    style={{ width: '150px' }}
                    value={selectWorkPlace}
                    onChange={onChangeWorkPlace}
                    loading={isLoadingWorkPlaces}
                />
                <DatePicker value={selectedMonth} onChange={handleChangeMonth} picker="month" />
            </div>
            <GenericTable<StatisticalWorkdayType>
                columns={workdayCols}
                dataSource={statisticalWorkday || []}
                rowKey="stt"
                isLoading={isLoadingAttendance}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: 'default',
                }}
            />
        </div>
    );
}

export default StatisticalWorkday;
