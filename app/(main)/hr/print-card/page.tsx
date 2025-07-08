'use client';

import { useState, useEffect } from 'react';
import { PdfViewer } from '@/components/common/PdfViewer';
import { useEmployees } from '@/apis/useSwr/employees';
import { useUnits } from '@/apis/useSwr/units';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { getInfomation } from '@/utils/functions/getInfomation';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Select } from 'antd';
import { IdCard } from 'lucide-react';

export default function PrintCardPage() {
    /* ------------------- i18n ------------------- */
    const { lang } = useTranslationCustom();

    /* ----------------- client‑side only info ---------------- */
    const [myInfo, setMyInfo] = useState<any>(null);

    // Lấy thông tin localStorage sau khi đã vào browser
    useEffect(() => {
        setMyInfo(getInfomation());
    }, []);

    /* ----------------------------- state ----------------------------- */
    const [selectedWorkPlace, setSelectedWorkPlace] = useState<number | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<number>();
    const [selectedCardNumber, setSelectedCardNumber] = useState<string>('');
    const [selectedType, setSelectedType] = useState<number>();
    const [pdfUrl, setPdfUrl] = useState<string>('/files/blank.pdf');

    /* ---------- khi myInfo có thì cập nhật workplace mặc định ---------- */
    useEffect(() => {
        if (myInfo?.work_place?.id) {
            setSelectedWorkPlace(myInfo.work_place.id);
        }
    }, [myInfo]);

    /* ----------------------- SWR hooks ----------------------- */
    const { workPlaces, isLoading: isLoadingWP } = useWorkPlaces();
    const { units, isLoading: isLoadingUnits } = useUnits({
        place_id: selectedWorkPlace || undefined,
    });
    const { employees, isLoading: isLoadingEmp } = useEmployees({
        card_number: selectedCardNumber,
    });

    /* ----------------- Demo nút Print: đặt lại blank.pdf ---------------- */
    const handlePrint = () => {
        setPdfUrl('/pdf/blank.pdf');
        // 🔜 Sau này bạn tạo blob PDF rồi: const url = URL.createObjectURL(blob); setPdfUrl(url)
    };

    const typeOptions = [
        { id: 1, name: 'Leave card' },
        { id: 2, name: 'Employee card' },
    ];

    /* ------------------------------ render ------------------------------ */
    return (
        <div>
            <div className="flex items-end gap-2 mb-4">
                <Select
                    options={workPlaces?.map((wp) => ({ label: wp.name_en, value: wp.id }))}
                    style={{ width: 150 }}
                    value={selectedWorkPlace}
                    onChange={setSelectedWorkPlace}
                    loading={isLoadingWP}
                    placeholder="Workplace"
                />

                <Select
                    showSearch
                    allowClear
                    style={{ width: 200 }}
                    placeholder="Select Unit"
                    value={selectedUnit}
                    onChange={setSelectedUnit}
                    loading={isLoadingUnits}
                    optionFilterProp="label"
                    options={units?.map((u) => ({
                        label: `${u.code} - ${getLocalizedName(u.name_en, u.name_zh, u.name_vn, lang)}`,
                        value: u.id,
                    }))}
                />

                <Select
                    showSearch
                    allowClear
                    style={{ width: 250 }}
                    placeholder="Select Employee"
                    value={selectedCardNumber}
                    onChange={setSelectedCardNumber}
                    loading={isLoadingEmp}
                    optionFilterProp="label"
                    options={employees?.map((e) => ({
                        label: `${e.card_number} - ${e.fullname}`,
                        value: e.card_number,
                    }))}
                />

                <Select
                    style={{ width: 150 }}
                    placeholder="Type"
                    value={selectedType}
                    onChange={setSelectedType}
                    options={typeOptions.map((o) => ({ label: o.name, value: o.id }))}
                />

                <Button
                    icon={<IdCard className="w-4 h-4 !text-green-700" strokeWidth={1.5} />}
                    onClick={handlePrint}
                >
                    Print
                </Button>
            </div>

            {/* 👉 truyền url để iframe hiển thị PDF */}
            <PdfViewer url={pdfUrl} />
        </div>
    );
}
