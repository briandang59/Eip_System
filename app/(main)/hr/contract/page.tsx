'use client';
import { useEmployeeSalaryAllowances } from '@/apis/useSwr/employeeSalaryAllowance';
import { GenericTable } from '@/components/common/GenericTable';
import { SalaryAllowance } from '@/types/response/salaryAllowance';
import { useContractCols } from '@/utils/constants/cols/contractCols';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { Button, DatePicker, Input, Select, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');
import { useState } from 'react';
import { getInfomation } from '@/utils/functions/getInfomation';
import { FileExcelOutlined, FilePdfOutlined, ReloadOutlined } from '@ant-design/icons';
import { useUnits } from '@/apis/useSwr/units';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useEmployees } from '@/apis/useSwr/employees';
import { useContractTypeList } from '@/apis/useSwr/contractTypeList';
import { PdfViewer } from '@/components/common/PdfViewer';
import { toast } from 'sonner';
import { PrintContractOffice } from '@/utils/printing/printContractOffice';
import { IEmployee } from '@/types/printing/IEmployee';
import { useEffect } from 'react';
import { PrintContractCleanerSecurity } from '@/utils/printing/printContractCleanerSecurity';

function ContractPage() {
    const { lang, t } = useTranslationCustom();
    const socialInsurance = useContractCols();
    const { workPlaces, isLoading: isLoadingWorkPlaces } = useWorkPlaces();
    const { units, isLoading: isLoadingUnits } = useUnits();
    const { employees, isLoading: isLoadingEmployees } = useEmployees();
    const { contractTypeList, isLoading: isLoadingContractTypeList } = useContractTypeList();
    const myInfo = getInfomation();
    const [selectedWorkPlace, setSelectedWorkPlace] = useState<number | undefined>(
        myInfo?.work_place_id || undefined,
    );
    const [selectedUnit, setSelectedUnit] = useState<number | undefined>(undefined);
    const [selectedContentType, setSelectedContentType] = useState<number | undefined>(1);
    const [, setSearchValue] = useState<string>('');
    const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | undefined>(undefined);
    const [selectedContractTypeOption, setSelectedContractTypeOption] = useState<number>(1);
    const [selectedUnitClassOption, setSelectedUnitClassOption] = useState<number>(1);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs().tz('Asia/Ho_Chi_Minh'));

    useEffect(() => {
        console.log('Current date from dayjs():', dayjs().format('DD/MM/YYYY'));
        console.log(
            'Current date with timezone:',
            dayjs().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
        );
        console.log('Current date from new Date():', new Date().toLocaleDateString('vi-VN'));
        console.log('Selected date:', selectedDate.format('DD/MM/YYYY'));
    }, []);
    const [loading, setLoading] = useState(false);
    const { employeeSalaryAllowance, isLoading: isLoadingSalaryAllowance } =
        useEmployeeSalaryAllowances({ place_id: selectedWorkPlace || 0 });
    const [webviewerUrl, setWebviewerUrl] = useState<string>('');

    useEffect(() => {
        const loadEmptyPdf = () => {
            const timestamp = Date.now();
            const pdfPath = `/api/pdf?type=empty&t=${timestamp}`;
            setWebviewerUrl(pdfPath);
        };

        loadEmptyPdf();
    }, []);

    useEffect(() => {
        if (!selectedEmployee) {
            const timestamp = Date.now();
            const pdfPath = `/api/pdf?type=empty&t=${timestamp}`;
            setWebviewerUrl(pdfPath);
        }
    }, [selectedEmployee]);

    useEffect(() => {
        console.log(
            'webviewerUrl changed:',
            webviewerUrl ? webviewerUrl.substring(0, 50) + '...' : 'empty',
        );
    }, [webviewerUrl]);
    const contentTypeOptions = [
        { value: 1, label: t.contract_page.contract_salary },
        { value: 2, label: t.contract_page.contract_list },
        { value: 3, label: t.contract_page.print_contract },
    ];
    const [selectedContractType, setSelectedContractType] = useState<number>(1);
    const handleSearch = (value: string) => {
        setSearchValue(value);
    };
    const contractTypeOptions = [
        {
            label: t.contract_page.labour_contract,
            value: 1,
        },
        {
            label: t.contract_page.probationary_contract,
            value: 2,
        },
    ];
    const unitClassOptions = [
        {
            label: t.contract_page.cleaner_security,
            value: 1,
        },
        {
            label: t.contract_page.office_factory,
            value: 2,
        },
    ];

    const handlePrintContract = async () => {
        if (selectedContractTypeOption === 2) {
            toast.warning('Đang phát triển');
            return;
        }

        if (!selectedEmployee) {
            toast.warning('Vui lòng chọn nhân viên');
            return;
        }

        const type = contractTypeList?.find((e) => e.id === selectedContractType);

        if (!type) {
            toast.warning('Vui lòng chọn loại hợp đồng');
            return;
        }

        setLoading(true);
        try {
            const day = selectedDate?.date();
            const month = selectedDate?.month() + 1;
            const year = selectedDate?.year();
            let pdf = '';
            if (selectedUnitClassOption === 2) {
                pdf = await PrintContractOffice(
                    [selectedEmployee],
                    day,
                    month,
                    year,
                    type,
                    selectedContractType,
                    selectedContractType.toString(),
                    employeeSalaryAllowance || [],
                );
            } else {
                pdf = await PrintContractCleanerSecurity(
                    [selectedEmployee],
                    day,
                    month,
                    year,
                    type,
                    selectedContractType,
                    employeeSalaryAllowance || [],
                );
            }
            if (pdf) {
                setWebviewerUrl(pdf);
                toast.success(t.contract_page.toast_success_contract);
            } else {
                toast.error(t.contract_page.toast_error_contract);
            }
        } catch (error) {
            toast.error(t.contract_page.toast_error_contract + ' ' + error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col gap-2">
            {selectedContentType !== 3 ? (
                <div className="flex items-end gap-2 flex-wrap mb-4 ">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">{t.contract_page.workplace}</span>
                        <Select
                            options={
                                workPlaces?.map((wp) => ({ label: wp.name_en, value: wp.id })) || []
                            }
                            value={selectedWorkPlace}
                            onChange={setSelectedWorkPlace}
                            loading={isLoadingWorkPlaces}
                            className="w-[150px]"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">{t.contract_page.type}</span>
                        <Select
                            options={contentTypeOptions}
                            value={selectedContentType}
                            onChange={setSelectedContentType}
                            className="w-[150px]"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">{t.contract_page.unit}</span>
                        <Select
                            options={
                                units?.map((u) => ({
                                    label: `${getLocalizedName(u.name_en, u.name_zh, u.name_vn, lang)}`,
                                    value: u.id,
                                })) || []
                            }
                            value={selectedUnit}
                            onChange={setSelectedUnit}
                            className="w-[200px]"
                            placeholder={t.print_card.unit}
                            loading={isLoadingUnits}
                        />
                    </div>
                    <div className="w-[200px]">
                        <Input.Search placeholder="Search" onSearch={handleSearch} />
                    </div>
                    <div className="flex gap-2">
                        <Button icon={<FileExcelOutlined className="!text-green-700" />}>
                            {t.contract_page.export}
                        </Button>
                        <Button icon={<ReloadOutlined className="!text-orange-500" />}>
                            {t.contract_page.refresh}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-end gap-2 flex-wrap mb-4 ">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">{t.contract_page.workplace}</span>
                        <Select
                            options={
                                workPlaces?.map((wp) => ({ label: wp.name_en, value: wp.id })) || []
                            }
                            value={selectedWorkPlace}
                            onChange={setSelectedWorkPlace}
                            className="w-[150px]"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">{t.contract_page.type}</span>
                        <Select
                            options={contentTypeOptions}
                            value={selectedContentType}
                            onChange={setSelectedContentType}
                            className="w-[150px]"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">{t.contract_page.unit}</span>
                        <Select
                            options={
                                units?.map((u) => ({
                                    label: `${getLocalizedName(u.name_en, u.name_zh, u.name_vn, lang)}`,
                                    value: u.id,
                                })) || []
                            }
                            value={selectedUnit}
                            onChange={setSelectedUnit}
                            className="w-[200px]"
                            placeholder={t.print_card.unit}
                            loading={isLoadingUnits}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">{t.contract_page.employee}</span>
                        <Select
                            options={
                                employees?.map((e) => ({
                                    label: `${e.card_number} - ${e.fullname}`,
                                    value: e.uuid, // Use uuid instead of the entire object
                                })) || []
                            }
                            value={selectedEmployee?.uuid} // Use uuid instead of the entire object
                            onChange={(value) => {
                                const employee = employees?.find((e) => e.uuid === value);
                                setSelectedEmployee(employee as unknown as IEmployee);
                            }}
                            className="w-[250px]"
                            placeholder={t.print_card.employee}
                            loading={isLoadingEmployees}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">{t.contract_page.contract_type}</span>
                        <Select
                            options={contractTypeOptions}
                            value={selectedContractTypeOption}
                            onChange={setSelectedContractTypeOption}
                            className="w-[250px]"
                            placeholder={t.print_card.type}
                            loading={isLoadingContractTypeList}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">{t.contract_page.unit_class}</span>
                        <Select
                            options={unitClassOptions}
                            value={selectedUnitClassOption}
                            onChange={setSelectedUnitClassOption}
                            className="w-[150px]"
                            loading={isLoadingContractTypeList}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">{t.contract_page.date}</span>
                        <DatePicker
                            className="w-[150px]"
                            value={selectedDate}
                            onChange={(date) => {
                                if (date) {
                                    setSelectedDate(date.tz('Asia/Ho_Chi_Minh'));
                                } else {
                                    setSelectedDate(dayjs().tz('Asia/Ho_Chi_Minh'));
                                }
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">{t.contract_page.contract_type}</span>
                        <Select
                            options={contractTypeList?.map((c) => ({
                                label: `${getLocalizedName(c.name_en, c.name_zh, c.name_vn, lang)}`,
                                value: c.id,
                            }))}
                            value={selectedContractType}
                            onChange={setSelectedContractType}
                            className="w-[300px]"
                            placeholder={t.print_card.type}
                            loading={isLoadingContractTypeList}
                        />
                    </div>
                    <Button
                        icon={<FilePdfOutlined />}
                        onClick={handlePrintContract}
                        loading={loading}
                    >
                        {t.contract_page.print}
                    </Button>
                </div>
            )}
            {selectedContentType !== 3 && (
                <GenericTable<SalaryAllowance>
                    columns={socialInsurance}
                    dataSource={employeeSalaryAllowance || []}
                    rowKey="stt"
                    isLoading={isLoadingSalaryAllowance}
                    pagination={{
                        defaultPageSize: 30,
                        pageSizeOptions: ['30', '50'],
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        size: 'default',
                    }}
                />
            )}

            {selectedContentType === 3 && (
                <div className="flex flex-col gap-2">
                    <div className="w-full h-[800px] border border-gray-300 rounded-lg">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <PdfViewer url={webviewerUrl} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContractPage;
