'use client';

import { GenericTable } from '@/components/common/GenericTable';
import { useWorkdayCols } from '@/utils/constants/cols/workdayCols';
import { Button, DatePicker, Input, Select, Switch, Alert, Table } from 'antd';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { useState, useEffect, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useAttendanceV2 } from '@/apis/useSwr/attendance';
import { getInfomation } from '@/utils/functions/getInfomation';
import ClientOnly from '@/components/common/ClientOnly';
import { AttendanceV2Type } from '@/types/response/attendance';
import { useUnits } from '@/apis/useSwr/units';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { formatNumber } from '@/utils/functions/formatNumber';
import { FileExcelOutlined } from '@ant-design/icons';
import { ReloadOutlined } from '@ant-design/icons';

function Workday() {
    const { t } = useTranslationCustom();
    const workdayCols = useWorkdayCols();
    const [isAbnormal, setIsAbnormal] = useState<boolean>(false);
    const { workPlaces, isLoading: isLoadingWorkPlaces } = useWorkPlaces();
    const myInfo = getInfomation();
    const { lang } = useTranslationCustom();
    const [selectWorkPlace, setSelectWorkPlace] = useState<number | null>(
        myInfo?.work_place?.id || null,
    );
    const { units, isLoading: isLoadingUnits } = useUnits({
        place_id: selectWorkPlace || undefined,
    });
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
        dayjs(),
        dayjs(),
    ]);
    const [searchInput, setSearchInput] = useState<string>(''); // Input value for immediate UI update
    const [searchText, setSearchText] = useState<string>(''); // Debounced search value for API call
    const [selectedUnit, setSelectedUnit] = useState<number | undefined>(undefined);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchText(searchInput);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchInput]);

    const {
        attendance,
        isError,
        isLoading: isLoadingAttendance,
        mutate,
    } = useAttendanceV2(
        {
            start: dateRange?.[0]?.format('YYYY-MM-DD') || '',
            end: dateRange?.[1]?.format('YYYY-MM-DD') || '',
            work_place_id: selectWorkPlace || undefined,
        },
        {
            search: searchText,
            unit_id: selectedUnit,
            is_abnormal: isAbnormal,
        },
    );

    const getLocalizedName = (name_en: string, name_zh: string, name_vn: string) => {
        return lang === 'en' ? name_en : lang === 'zh' ? name_zh : (name_vn ?? '');
    };

    if (isError) {
        console.error('Attendance API Error:', isError);
    }

    const data: AttendanceV2Type[] = attendance || [];

    // Calculate totals for summary row
    const calculateTotals = (data: AttendanceV2Type[]) => {
        return data.reduce(
            (totals, record) => {
                const workday = record?.details[0]?.workday;
                if (workday) {
                    totals.GC += workday.GC || 0;
                    totals.NLE += workday.nle || 0;
                    totals.c150 += workday.overtime?.c150 || 0;
                    totals.c200 += workday.overtime?.c200 || 0;
                    totals.c300 += workday.overtime?.c300 || 0;
                    totals.A += workday.leave_hours?.A || 0;
                    totals.B += workday.leave_hours?.B || 0;
                    totals.KP += workday.KP || 0;
                    totals.DT += workday.DT || 0;
                    totals.G200 += workday.G200 || 0;
                    totals.G210 += workday.G210 || 0;
                    totals.Tcom += workday.Tcom || 0;
                }
                return totals;
            },
            {
                GC: 0,
                NLE: 0,
                c150: 0,
                c200: 0,
                c300: 0,
                A: 0,
                B: 0,
                KP: 0,
                DT: 0,
                G200: 0,
                G210: 0,
                Tcom: 0,
            },
        );
    };

    const summaryRow = (pageData: readonly AttendanceV2Type[]) => {
        const currentTotals = calculateTotals(pageData as AttendanceV2Type[]);

        return (
            <Table.Summary fixed>
                <Table.Summary.Row style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                    <Table.Summary.Cell index={0} align="center">
                        <div className="font-bold text-blue-600">{t.workday.total}</div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                    <Table.Summary.Cell index={5}></Table.Summary.Cell>
                    <Table.Summary.Cell index={6}></Table.Summary.Cell>
                    <Table.Summary.Cell index={7}></Table.Summary.Cell>
                    <Table.Summary.Cell index={8}></Table.Summary.Cell>
                    {/* GC */}
                    <Table.Summary.Cell index={9} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.GC > 0 ? currentTotals.GC : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* NLE */}
                    <Table.Summary.Cell index={10} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.NLE > 0 ? currentTotals.NLE : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* 150 */}
                    <Table.Summary.Cell index={11} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.c150 > 0 ? currentTotals.c150 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* 200 */}
                    <Table.Summary.Cell index={12} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.c200 > 0 ? currentTotals.c200 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* 300 */}
                    <Table.Summary.Cell index={13} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.c300 > 0 ? currentTotals.c300 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* A */}
                    <Table.Summary.Cell index={14} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.A > 0 ? currentTotals.A : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* KP */}
                    <Table.Summary.Cell index={15} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.KP > 0 ? currentTotals.KP : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* B */}
                    <Table.Summary.Cell index={16} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.B > 0 ? currentTotals.B : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* DT */}
                    <Table.Summary.Cell index={17} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.DT > 0 ? currentTotals.DT : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* G200 */}
                    <Table.Summary.Cell index={18} align="center">
                        <div className="font-bold text-green-600">
                            {currentTotals.G200 > 0 ? currentTotals.G200 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* G210 */}
                    <Table.Summary.Cell index={19} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.G210 > 0 ? currentTotals.G210 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* Tcom */}
                    <Table.Summary.Cell index={20} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.Tcom > 0 ? formatNumber(currentTotals.Tcom) : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* CTMTCN */}
                    <Table.Summary.Cell index={21}></Table.Summary.Cell>
                    {/* VPSX */}
                    <Table.Summary.Cell index={22}></Table.Summary.Cell>
                    {/* Actions */}
                    <Table.Summary.Cell index={23}></Table.Summary.Cell>
                </Table.Summary.Row>
            </Table.Summary>
        );
    };

    const onChangeWorkPlace = (value: number) => {
        setSelectWorkPlace(value);
    };
    const onChangeDateRange = (value: [Dayjs | null, Dayjs | null] | null) => {
        if (value) {
            setDateRange(value);
        }
        setDateRange(value);
    };

    const handleRefresh = () => {
        mutate();
    };

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

    return (
        <ClientOnly>
            <div className="min-h-screen">
                <div className="flex flex-wrap items-end mb-4 gap-2">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">{t.workday.work_place}</span>
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
                                label: `${item.code} - ${getLocalizedName(item.name_en, item.name_zh, item.name_vn)}`,
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
                            value={dateRange}
                            onChange={onChangeDateRange}
                            allowClear={false}
                        />
                    </div>
                    <Button icon={<FileExcelOutlined className="!text-green-600" />}>
                        {t.workday.export}
                    </Button>
                    <Button
                        icon={<ReloadOutlined className="!text-orange-500" />}
                        onClick={handleRefresh}
                        loading={isLoadingAttendance}
                    >
                        {t.workday.refresh}
                    </Button>
                    <Switch
                        checkedChildren={t.workday.normal}
                        unCheckedChildren={t.workday.abnormal}
                        checked={isAbnormal}
                        onChange={setIsAbnormal}
                    />
                </div>

                {/* Show error message if API request failed */}
                {isError && (
                    <Alert
                        message={t.workday.error_loading}
                        description={
                            <div>
                                <div style={{ marginBottom: 8 }}>
                                    {isError?.message || t.workday.error_loading}
                                </div>
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={handleRefresh}
                                    loading={isLoadingAttendance}
                                >
                                    {t.workday.try_again}
                                </Button>
                            </div>
                        }
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {/* Show table with data or fallback data */}
                <GenericTable<AttendanceV2Type>
                    columns={workdayCols}
                    dataSource={data}
                    rowKey="stt"
                    isLoading={isLoadingAttendance}
                    summary={summaryRow}
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
        </ClientOnly>
    );
}

export default Workday;
