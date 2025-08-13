'use client';
import { useFactoryInspectionAttendance } from '@/apis/useSwr/factoryInspectionAttendance';
import { useUnits } from '@/apis/useSwr/units';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { GenericTable } from '@/components/common/GenericTable';
import { FactoryInspectionAttendance } from '@/types/response/factoryInspectionAttendance';
import { useFactoryInspectionAttendanceCols } from '@/utils/constants/cols/factoryInspectionAttendanceCols';
import { getInfomation } from '@/utils/functions/getInfomation';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { FileExcelOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useFactoryStore } from '@/stores/useFactoryStore';

function WorkdayV1() {
    const { t, lang } = useTranslationCustom();
    const factoryInspectionAttendanceCols = useFactoryInspectionAttendanceCols();
    const { filterWorkPlaces, isLoading: isLoadingWorkplace } = useWorkPlaces();
    const myInfo = getInfomation();
    const { selectedFactoryId, setSelectedFactoryId } = useFactoryStore();

    const selectedWorkPlace = selectedFactoryId || myInfo?.work_place_id;
    const { units, isLoading: isLoadingUnits } = useUnits({
        place_id: selectedWorkPlace?.toString(),
    });

    const [selectedUnit, setSelectedUnit] = useState<number>();
    const [searchInput, setSearchInput] = useState<string>('');
    const [, setSearchText] = useState<string>('');
    const [dateRange, setDateRange] = useState<{ start: Dayjs; end: Dayjs }>({
        start: dayjs(),
        end: dayjs(),
    });
    const {
        factoryInspectionAttendance,
        isLoading: isLoadingFactoryInspectionAttendance,
        mutate,
    } = useFactoryInspectionAttendance(
        {
            work_place_id: selectedWorkPlace || 0,
            start: dayjs(dateRange.start).format('YYYY-MM-DD'),
            end: dayjs(dateRange.end).format('YYYY-MM-DD'),
        },
        {
            search: searchInput,
            unit_id: selectedUnit,
        },
    );
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };
    const handleSearchSubmit = (value: string) => {
        setSearchText(value);
    };

    const handleSearchClear = () => {
        setSearchInput('');
        setSearchText('');
    };
    const onChangeDateRange = (value: [Dayjs | null, Dayjs | null] | null) => {
        if (value) {
            setDateRange({
                start: value[0]!,
                end: value[1]!,
            });
        }
    };
    const handleRefresh = () => {
        mutate();
    };
    // const { exportWithoutSummary } = useExportToExcel(workdayCols, 'Workday', 'Workday Data');

    // const handleExportExcel = () => {
    //     if (!data || data.length === 0) {
    //         console.warn('No data to export');
    //         return;
    //     }

    //     const startDate = dateRange.start.format('YYYY-MM-DD');
    //     const endDate = dateRange.end.format('YYYY-MM-DD');
    //     const workplaceName =
    //         workPlaces?.find((wp) => wp.id === selectWorkPlace)?.name_en || 'AllWorkplaces';
    //     const abnormalText = isAbnormal ? 'Abnormal' : 'Normal';
    //     const filename = `Workday_${startDate}_to_${endDate}_${workplaceName}_${abnormalText}`;

    //     exportWithoutSummary(data, filename);
    // };
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchText(searchInput);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);
    return (
        <div>
            <div className="flex flex-wrap items-end mb-4 gap-2">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.workday.work_place}</span>
                    <Select
                        options={filterWorkPlaces?.map((item) => ({
                            label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                            value: item.id,
                        }))}
                        style={{ width: '150px' }}
                        value={selectedWorkPlace}
                        onChange={setSelectedFactoryId}
                        loading={isLoadingWorkplace}
                    />
                </div>
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

                <Input.Search
                    placeholder="Search employee name"
                    style={{ width: '200px' }}
                    value={searchInput}
                    onChange={handleSearchChange}
                    onSearch={handleSearchSubmit}
                    onClear={handleSearchClear}
                    allowClear
                />
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.workday.date}</span>
                    <DatePicker.RangePicker
                        style={{ width: '250px' }}
                        value={[dateRange.start, dateRange.end]}
                        onChange={onChangeDateRange}
                        allowClear={false}
                    />
                </div>
                <Button
                    icon={<FileExcelOutlined className="!text-green-600" />}
                    // onClick={handleExportExcel}
                    // disabled={!data || data.length === 0}
                >
                    {t.workday.export}
                </Button>
                <Button
                    icon={<ReloadOutlined className="!text-orange-500" />}
                    onClick={handleRefresh}
                    loading={isLoadingFactoryInspectionAttendance}
                >
                    {t.workday.refresh}
                </Button>
            </div>
            <GenericTable<FactoryInspectionAttendance>
                columns={factoryInspectionAttendanceCols}
                dataSource={factoryInspectionAttendance || []}
                rowKey="stt"
                isLoading={isLoadingFactoryInspectionAttendance}
                // summary={() => summaryWorkdayRow(attendance, t)}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: 'default',
                }}
                className="secondary-table"
            />
        </div>
    );
}

export default WorkdayV1;
