'use client';

import { useState, useMemo, useCallback } from 'react';
import { DatePicker, Input, InputNumber, Select, Button, Space, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'lodash';

import { useEmployees } from '@/apis/useSwr/employees';
import { useShifts } from '@/apis/useSwr/shift';
import { useWorkPlaces } from '@/apis/useSwr/work-places';

import { GenericTable } from '@/components/common/GenericTable';
import { ShiftDateResponseType, TempAssignments } from '@/types/response/shiftType';
import { useShiftHrCols } from '@/utils/constants/cols/shiftHrCols';
import { Hand, Save } from 'lucide-react';
import { useShiftsDate } from '@/apis/useSwr/shiftDate';
import { EmployeeRow, mergeShiftDates } from '@/utils/functions/mergeShiftDate';
import { getInfomation } from '@/utils/functions/getInfomation';
import { toast } from 'sonner';
import ClientOnly from '@/components/common/ClientOnly';

export default function ShiftSchedulingPage() {
    const [monthValue, setMonthValue] = useState<Dayjs>(dayjs());
    const [step, setStep] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const myInfo = getInfomation();
    const [selectedWorkPlace, setSelectedWorkPlace] = useState<number>(myInfo?.work_place_id ?? 0);
    const [selectedShiftId, setSelectedShiftId] = useState<number>();
    const [assignments, setAssignments] = useState<TempAssignments>({});

    const hasAssign = Boolean(Object.keys(assignments).length);
    const year = monthValue.year();
    const month = monthValue.month() + 1;
    const daysInMonth = monthValue.daysInMonth();

    const { shifts, isLoading: loadingShift } = useShifts();
    const { workPlaces, isLoading: loadingWp } = useWorkPlaces();
    const dateRange = useMemo(
        () => ({
            range_date_start: `${year}-${month.toString().padStart(2, '0')}-01`,
            range_date_end: `${year}-${month.toString().padStart(2, '0')}-${daysInMonth}`,
        }),
        [year, month, daysInMonth],
    );
    const { shiftsDate, isLoading: isLoadingShiftDate } = useShiftsDate({
        ...dateRange,
        work_place_id: selectedWorkPlace,
    });
    const { employees } = useEmployees({ place_id: selectedWorkPlace });

    const selectedShift = useMemo(
        () => shifts?.find((s) => s.id === selectedShiftId),
        [shifts, selectedShiftId],
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
        return mergedRows
            .filter(
                (r) =>
                    r.fullname.toLowerCase().includes(q) || r.card_number.toLowerCase().includes(q),
            )
            .sort((a, b) => (a.unit?.id ?? 0) - (b.unit?.id ?? 0));
    }, [mergedRows, search]);

    const handleCellClick = useCallback(
        (card: string, day: string) => {
            if (!selectedShift) {
                message.warning('Chọn ca trước!');
                return;
            }
            setAssignments((prev) => {
                const newAssignments = { ...prev };
                const startDay = parseInt(day, 10);
                const endDay = Math.min(startDay + step - 1, daysInMonth); // Giới hạn trong tháng
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
        [selectedShift, step, daysInMonth],
    );

    const handleClear = useCallback(() => {
        setAssignments({});
    }, []);

    const debouncedSetMonthValue = useCallback(
        debounce((value: Dayjs) => {
            setMonthValue(value);
        }, 300),
        [],
    );

    const debouncedSetSelectedWorkPlace = useCallback(
        debounce((value: number) => {
            setSelectedWorkPlace(value);
        }, 300),
        [],
    );

    const columns = useShiftHrCols({
        year,
        month,
        onCellClick: handleCellClick,
        getAssignment: (card, day) => assignments[card]?.[day],
    });

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
                    options={shifts?.map((s) => ({
                        label: `${s.tag} (${s.start_time}‑${s.end_time})`,
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
                    onChange={(v) => setStep(v ?? 1)}
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
                    onClick={handleClear}
                    icon={<Save className="size-4" />}
                    type="primary"
                >
                    Lưu
                </Button>
            </Space>

            <GenericTable<EmployeeRow>
                columns={columns}
                dataSource={filteredRows || []}
                rowKey="uuid"
                isLoading={isLoadingShiftDate}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
            />
        </ClientOnly>
    );
}
