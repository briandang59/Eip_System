'use client';
import { useAttendanceV2 } from '@/apis/useSwr/attendance';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { GenericTable } from '@/components/common/GenericTable';
import { getInfomation } from '@/utils/functions/getInfomation';
import { StatisticalWorkdayType } from '@/types/response/attendance';
import { useStatisticalWorkdayCols } from '@/utils/constants/cols/statisticalWorkdayCols';
import { Button, DatePicker, Input, Select, Table } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useUnits } from '@/apis/useSwr/units';
import { formatNumber } from '@/utils/functions/formatNumber';
import { FileExcelOutlined, ReloadOutlined } from '@ant-design/icons';
import { useStatisticalWorkdayExport } from '@/utils/hooks/useExportToExcel';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useFactoryStore } from '@/stores/useFactoryStore';
import { summaryStatisticalWorkdayRow } from '@/utils/constants/totalRows/summaryStatisticalWorkdayRow';

function StatisticalWorkday() {
    const { filterWorkPlaces, isLoading: isLoadingWorkPlaces } = useWorkPlaces();
    const workdayCols = useStatisticalWorkdayCols();
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs().startOf('month'));
    const myInfo = getInfomation();
    const { t, lang } = useTranslationCustom();
    const { selectedFactoryId, setSelectedFactoryId } = useFactoryStore();
    const selectedWorkPlace = selectedFactoryId || myInfo?.work_place_id || 0;
    const [dateRange, setDateRange] = useState<{ start: Dayjs; end: Dayjs }>({
        start: dayjs().startOf('month'),
        end: dayjs().endOf('month'),
    });
    const [status, setStatus] = useState<string>('all');
    const [search, setSearch] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<number | undefined>(undefined);
    const { units, isLoading: isLoadingUnits } = useUnits({
        place_id: selectedWorkPlace.toString() || undefined,
    });

    // Export hook
    const { exportDataOnly } = useStatisticalWorkdayExport(
        workdayCols,
        filterWorkPlaces,
        selectedMonth,
        selectedWorkPlace,
        status,
    );

    const statusOptions = [
        { label: t.statistical.status.all, value: 'all' },
        { label: t.statistical.status.active, value: 'active' },
        { label: t.statistical.status.resign, value: 'resign' },
    ];
    const {
        statisticalWorkday,
        isLoading: isLoadingAttendance,
        mutate: mutateAttendance,
    } = useAttendanceV2(
        {
            start: dateRange.start.format('YYYY-MM-DD') || '',
            end: dateRange.end.format('YYYY-MM-DD') || '',
            work_place_id: selectedWorkPlace || undefined,
        },
        {
            year: selectedMonth.year(),
            month: selectedMonth.month() + 1,
            status: status as 'active' | 'resign' | 'all',
            search: search,
            unit_id: selectedUnit,
        },
    );

    const handleChangeMonth = (value: Dayjs) => {
        setSelectedMonth(value);
        setDateRange({
            start: value.startOf('month'),
            end: value.endOf('month'),
        });
    };

    const onChangeWorkPlace = (value: number) => {
        setSelectedFactoryId(value);
    };
    const handleRefresh = () => {
        mutateAttendance();
    };

    const handleExportExcel = () => {
        if (!statisticalWorkday || statisticalWorkday.length === 0) {
            console.warn('No data to export');
            return;
        }

        // Export data only without summary/total row
        exportDataOnly(statisticalWorkday);
    };
    return (
        <div>
            <div className="flex items-end gap-2 mb-4">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.workday.work_place}</span>
                    <Select
                        options={filterWorkPlaces?.map((item) => ({
                            label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                            value: item.id,
                        }))}
                        style={{ width: '150px' }}
                        value={selectedWorkPlace}
                        onChange={onChangeWorkPlace}
                        loading={isLoadingWorkPlaces}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.statistical.status.title}</span>
                    <Select
                        options={statusOptions}
                        value={status}
                        onChange={setStatus}
                        style={{ width: '150px' }}
                    />
                </div>
                <DatePicker
                    value={selectedMonth}
                    onChange={handleChangeMonth}
                    picker="month"
                    allowClear={false}
                />
                <Input.Search
                    placeholder={t.workday.card_number}
                    style={{ width: '200px' }}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={setSearch}
                    allowClear
                />
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.workday.unit}</span>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select Unit"
                        allowClear
                        value={selectedUnit}
                        onChange={setSelectedUnit}
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '')
                                .toLowerCase()
                                .localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={units?.map((item) => ({
                            label: `${item.code} - ${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                            value: item.id,
                        }))}
                        loading={isLoadingUnits}
                    />
                </div>
                <Button
                    icon={<FileExcelOutlined className="!text-green-600" />}
                    onClick={handleExportExcel}
                    disabled={!statisticalWorkday || statisticalWorkday.length === 0}
                >
                    {t.workday.export}
                </Button>
                <Button
                    icon={<ReloadOutlined className="!text-orange-500" />}
                    onClick={handleRefresh}
                    loading={isLoadingAttendance}
                >
                    {t.workday.refresh}
                </Button>
            </div>
            <GenericTable<StatisticalWorkdayType>
                columns={workdayCols}
                dataSource={statisticalWorkday || []}
                rowKey="stt"
                isLoading={isLoadingAttendance}
                summary={(pageData) => summaryStatisticalWorkdayRow(pageData, t)}
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
