'use client';

import { useState, useMemo, useRef } from 'react';
import { DatePicker, Input, InputNumber, Select, Button, Space, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

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

    const assignmentsRef = useRef<TempAssignments>({});
    const hasAssign = Boolean(Object.keys(assignmentsRef.current).length);
    const [, force] = useState(0); // trigger nhẹ
    const year = monthValue.year();
    const month = monthValue.month() + 1;
    const daysInMonth = monthValue.daysInMonth();

    const { shifts, isLoading: loadingShift } = useShifts();
    const { workPlaces, isLoading: loadingWp } = useWorkPlaces();
    const { shiftsDate, isLoading: isLoadingShiftDate } = useShiftsDate({
        range_date_start: '2025-07-01',
        range_date_end: '2025-07-31',
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
        return mergedRows.filter(
            (r) => r.fullname.toLowerCase().includes(q) || r.card_number.toLowerCase().includes(q),
        );
    }, [mergedRows, search]);

    const handleCellClick = (card: string, day: string) => {
        if (!selectedShift) return message.warning('Chọn ca trước!');
        // ⬇️ Cập nhật REF – không đổi object columns
        assignmentsRef.current = {
            ...assignmentsRef.current,
            [card]: {
                ...assignmentsRef.current[card],
                [day]: selectedShift.tag,
            },
        };
        force((c) => c + 1); // chỉ rerender Table body
    };

    const handleClear = () => {
        assignmentsRef.current = {};
        force((c) => c + 1);
    };

    const columns = useShiftHrCols({
        year,
        month,
        onCellClick: handleCellClick,
        getAssignment: (card, day) => assignmentsRef.current[card]?.[day],
    });

    return (
        <ClientOnly>
            <Space className="mb-4" wrap>
                <Select
                    options={workPlaces?.map((wp) => ({ label: wp.name_en, value: wp.id }))}
                    style={{ width: 160 }}
                    value={selectedWorkPlace}
                    onChange={setSelectedWorkPlace}
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
                    onChange={(v) => v && setMonthValue(v)}
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
