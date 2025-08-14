'use client';
import { useUnits } from '@/apis/useSwr/units';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { PdfViewer } from '@/components/common/PdfViewer';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { FilePdfOutlined } from '@ant-design/icons';
import { Button, DatePicker, DatePickerProps, Input, Select, Spin } from 'antd';
import { useState } from 'react';
import { PrintWorkdayReport } from '@/utils/printing/printWorkdayReport';
import { useAttendanceV2 } from '@/apis/useSwr/attendance';
import dayjs from 'dayjs';
import { useDataReport } from '@/utils/hooks/useDataReport';
import { getInfomation } from '@/utils/functions/getInfomation';
import { useFactoryStore } from '@/stores/useFactoryStore';
import { toast } from 'sonner';

function Reports() {
    const { lang, t } = useTranslationCustom();
    const myInfo = getInfomation();
    const { workPlaces, isLoading: isLoadingWorkPlaces } = useWorkPlaces();
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [search, setSearch] = useState<string>('');
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [rangeDate, setRangeDate] = useState<{
        start: string;
        end: string;
    }>({
        start: dayjs().startOf('month').format('YYYY-MM-DD'),
        end: dayjs().endOf('month').format('YYYY-MM-DD'),
    });
    const { selectedFactoryId, setSelectedFactoryId } = useFactoryStore();
    const selectedWorkPlace = selectedFactoryId || myInfo?.work_place_id || 0;
    const { attendance, isLoading: isLoadingAttendance } = useAttendanceV2({
        unit_id: selectedUnit || undefined,
        work_place_id: selectedWorkPlace || undefined,
        start: rangeDate.start,
        end: rangeDate.end,
    });
    const { units, isLoading: isLoadingUnits } = useUnits({
        place_id: selectedWorkPlace.toString(),
    });

    const handlePrint = async () => {
        try {
            setLoading(true);

            const maxWaitTime = 5000;
            const start = Date.now();
            while (
                (attendance.length === 0 || isLoadingAttendance) &&
                Date.now() - start < maxWaitTime
            ) {
                await new Promise((resolve) => setTimeout(resolve, 100)); // đợi 100ms
            }

            if (attendance.length === 0) {
                toast.error('No data to print');
                setLoading(false);
                return;
            }

            const data = useDataReport({ attendance });
            const dataFiltered = data.filter(
                (item) =>
                    item.fullname.toLowerCase().includes(search.toLowerCase()) ||
                    item.card_number.toLowerCase().includes(search.toLowerCase()),
            );

            const pdfBlobUrl = await PrintWorkdayReport({
                data: dataFiltered,
                monthAndYear: dayjs(rangeDate.start).format('YYYY-MM'),
            });

            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }

            setPdfUrl(pdfBlobUrl + `#${Date.now()}`);
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    };

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        if (date) {
            setRangeDate({
                start: dayjs(date).startOf('month').format('YYYY-MM-DD'),
                end: dayjs(date).endOf('month').format('YYYY-MM-DD'),
            });
        }
    };
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
                <Select
                    value={selectedWorkPlace}
                    options={workPlaces?.map((workPlace) => ({
                        label: `${getLocalizedName(workPlace.name_en, workPlace.name_zh, workPlace.name_vn, lang)}`,
                        value: workPlace.id,
                    }))}
                    onChange={(value) => setSelectedFactoryId(value)}
                    loading={isLoadingWorkPlaces}
                    placeholder={t?.reports?.select_work_place || 'Select Work Place'}
                    className="w-[150px]"
                />
                <DatePicker
                    onChange={onChange}
                    picker="month"
                    value={dayjs(rangeDate.start)}
                    allowClear={false}
                />
                <Select
                    value={selectedUnit}
                    options={units?.map((unit) => ({
                        label: `${unit.code} - ${getLocalizedName(unit.name_en, unit.name_zh, unit.name_vn, lang)}`,
                        value: unit.id,
                    }))}
                    onChange={(value) => setSelectedUnit(value)}
                    loading={isLoadingUnits}
                    placeholder={t?.reports?.select_unit || 'Select Unit'}
                    allowClear
                    className="w-[200px]"
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
                <div className="w-[200px]">
                    <Input.Search
                        placeholder={t?.reports?.search || 'Search'}
                        className="w-[150px]"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={handlePrint} icon={<FilePdfOutlined />}>
                    {t?.reports?.print || 'Print'}
                </Button>
            </div>
            <div className="bg-gray-100 rounded-2xl p-2">
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <Spin size="large" />
                    </div>
                ) : (
                    pdfUrl && <PdfViewer url={pdfUrl} />
                )}
            </div>
        </div>
    );
}

export default Reports;
