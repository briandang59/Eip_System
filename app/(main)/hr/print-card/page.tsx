'use client';

import { useState, useEffect } from 'react';
import { PdfViewer } from '@/components/common/PdfViewer';
import { useEmployees } from '@/apis/useSwr/employees';
import { useUnits } from '@/apis/useSwr/units';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { useBasicInforEmployee } from '@/apis/useSwr/basicInforEmployee';
import { getInfomation } from '@/utils/functions/getInfomation';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { PrintCardEmployee } from '@/utils/printing/printCardEmployee';
import { Button, Select, Spin } from 'antd';
import { IdCard } from 'lucide-react';
import { UserInfo } from '@/types/response/auth';
import { PrintLeaveDocument } from '@/utils/printing/printLeaveDocument';
import { toast } from 'sonner';
import { useFactoryStore } from '@/stores/useFactoryStore';

export default function PrintCardPage() {
    const { lang, t } = useTranslationCustom();

    const [myInfo, setMyInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        setMyInfo(getInfomation());
    }, []);

    const { selectedFactoryId, setSelectedFactoryId, initializeFromUserInfo } = useFactoryStore();
    const [selectedUnit, setSelectedUnit] = useState<number>();
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCardNumber] = useState<string>('');
    const [selectedType, setSelectedType] = useState<number>(1);
    const [pdfUrl, setPdfUrl] = useState<string>('');

    // Khởi tạo factory từ user info khi component mount
    useEffect(() => {
        if (myInfo?.work_place_id) {
            initializeFromUserInfo(myInfo.work_place_id);
        }
    }, [myInfo, initializeFromUserInfo]);

    // Tự động load empty PDF khi vào trang
    useEffect(() => {
        const loadEmptyPdf = () => {
            const timestamp = Date.now();
            const pdfPath = `/api/pdf?type=empty&t=${timestamp}`;
            setPdfUrl(pdfPath);
        };

        loadEmptyPdf();
    }, []);
    useEffect(() => {
        if (!selectedEmployees.length) {
            const timestamp = Date.now();
            const pdfPath = `/api/pdf?type=empty&t=${timestamp}`;
            setPdfUrl(pdfPath);
        }
    }, [selectedEmployees]);
    const { filterWorkPlaces, isLoading: isLoadingWP } = useWorkPlaces();
    const { units, isLoading: isLoadingUnits } = useUnits({
        place_id: selectedFactoryId || undefined,
    });
    const { employees, isLoading: isLoadingEmp } = useEmployees({
        card_number: selectedCardNumber,
    });

    // Sử dụng basicInforEmployee để lấy dữ liệu cơ bản
    const { basicInforEmployee, isLoading: isLoadingBasic } = useBasicInforEmployee({
        place_id: selectedFactoryId || 0,
        card_number_list: selectedEmployees,
        unit_id: selectedUnit,
    });

    // Xử lý in thẻ
    const handlePrint = async () => {
        if (!selectedEmployees.length || !selectedFactoryId) {
            toast.warning(t.print_card.toast_error_message);
            return;
        }

        setLoading(true);
        try {
            if (!basicInforEmployee || basicInforEmployee.length === 0) {
                toast.error(t.print_card.toast_error_message);
                return;
            }
            let pdfBlobUrl: string;
            switch (selectedType) {
                case 1:
                    pdfBlobUrl = await PrintCardEmployee(basicInforEmployee, selectedFactoryId);
                    setPdfUrl(pdfBlobUrl);
                    break;
                case 2:
                    pdfBlobUrl = await PrintLeaveDocument(basicInforEmployee, selectedFactoryId);
                    setPdfUrl(pdfBlobUrl);
                    break;
            }

            toast.success(t.print_card.toast_success);
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    };

    const typeOptions = [
        { id: 1, name: t.print_card.employee_card },
        { id: 2, name: t.print_card.leave_card },
    ];

    return (
        <div>
            <div className="flex items-end gap-2 mb-4 flex-wrap">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.print_card.workplace}</span>
                    <Select
                        options={filterWorkPlaces?.map((wp) => ({
                            label: wp.name_en,
                            value: wp.id,
                        }))}
                        style={{ width: 150 }}
                        value={selectedFactoryId}
                        onChange={setSelectedFactoryId}
                        loading={isLoadingWP}
                        placeholder={t.print_card.workplace}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.print_card.unit}</span>
                    <Select
                        showSearch
                        allowClear
                        style={{ width: 200 }}
                        placeholder={t.print_card.unit}
                        value={selectedUnit}
                        onChange={setSelectedUnit}
                        loading={isLoadingUnits}
                        optionFilterProp="label"
                        options={units?.map((u) => ({
                            label: `${u.code} - ${getLocalizedName(u.name_en, u.name_zh, u.name_vn, lang)}`,
                            value: u.id,
                        }))}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.print_card.employee}</span>
                    <Select
                        showSearch
                        allowClear
                        className="min-w-[250px]"
                        placeholder={t.print_card.employee}
                        value={selectedEmployees}
                        onChange={setSelectedEmployees}
                        loading={isLoadingEmp}
                        optionFilterProp="label"
                        options={employees?.map((e) => ({
                            label: `${e.card_number} - ${e.fullname}`,
                            value: e.card_number,
                        }))}
                        mode="multiple"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.print_card.type}</span>
                    <Select
                        style={{ width: 150 }}
                        placeholder={t.print_card.type}
                        value={selectedType}
                        onChange={setSelectedType}
                        options={typeOptions.map((o) => ({ label: o.name, value: o.id }))}
                    />
                </div>

                <Button
                    icon={<IdCard className="w-4 h-4 !text-green-700" strokeWidth={1.5} />}
                    onClick={handlePrint}
                    loading={loading || isLoadingBasic}
                >
                    {t.print_card.print}
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
