'use client';

import { useState, useEffect } from 'react';
import { PdfViewer } from '@/components/common/PdfViewer';
import { useEmployees } from '@/apis/useSwr/employees';
import { useUnits } from '@/apis/useSwr/units';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { getInfomation } from '@/utils/functions/getInfomation';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Select, Spin } from 'antd';
import { IdCard } from 'lucide-react';
import { UserInfo } from '@/types/response/auth';

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
    const [selectedType, setSelectedType] = useState<number>();
    const [pdfUrl, setPdfUrl] = useState<string>('/files/blank.pdf');

    useEffect(() => {
        if (myInfo?.work_place?.id) {
            setSelectedWorkPlace(myInfo.work_place.id);
        }
    }, [myInfo]);

    const { workPlaces, isLoading: isLoadingWP } = useWorkPlaces();
    const { units, isLoading: isLoadingUnits } = useUnits({
        place_id: selectedWorkPlace || undefined,
    });
    const { employees, isLoading: isLoadingEmp } = useEmployees({
        card_number: selectedCardNumber,
    });

    // Xử lý in thẻ
    const handlePrint = async () => {
        if (!selectedEmployees.length || !selectedWorkPlace) return;
        setLoading(true);
        // TODO: implement getBasicEmployee phù hợp backend của bạn
        // const data = await getBasicEmployee(selectedWorkPlace, selectedEmployees, selectedUnit);
        let pdf;
        if (selectedType === 1) {
            // pdf = await printLeaveDoc(data);
            pdf = '/files/blank.pdf'; // placeholder
        } else {
            // pdf = await printCardEmployee(data);
            pdf = '/files/blank.pdf'; // placeholder
        }
        setPdfUrl(pdf);
        setLoading(false);
    };

    const typeOptions = [
        { id: 1, name: 'Leave card' },
        { id: 2, name: 'Employee card' },
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
                >
                    Print
                </Button>
            </div>

            <div className="bg-gray-100 rounded-2xl p-2">
                {loading ? <Spin /> : pdfUrl && <PdfViewer url={pdfUrl} />}
            </div>
        </div>
    );
}
