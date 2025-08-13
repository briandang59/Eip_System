'use client';
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
import { useFactoryInspectionAttendance } from '@/apis/useSwr/factoryInspectionAttendance';
import { useFactoryStore } from '@/stores/useFactoryStore';

function StatisticalWorkdayV1() {
    const { filterWorkPlaces, isLoading: isLoadingWorkPlaces } = useWorkPlaces();
    const workdayCols = useStatisticalWorkdayCols();
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs().startOf('month'));
    const myInfo = getInfomation();
    const { t, lang } = useTranslationCustom();
    const { selectedFactoryId, setSelectedFactoryId } = useFactoryStore();
    const selectedWorkPlace = selectedFactoryId ?? myInfo?.work_place_id;
    const [dateRange, setDateRange] = useState<{ start: Dayjs; end: Dayjs }>({
        start: dayjs().startOf('month'),
        end: dayjs().endOf('month'),
    });
    const [status, setStatus] = useState<string>('all');
    const [search, setSearch] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<number | undefined>(undefined);
    const { units, isLoading: isLoadingUnits } = useUnits({
        place_id: selectedWorkPlace.toString(),
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
    } = useFactoryInspectionAttendance(
        {
            start: dateRange.start.format('YYYY-MM-DD') || '',
            end: dateRange.end.format('YYYY-MM-DD') || '',
            work_place_id: selectedWorkPlace,
        },
        {
            year: selectedMonth.year(),
            month: selectedMonth.month() + 1,
            status: status as 'active' | 'resign' | 'all',
            search: search,
            unit_id: selectedUnit,
        },
    );

    // Calculate totals for summary row
    const calculateTotals = (data: StatisticalWorkdayType[]) => {
        return data.reduce(
            (totals, record) => {
                totals.total_GC += record.total_GC || 0;
                totals.total_NLE += record.total_NLE || 0;
                totals.total_150 += record.total_150 || 0;
                totals.total_200 += record.total_200 || 0;
                totals.total_300 += record.total_300 || 0;
                totals.total_390 += record.total_390 || 0;
                totals.total_400 += record.total_400 || 0;
                totals.total_A += record.total_A || 0;
                totals.total_B += record.total_B || 0;
                totals.total_KP += record.total_KP || 0;
                totals.total_C += record.total_C || 0;
                totals.total_D += record.total_D || 0;
                totals.total_CV += record.total_CV || 0;
                totals.total_DT += record.total_DT || 0;
                totals.total_VS += record.total_VS || 0;
                totals.total_G200 += record.total_G200 || 0;
                totals.total_G210 += record.total_G210 || 0;
                totals.total_Gdem += record.total_Gdem || 0;
                totals.total_CCAN += record.total_CCAN || 0;
                totals.total_Tcom += record.total_Tcom || 0;
                totals.total_MonthH += record.total_MonthH || 0;
                totals.total_HChuan += record.total_HChuan || 0;
                totals.total_SGC += record.total_SGC || 0;
                totals.total_AllH += record.total_AllH || 0;
                return totals;
            },
            {
                total_GC: 0,
                total_NLE: 0,
                total_150: 0,
                total_200: 0,
                total_300: 0,
                total_390: 0,
                total_400: 0,
                total_A: 0,
                total_B: 0,
                total_KP: 0,
                total_C: 0,
                total_D: 0,
                total_CV: 0,
                total_DT: 0,
                total_VS: 0,
                total_G200: 0,
                total_G210: 0,
                total_Gdem: 0,
                total_CCAN: 0,
                total_Tcom: 0,
                total_MonthH: 0,
                total_HChuan: 0,
                total_SGC: 0,
                total_AllH: 0,
            },
        );
    };

    const summaryRow = (pageData: readonly StatisticalWorkdayType[]) => {
        const currentTotals = calculateTotals(pageData as StatisticalWorkdayType[]);

        return (
            <Table.Summary fixed>
                <Table.Summary.Row style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                    {/* STT */}
                    <Table.Summary.Cell index={0} align="center">
                        <div className="font-bold text-blue-600">{t.workday.total}</div>
                    </Table.Summary.Cell>
                    {/* Card Number */}
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    {/* Full Name */}
                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    {/* Unit */}
                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                    {/* GC */}
                    <Table.Summary.Cell index={4} align="center">
                        <div className="font-bold text-purple-600">
                            {currentTotals.total_GC > 0 ? currentTotals.total_GC : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* NLE */}
                    <Table.Summary.Cell index={5} align="center">
                        <div className="font-bold text-green-600">
                            {currentTotals.total_NLE > 0 ? currentTotals.total_NLE : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* 150 */}
                    <Table.Summary.Cell index={6} align="center">
                        <div className="font-bold text-green-600">
                            {currentTotals.total_150 > 0 ? currentTotals.total_150 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* 200 */}
                    <Table.Summary.Cell index={7} align="center">
                        <div className="font-bold text-green-600">
                            {currentTotals.total_200 > 0 ? currentTotals.total_200 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* 300 */}
                    <Table.Summary.Cell index={8} align="center">
                        <div className="font-bold text-green-600">
                            {currentTotals.total_300 > 0 ? currentTotals.total_300 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* 390 */}
                    <Table.Summary.Cell index={9} align="center">
                        <div className="font-bold text-green-600">
                            {currentTotals.total_390 > 0 ? currentTotals.total_390 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* 400 */}
                    <Table.Summary.Cell index={10} align="center">
                        <div className="font-bold text-green-600">
                            {currentTotals.total_400 > 0 ? currentTotals.total_400 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* A */}
                    <Table.Summary.Cell index={11} align="center">
                        <div className="font-bold text-red-600">
                            {currentTotals.total_A > 0 ? currentTotals.total_A : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* KP */}
                    <Table.Summary.Cell index={12} align="center">
                        <div className="font-bold text-red-600">
                            {currentTotals.total_KP > 0 ? currentTotals.total_KP : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* B */}
                    <Table.Summary.Cell index={13} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.total_B > 0 ? currentTotals.total_B : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* C */}
                    <Table.Summary.Cell index={14} align="center">
                        <div className="font-bold text-red-600">
                            {currentTotals.total_C > 0 ? currentTotals.total_C : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* D */}
                    <Table.Summary.Cell index={15} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.total_D > 0 ? currentTotals.total_D : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* DT */}
                    <Table.Summary.Cell index={16} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.total_DT > 0
                                ? formatNumber(currentTotals.total_DT)
                                : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* VS */}
                    <Table.Summary.Cell index={17} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.total_VS > 0
                                ? formatNumber(currentTotals.total_VS)
                                : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* G200 */}
                    <Table.Summary.Cell index={18} align="center">
                        <div className="font-bold text-green-600">
                            {currentTotals.total_G200 > 0 ? currentTotals.total_G200 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* G210 */}
                    <Table.Summary.Cell index={19} align="center">
                        <div className="font-bold text-green-600">
                            {currentTotals.total_G210 > 0 ? currentTotals.total_G210 : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* Gdem */}
                    <Table.Summary.Cell index={20} align="center">
                        <div className="font-bold text-green-600">
                            {currentTotals.total_Gdem > 0 ? currentTotals.total_Gdem : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* CCAN */}
                    <Table.Summary.Cell index={21} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.total_CCAN > 0
                                ? formatNumber(currentTotals.total_CCAN)
                                : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* Tcom */}
                    <Table.Summary.Cell index={22} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.total_Tcom > 0
                                ? formatNumber(currentTotals.total_Tcom)
                                : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* MonthH */}
                    <Table.Summary.Cell index={23} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.total_MonthH > 0 ? currentTotals.total_MonthH : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* H chuẩn */}
                    <Table.Summary.Cell index={24} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.total_HChuan > 0 ? currentTotals.total_HChuan : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* SGC */}
                    <Table.Summary.Cell index={25} align="center">
                        <div className="font-bold text-green-600">
                            {currentTotals.total_SGC > 0 ? currentTotals.total_SGC : '-'}
                        </div>
                    </Table.Summary.Cell>
                    {/* AllH */}
                    <Table.Summary.Cell index={26} align="center">
                        <div className="font-bold text-blue-600">
                            {currentTotals.total_AllH > 0 ? currentTotals.total_AllH : '-'}
                        </div>
                    </Table.Summary.Cell>
                </Table.Summary.Row>
            </Table.Summary>
        );
    };

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
                rowKey={(record) => `${record.card_number}_${record.unit?.id || ''}`}
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
                className="secondary-table"
            />
        </div>
    );
}

export default StatisticalWorkdayV1;
