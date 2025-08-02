'use client';

import { useState, useMemo, useCallback } from 'react';
import { DatePicker, Input, InputNumber, Select, Button, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'lodash';

import { useEmployees } from '@/apis/useSwr/employees';
import { useShifts } from '@/apis/useSwr/shift';
import { useWorkPlaces } from '@/apis/useSwr/work-places';

import { GenericTable } from '@/components/common/GenericTable';
import { TempAssignments } from '@/types/response/shiftType';
import { useShiftHrCols } from '@/utils/constants/cols/shiftHrCols';
import { Hand, Save } from 'lucide-react';
import { useShiftsDate } from '@/apis/useSwr/shiftDate';
import { EmployeeRow, mergeShiftDates } from '@/utils/functions/mergeShiftDate';
import { getInfomation } from '@/utils/functions/getInfomation';
import { toast } from 'sonner';
import ClientOnly from '@/components/common/ClientOnly';
import { shiftService } from '@/apis/services/shift';
import {
    ShiftCreateRequestType,
    ShiftDeleteRequestType,
    ShiftModifyRequestType,
} from '@/types/requests/shift';
import { DayKey } from '@/types/response/dateKey';
import { useLoadingWithDelay } from '@/utils/hooks/useLoadingWithTimeout';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { FileExcelOutlined } from '@ant-design/icons';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useUnits } from '@/apis/useSwr/units';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';

interface FormatAssignmentsReturnType {
    create: ShiftCreateRequestType[];
    delete: ShiftDeleteRequestType[];
    modify: ShiftModifyRequestType[];
}

export default function ShiftSchedulingPage() {
    const { t, lang } = useTranslationCustom();
    const [monthValue, setMonthValue] = useState<Dayjs>(dayjs());
    const [step, setStep] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const myInfo = getInfomation();
    const [selectedWorkPlace, setSelectedWorkPlace] = useState<number | null>(
        myInfo?.work_place_id ?? null,
    );
    const [selectedShiftId, setSelectedShiftId] = useState<number | undefined>(undefined);
    const [assignments, setAssignments] = useState<TempAssignments>({});
    const { isLoading, run } = useLoadingWithDelay({ minDelayMs: 5000, timeoutMs: 10000 });
    const hasAssign = Boolean(Object.keys(assignments).length);
    const year = monthValue.year();
    const month = monthValue.month() + 1;
    const daysInMonth = monthValue.daysInMonth();
    const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>(126);
    const { shiftForShiftPage, isLoading: loadingShift } = useShifts();
    const { workPlaces, isLoading: loadingWp } = useWorkPlaces();
    const dateRange = useMemo(
        () => ({
            range_date_start: `${year}-${month.toString().padStart(2, '0')}-01`,
            range_date_end: `${year}-${month.toString().padStart(2, '0')}-${daysInMonth}`,
        }),
        [year, month, daysInMonth],
    );
    const {
        shiftsDate,
        isLoading: isLoadingShiftDate,
        mutate,
    } = useShiftsDate({
        ...dateRange,
        work_place_id: selectedWorkPlace ?? 0,
    });
    const { activeEmployees, isLoading: loadingEmployees } = useEmployees({
        place_id: selectedWorkPlace ?? 0,
        unit_id: selectedUnitId ?? 0,
    });
    const { units, isLoading: loadingUnits } = useUnits({
        place_id: selectedWorkPlace ?? 0,
    });
    const selectedShift = useMemo(
        () => shiftForShiftPage?.find((s) => s.id === selectedShiftId),
        [shiftForShiftPage, selectedShiftId],
    );

    const mergedRows = useMemo(
        () =>
            mergeShiftDates({
                employees: activeEmployees ?? [],
                shifts: shiftsDate ?? [],
                year,
                month,
            }),
        [activeEmployees, shiftsDate, year, month],
    );

    const filteredRows = useMemo(() => {
        if (!search.trim()) return mergedRows;
        const q = search.toLowerCase();
        return mergedRows.filter(
            (r) => r.fullname.toLowerCase().includes(q) || r.card_number.toLowerCase().includes(q),
        );
    }, [mergedRows, search]);

    const handleCellClick = useCallback(
        (card: string, day: string) => {
            if (selectedShiftId === undefined || !selectedShift) {
                toast.warning(t.shift_scheduling.warning_1);
                return;
            }
            setAssignments((prev) => {
                const newAssignments = { ...prev };
                const startDay = parseInt(day, 10);
                const endDay = Math.min(startDay + step - 1, daysInMonth);
                for (let d = startDay; d <= endDay; d++) {
                    const dayStr = d.toString().padStart(2, '0');
                    newAssignments[card] = {
                        ...newAssignments[card],
                        [dayStr]: selectedShift.tag,
                    };
                }
                return newAssignments;
            });
        },
        [selectedShift, selectedShiftId, step, daysInMonth, t.shift_scheduling.warning_1],
    );

    const handleClear = useCallback(() => {
        setAssignments({});
    }, []);

    const formatAssignments = useCallback((): FormatAssignmentsReturnType => {
        if (!shiftForShiftPage) return { create: [], delete: [], modify: [] };
        const createAssignments: ShiftCreateRequestType[] = [];
        const deleteAssignments: ShiftDeleteRequestType[] = [];
        const modifyAssignments: ShiftModifyRequestType[] = [];
        const shiftTagToId = new Map(shiftForShiftPage.map((s) => [s.tag, s.id]));

        Object.entries(assignments).forEach(([card, days]) => {
            let startDay: number | null = null;
            let endDay: number | null = null;
            let currentTag: string | null = null;

            Object.entries(days)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .forEach(([day, tag]) => {
                    const dayNum = parseInt(day, 10);
                    if (!currentTag) {
                        startDay = dayNum;
                        endDay = dayNum;
                        currentTag = tag;
                    } else if (tag === currentTag && endDay !== null && dayNum === endDay + 1) {
                        endDay = dayNum;
                    } else {
                        if (startDay !== null && endDay !== null && currentTag !== null) {
                            const dayStr = startDay.toString().padStart(2, '0') as DayKey; // Type assertion
                            const formatted = {
                                start: `${year}-${month.toString().padStart(2, '0')}-${dayStr}`,
                                end: `${year}-${month.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`,
                            };
                            // Tìm ca hiện tại trong mergedRows
                            const employee = mergedRows.find((row) => row.card_number === card);
                            const currentShiftTag = employee ? (employee[dayStr] ?? '') : '';
                            if (currentTag === 'unshift') {
                                deleteAssignments.push({
                                    card_number: card,
                                    start_date: formatted.start,
                                    end_date: formatted.end,
                                });
                            } else if (currentShiftTag && currentShiftTag !== currentTag) {
                                // Nếu ô đã có ca và ca mới khác ca hiện tại, thì modify
                                modifyAssignments.push({
                                    card_number: card,
                                    start_date: formatted.start,
                                    end_date: formatted.end,
                                    shift_id: shiftTagToId.get(currentTag)!,
                                });
                            } else {
                                // Nếu ô không có ca hoặc ca giống nhau, thì create
                                createAssignments.push({
                                    card_numbers: [card],
                                    start: formatted.start,
                                    end: formatted.end,
                                    shift_id: shiftTagToId.get(currentTag)!,
                                    note: '',
                                });
                            }
                        }
                        startDay = dayNum;
                        endDay = dayNum;
                        currentTag = tag;
                    }
                });

            if (startDay !== null && endDay !== null && currentTag !== null) {
                const dayStr = String(startDay).padStart(2, '0') as DayKey; // Type assertion
                const formatted = {
                    start: `${year}-${month.toString().padStart(2, '0')}-${dayStr}`,
                    end: `${year}-${month.toString().padStart(2, '0')}-${String(endDay).padStart(2, '0')}`,
                };
                // Tìm ca hiện tại trong mergedRows
                const employee = mergedRows.find((row) => row.card_number === card);
                const currentShiftTag = employee ? (employee[dayStr] ?? '') : '';
                if (currentTag === 'unshift') {
                    deleteAssignments.push({
                        card_number: card,
                        start_date: formatted.start,
                        end_date: formatted.end,
                    });
                } else if (currentShiftTag && currentShiftTag !== currentTag) {
                    // Nếu ô đã có ca và ca mới khác ca hiện tại, thì modify
                    modifyAssignments.push({
                        card_number: card,
                        start_date: formatted.start,
                        end_date: formatted.end,
                        shift_id: shiftTagToId.get(currentTag)!,
                    });
                } else {
                    // Nếu ô không có ca hoặc ca giống nhau, thì create
                    createAssignments.push({
                        card_numbers: [card],
                        start: formatted.start,
                        end: formatted.end,
                        shift_id: shiftTagToId.get(currentTag)!,
                        note: '',
                    });
                }
            }
        });

        return { create: createAssignments, delete: deleteAssignments, modify: modifyAssignments };
    }, [assignments, year, month, shiftForShiftPage, mergedRows]);
    const handleSave = useCallback(() => {
        run(async () => {
            const {
                create,
                delete: toDelete,
                modify,
            }: FormatAssignmentsReturnType = formatAssignments();

            if (create.length === 0 && toDelete.length === 0 && modify.length === 0) {
                toast.warning(t.shift_scheduling.warning_2);
                return;
            }

            try {
                if (create.length > 0) {
                    await Promise.all(create.map((item) => shiftService.add(item)));
                }
                if (toDelete.length > 0) {
                    await Promise.all(toDelete.map((item) => shiftService.remove(item)));
                }
                if (modify.length > 0) {
                    await Promise.all(modify.map((item) => shiftService.modify(item)));
                }

                toast.success(t.shift_scheduling.success_1);
                setAssignments({});
                mutate();
            } catch (err) {
                toast.error(t.shift_scheduling.err_1);
                console.error(err);
            }
        });
    }, [
        run,
        formatAssignments,
        mutate,
        t.shift_scheduling.err_1,
        t.shift_scheduling.success_1,
        t.shift_scheduling.warning_2,
    ]);

    const debouncedSetMonthValue = useMemo(
        () =>
            debounce((value: Dayjs) => {
                setMonthValue(value);
            }, 300),
        [setMonthValue],
    );

    const debouncedSetSelectedWorkPlace = useMemo(
        () =>
            debounce((value: number | null) => {
                setSelectedWorkPlace(value);
            }, 300),
        [setSelectedWorkPlace],
    );

    const columns = useShiftHrCols({
        year,
        month,
        step,
        onCellClick: handleCellClick,
        getAssignment: (card, day) => assignments[card]?.[day],
    });

    const { exportBasic } = useExportToExcel(columns, 'ShiftScheduling', 'ShiftScheduling');
    const handleExportExcel = () => {
        if (!filteredRows || filteredRows.length === 0) return;
        exportBasic(filteredRows);
    };

    return (
        <ClientOnly>
            <Space className="mb-4" wrap>
                <Select
                    options={workPlaces?.map((wp) => ({ label: wp.name_en, value: wp.id }))}
                    style={{ width: 160 }}
                    value={selectedWorkPlace}
                    onChange={debouncedSetSelectedWorkPlace}
                    loading={loadingWp}
                    placeholder={t.shift_scheduling.workplace}
                    allowClear
                />

                <Select
                    options={shiftForShiftPage?.map((s) => ({
                        label:
                            s.tag === 'unshift'
                                ? 'Unshift'
                                : `${s.tag} (${s.start_time ?? ''}‑${s.end_time ?? ''})`,
                        value: s.id,
                    }))}
                    style={{ width: 190 }}
                    value={selectedShiftId}
                    onChange={setSelectedShiftId}
                    loading={loadingShift}
                    placeholder={t.shift_scheduling.shift}
                />
                <Select
                    options={units?.map((u) => ({
                        label: `${u.code} - ${getLocalizedName(u?.name_en, u?.name_zh, u?.name_vn, lang)}`,
                        value: u.id,
                    }))}
                    style={{ width: 190 }}
                    value={selectedUnitId}
                    onChange={setSelectedUnitId}
                    loading={loadingUnits}
                    placeholder={t.shift_scheduling.unit}
                    showSearch
                />

                <InputNumber
                    min={1}
                    max={31}
                    value={step}
                    onChange={(value: number | null) => setStep(value ?? 1)}
                    addonAfter={t.shift_scheduling.day}
                    style={{ width: 120 }}
                />

                <DatePicker
                    picker="month"
                    value={monthValue}
                    onChange={(v) => v && debouncedSetMonthValue(v)}
                    allowClear={false}
                />

                <Input.Search
                    placeholder={t.shift_scheduling.search_employee}
                    allowClear
                    style={{ width: 220 }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Button
                    danger
                    disabled={!hasAssign}
                    onClick={handleClear}
                    icon={<Hand className="size-4" />}
                >
                    {t.shift_scheduling.cancel}
                </Button>
                <Button
                    disabled={!hasAssign}
                    onClick={handleSave}
                    icon={<Save className="size-4" />}
                    type="primary"
                >
                    {t.shift_scheduling.save}
                </Button>
                <Button
                    icon={<FileExcelOutlined />}
                    onClick={handleExportExcel}
                    disabled={!filteredRows || filteredRows.length === 0}
                >
                    {t.shift_scheduling.export}
                </Button>
            </Space>
            {isLoading || isLoadingShiftDate || loadingEmployees || loadingUnits ? (
                <TableSkeleton />
            ) : (
                <GenericTable<EmployeeRow>
                    columns={columns}
                    dataSource={filteredRows || []}
                    rowKey="uuid"
                    isLoading={isLoading || isLoadingShiftDate}
                    pagination={{
                        defaultPageSize: 30,
                        pageSizeOptions: ['30', '50'],
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    className="shift-table"
                />
            )}
        </ClientOnly>
    );
}
