'use client';

import { useEmployees } from '@/apis/useSwr/employees';
import { useEmployeeState } from '@/apis/useSwr/employeeState';
import { useTransferEmployee } from '@/apis/useSwr/transferEmployees';
import { useUnits } from '@/apis/useSwr/units';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import ClientOnly from '@/components/common/ClientOnly';
import { GenericTable } from '@/components/common/GenericTable';
import { EmployeeResponseType } from '@/types/response/employees';
import { TransferEmployeesResponseType } from '@/types/response/transferEmployees';
import { useEmployeeCols } from '@/utils/constants/cols/employeeCols';
import { useTransferCols } from '@/utils/constants/cols/tranferCols';
import { getInfomation } from '@/utils/functions/getInfomation';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { FileOutlined, ImportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import { useState } from 'react';

function EmployeesPage() {
    const { t, lang } = useTranslationCustom();
    const { workPlaces, isLoading: isLoadingWorkPlaces } = useWorkPlaces();
    const { employeeState, isLoading: isLoadingEmployeeState } = useEmployeeState();
    const [selectedUnit, setSelectedUnit] = useState<number | undefined>(undefined);
    const [selectedState, setSelectedState] = useState<number | undefined>(undefined);
    const [search, setSearch] = useState<string>('');
    const myInfo = getInfomation();
    const [selectedWorkPlace, setSelectedWorkPlace] = useState<number>(myInfo?.work_place_id || 0);
    const {
        employees,
        isLoading: isLoadingEmployees,
        mutate: mutateEmployee,
    } = useEmployees(
        {
            place_id: selectedWorkPlace,
            unit_id: selectedUnit,
        },
        {
            search,
            state: selectedState,
        },
    );
    const { transferEmployee, isLoading: isLoadingTransfer } = useTransferEmployee({
        place_id: selectedWorkPlace,
    });
    const {
        units,
        isLoading: isLoadingUnits,
        mutate: mutateTransfer,
    } = useUnits({ place_id: selectedWorkPlace });

    const employeeCols = useEmployeeCols({ state: selectedState });
    const transferCols = useTransferCols();

    const handleRefresh = () => {
        mutateEmployee();
        mutateTransfer();
    };
    const { exportWithoutSummary: employeeExport } = useExportToExcel(
        employeeCols,
        'Employees',
        'Employees Data',
    );
    const { exportWithoutSummary: employeeTransferExport } = useExportToExcel(
        transferCols,
        'Transfer employee',
        'Transfer employee Data',
    );

    const handleExportExcel = () => {
        const filename = `Employees_data`;

        if (selectedState === 7 && transferEmployee) {
            employeeTransferExport(transferEmployee, filename);
        } else if (selectedState !== 7 && employees) {
            employeeExport(employeeCols, filename);
        }
    };
    return (
        <ClientOnly>
            <div className="flex flex-wrap items-end gap-2 mb-4">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">{t.employee.workplace}</p>
                    <Select
                        options={workPlaces?.map((workPlace) => ({
                            label: workPlace.name_en,
                            value: workPlace.id,
                        }))}
                        placeholder="Select Workplace"
                        className="w-[150px]"
                        loading={isLoadingWorkPlaces}
                        onChange={(value) => setSelectedWorkPlace(value)}
                        value={selectedWorkPlace}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.workday.unit}</span>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select Unit"
                        allowClear
                        value={selectedUnit}
                        onChange={setSelectedUnit}
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '')
                                .toLowerCase()
                                .localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={units?.map((item) => ({
                            label: `${item.code} - ${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                            value: item.id,
                        }))}
                        loading={isLoadingUnits}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.employee.state}</span>
                    <Select
                        options={employeeState?.map((item) => ({
                            label: getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang),
                            value: item.id,
                        }))}
                        placeholder="Select Employee State"
                        allowClear
                        className="w-[200px]"
                        loading={isLoadingEmployeeState}
                        onChange={(value) => setSelectedState(value)}
                        value={selectedState}
                    />
                </div>
                <div className="w-[200px]">
                    <Input.Search
                        placeholder="Search by name"
                        allowClear
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button icon={<PlusOutlined className="!text-green-700" />}>
                    {t.employee.add}
                </Button>
                <Button
                    icon={<FileOutlined className="!text-green-700" />}
                    onClick={handleExportExcel}
                >
                    {t.employee.export}
                </Button>
                <Button icon={<ImportOutlined className="!text-green-700" />}>
                    {t.employee.import}
                </Button>
                <Button
                    icon={<ReloadOutlined className="!text-orange-500" />}
                    onClick={handleRefresh}
                >
                    {t.employee.refresh}
                </Button>
            </div>
            {selectedState === 7 ? (
                <GenericTable<TransferEmployeesResponseType>
                    columns={transferCols}
                    dataSource={transferEmployee || []}
                    rowKey="stt"
                    isLoading={isLoadingTransfer}
                    pagination={{
                        defaultPageSize: 30,
                        pageSizeOptions: ['30', '50'],
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        size: 'default',
                    }}
                />
            ) : (
                <GenericTable<EmployeeResponseType>
                    columns={employeeCols}
                    dataSource={employees || []}
                    rowKey="stt"
                    isLoading={isLoadingEmployees}
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
        </ClientOnly>
    );
}

export default EmployeesPage;
