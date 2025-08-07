'use client';
import { useEmployees } from '@/apis/useSwr/employees';
import { useUnits } from '@/apis/useSwr/units';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { GenericTable } from '@/components/common/GenericTable';
import { getInfomation } from '@/utils/functions/getInfomation';
import { FileExcelFilled, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { InputNumber } from 'antd';
import { useOvertimeCols } from '@/utils/constants/cols/overtimeCols';
import { useOvertime } from '@/apis/useSwr/overtime';
import { OvertimeRequestType } from '@/types/requests/ovetime';
import { toast } from 'sonner';
import { overtimeService } from '@/apis/services/overtime';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useFactoryStore } from '@/stores/useFactoryStore';

// Định nghĩa type cho row
interface OvertimeEmployeeRow {
    uuid: string;
    card_number: string;
    full_name: string;
    [key: string]: string | number | undefined;
}

function OvertimePage() {
    const myInfo = getInfomation();
    const { workPlaces, isLoading: isLoadingWorkPlaces } = useWorkPlaces();
    const { t } = useTranslationCustom();

    const { selectedFactoryId, setSelectedFactoryId } = useFactoryStore();
    const selectedWorkPlace = selectedFactoryId || myInfo?.work_place_id || 0;
    const [search, setSearch] = useState<string>('');
    const [date, setDate] = useState<Dayjs>(dayjs());
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [overtimeData, setOvertimeData] = useState<Record<string, Record<string, number>>>({});

    useEffect(() => {
        if (myInfo && selectedWorkPlace === null) {
            setSelectedFactoryId(myInfo.work_place_id ?? undefined);
        }
    }, [myInfo, selectedWorkPlace, setSelectedFactoryId]);
    const { units, isLoading: isLoadingUnits } = useUnits({
        place_id: selectedWorkPlace ?? undefined,
    });
    const { employees, isLoading: isLoadingEmployees } = useEmployees({
        place_id: selectedWorkPlace ?? undefined,
        unit_id: selectedUnit ?? undefined,
    });

    const { overtimes, mutate } = useOvertime({
        start_time: date.startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        end_time: date.endOf('month').format('YYYY-MM-DD HH:mm:ss'),
        place_id: selectedWorkPlace ?? undefined,
        unit_id: selectedUnit ?? undefined,
    });
    const overtimeMap = new Map<string, number>();
    overtimes?.forEach((ot) => {
        const day = dayjs(ot.start_time).date().toString().padStart(2, '0');
        overtimeMap.set(`${ot.employee_uuid}_${day}`, ot.hours);
    });
    const handleSearch = (value: string) => {
        setSearch(value);
    };

    const handleDateChange = (date: Dayjs | null) => {
        setDate(date || dayjs());
    };

    const handleOvertimeChange = (uuid: string, day: string, value: number | null) => {
        setOvertimeData((prev) => ({
            ...prev,
            [uuid]: {
                ...prev[uuid],
                [day]: value ?? 0,
            },
        }));
    };

    const daysInMonth = date.daysInMonth();
    const year = date.year();
    const month = date.month() + 1;
    const dayCols = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateObj = dayjs(
            `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        );
        const isSunday = dateObj.day() === 0;
        const dayKey = day.toString().padStart(2, '0');
        return {
            title: <span className={`${isSunday ? 'text-red-600 font-bold' : ''}`}>{dayKey}</span>,
            dataIndex: dayKey,
            key: dayKey,
            width: 60,
            className: isSunday ? 'sunday-col' : '',
            render: (_: unknown, record: OvertimeEmployeeRow) => (
                <InputNumber
                    min={0}
                    max={24}
                    value={
                        overtimeData[record.uuid]?.[dayKey] ??
                        overtimeMap.get(`${record.uuid}_${dayKey}`) ??
                        ''
                    }
                    onChange={(val) => handleOvertimeChange(record.uuid, dayKey, val)}
                    size="small"
                    className="!w-[50px] p-0 text-xs"
                    style={{ textAlign: 'center', padding: 0 }}
                />
            ),
        };
    });

    const fixedCols = useOvertimeCols();

    const columns = [...fixedCols, ...dayCols];

    const handleSave = async () => {
        try {
            const result: OvertimeRequestType[] = [];
            Object.entries(overtimeData).forEach(([uuid, days]) => {
                Object.entries(days).forEach(([day, hour]) => {
                    if (hour && hour > 0) {
                        result.push({
                            uuid,
                            start_time: dayjs(date).date(Number(day)).format('YYYY-MM-DD HH:mm:ss'),
                            end_time: dayjs(date).date(Number(day)).format('YYYY-MM-DD HH:mm:ss'),
                            hour,
                            reason: '',
                        });
                    }
                });
            });
            await overtimeService.add(result);
            toast.success('Save overtime successfully');
            mutate();
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const employeesData: OvertimeEmployeeRow[] = (employees || []).map((emp) => ({
        uuid: emp.uuid,
        card_number: emp.card_number,
        full_name: emp.fullname, // Đổi lại cho khớp với columns
    }));

    // Columns cho export (không có render)
    const columnsExport = [
        ...fixedCols.map((col) => ({ ...col, render: undefined })),
        ...Array.from({ length: daysInMonth }, (_, i) => {
            const dayKey = (i + 1).toString().padStart(2, '0');
            return {
                title: dayKey,
                dataIndex: dayKey,
                key: dayKey,
                width: 60,
            };
        }),
    ];

    const { exportBasic } = useExportToExcel(columnsExport, 'Overtime', 'Overtime');
    const handleExportExcel = () => {
        if (!employeesData || employeesData.length === 0) return;
        // Map lại để export đủ data các ngày
        const exportRows = employeesData.map((row) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newRow: Record<string, any> = { ...row };
            for (let i = 1; i <= daysInMonth; i++) {
                const dayKey = i.toString().padStart(2, '0');
                newRow[dayKey] =
                    overtimeData[row.uuid]?.[dayKey] ??
                    overtimeMap.get(`${row.uuid}_${dayKey}`) ??
                    '';
            }
            return newRow;
        });
        exportBasic(exportRows);
    };
    const handleRefresh = () => {
        mutate();
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
                <Select
                    options={workPlaces?.map((item) => ({
                        label: item.name_en,
                        value: item.id,
                    }))}
                    loading={isLoadingWorkPlaces}
                    value={selectedWorkPlace ?? undefined}
                    onChange={setSelectedFactoryId}
                    className="w-[150px]"
                />
                <Select
                    options={units?.map((item) => ({
                        label: item.name_en || item.name_vn || item.name_zh,
                        value: item.id,
                    }))}
                    loading={isLoadingUnits}
                    value={selectedUnit}
                    onChange={setSelectedUnit}
                    className="w-[150px]"
                    placeholder="Select unit"
                />
                <div className="w-[200px]">
                    <Input.Search
                        placeholder="Search"
                        className="w-[200px]"
                        onSearch={handleSearch}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <DatePicker
                    className="w-[200px]"
                    placeholder="Select date"
                    onChange={handleDateChange}
                    picker="month"
                    value={date}
                />
                <Button
                    icon={<FileExcelFilled className="!text-green-700" />}
                    onClick={handleExportExcel}
                >
                    {t.common.forms.export}
                </Button>
                <Button
                    icon={<ReloadOutlined className="!text-orange-500" />}
                    onClick={handleRefresh}
                >
                    {t.common.forms.refresh}
                </Button>
                <Button icon={<SaveOutlined className="!text-green-700" />} onClick={handleSave}>
                    {t.common.forms.submit}
                </Button>
            </div>

            <GenericTable<OvertimeEmployeeRow>
                columns={columns}
                dataSource={employeesData}
                rowKey="uuid"
                isLoading={isLoadingEmployees}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: 'default',
                }}
                virtual
            />
        </div>
    );
}

export default OvertimePage;
