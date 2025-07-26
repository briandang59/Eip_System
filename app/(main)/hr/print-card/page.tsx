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
import { Button, Select, Spin, message } from 'antd';
import { IdCard } from 'lucide-react';
import { UserInfo } from '@/types/response/auth';
import { PrintLeaveDocument } from '@/utils/printing/printLeaveDocument';
import { toast } from 'sonner';

export default function PrintCardPage() {
    const { lang } = useTranslationCustom();

    const [myInfo, setMyInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        setMyInfo(getInfomation());
    }, []);

    const [selectedWorkPlace, setSelectedWorkPlace] = useState<number | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<number>();
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCardNumber] = useState<string>('');
    const [selectedType, setSelectedType] = useState<number>(1);
    const [pdfUrl, setPdfUrl] = useState<string>('');

    useEffect(() => {
        if (myInfo?.work_place?.id) {
            setSelectedWorkPlace(myInfo.work_place.id);
        }
    }, [myInfo]);

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
    const { workPlaces, isLoading: isLoadingWP } = useWorkPlaces();
    const { units, isLoading: isLoadingUnits } = useUnits({
        place_id: selectedWorkPlace || undefined,
    });
    const { employees, isLoading: isLoadingEmp } = useEmployees({
        card_number: selectedCardNumber,
    });

    // Sử dụng basicInforEmployee để lấy dữ liệu cơ bản
    const { basicInforEmployee, isLoading: isLoadingBasic } = useBasicInforEmployee({
        place_id: selectedWorkPlace || 0,
        card_number_list: selectedEmployees,
        unit_id: selectedUnit,
    });

    // Xử lý in thẻ
    const handlePrint = async () => {
        if (!selectedEmployees.length || !selectedWorkPlace) {
            message.warning('Vui lòng chọn nhân viên và nơi làm việc');
            return;
        }

        setLoading(true);
        try {
            if (!basicInforEmployee || basicInforEmployee.length === 0) {
                toast.error('Không tìm thấy dữ liệu nhân viên');
                return;
            }
            let pdfBlobUrl: string;
            switch (selectedType) {
                case 1:
                    pdfBlobUrl = await PrintCardEmployee(basicInforEmployee, selectedWorkPlace);
                    setPdfUrl(pdfBlobUrl);
                    break;
                case 2:
                    pdfBlobUrl = await PrintLeaveDocument(basicInforEmployee, selectedWorkPlace);
                    setPdfUrl(pdfBlobUrl);
                    break;
            }

            toast.success('PDF đã được tạo thành công');
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    };

    const typeOptions = [
        { id: 1, name: 'Employee Card' },
        { id: 2, name: 'Leave Card' },
    ];

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
                    className="min-w-[250px]"
                    placeholder="Select Employee"
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
                    loading={loading || isLoadingBasic}
                >
                    Print
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
