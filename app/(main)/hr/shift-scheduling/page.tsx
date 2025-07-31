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

interface FormatAssignmentsReturnType {
    create: ShiftCreateRequestType[];
    delete: ShiftDeleteRequestType[];
    modify: ShiftModifyRequestType[];
}

export default function ShiftSchedulingPage() {
    const [monthValue, setMonthValue] = useState<Dayjs>(dayjs());
    const [step, setStep] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const myInfo = getInfomation();
    const [selectedWorkPlace, setSelectedWorkPlace] = useState<number>(myInfo?.work_place_id ?? 0);
    const [selectedShiftId, setSelectedShiftId] = useState<number | undefined>(undefined);
    const [assignments, setAssignments] = useState<TempAssignments>({});
    const { isLoading, run } = useLoadingWithDelay({ minDelayMs: 5000, timeoutMs: 10000 });
    const hasAssign = Boolean(Object.keys(assignments).length);
    const year = monthValue.year();
    const month = monthValue.month() + 1;
    const daysInMonth = monthValue.daysInMonth();

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
        work_place_id: selectedWorkPlace,
    });
    const { employees } = useEmployees({ place_id: selectedWorkPlace });

    const selectedShift = useMemo(
        () => shiftForShiftPage?.find((s) => s.id === selectedShiftId),
        [shiftForShiftPage, selectedShiftId],
    );

    const mergedRows = useMemo(
        () =>
            mergeShiftDates({
                employees: employees ?? [],
                shifts: shiftsDate,
                year,
                month,
            }),
        [employees, shiftsDate, year, month],
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
                toast.warning('Chọn ca trước!');
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
        [selectedShift, selectedShiftId, step, daysInMonth],
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

            console.log('formatAssignments result:', { create, toDelete, modify });

            if (create.length === 0 && toDelete.length === 0 && modify.length === 0) {
                toast.warning('Không có ca nào được gán!');
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

                toast.success('Đã lưu các ca thành công!');
                setAssignments({});
                mutate();
            } catch (err) {
                toast.error('Lưu ca thất bại!');
                console.error(err);
            }
        });
    }, [run, formatAssignments, mutate]);

    const debouncedSetMonthValue = useMemo(
        () =>
            debounce((value: Dayjs) => {
                setMonthValue(value);
            }, 300),
        [setMonthValue],
    );

    const debouncedSetSelectedWorkPlace = useMemo(
        () =>
            debounce((value: number) => {
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
                    placeholder="Workplace"
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
                    placeholder="Shift"
                />

                <InputNumber
                    min={1}
                    max={31}
                    value={step}
                    onChange={(value: number | null) => setStep(value ?? 1)}
                    addonAfter="ngày"
                    style={{ width: 120 }}
                />

                <DatePicker
                    picker="month"
                    value={monthValue}
                    onChange={(v) => v && debouncedSetMonthValue(v)}
                    allowClear={false}
                />

                <Input.Search
                    placeholder="Tìm nhân viên…"
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
                    Huỷ
                </Button>
                <Button
                    disabled={!hasAssign}
                    onClick={handleSave}
                    icon={<Save className="size-4" />}
                    type="primary"
                >
                    Lưu
                </Button>
                <Button
                    icon={<FileExcelOutlined />}
                    onClick={handleExportExcel}
                    disabled={!filteredRows || filteredRows.length === 0}
                >
                    Export
                </Button>
            </Space>
            {isLoading || isLoadingShiftDate ? (
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
