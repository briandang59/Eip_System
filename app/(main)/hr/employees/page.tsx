'use client';

import { useDailyCareerRecord } from '@/apis/useSwr/dailyCareerRecord';
import { useEmployees } from '@/apis/useSwr/employees';
import { useEmployeeState } from '@/apis/useSwr/employeeState';
import { useTransferEmployee } from '@/apis/useSwr/transferEmployees';
import { useUnits } from '@/apis/useSwr/units';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import ClientOnly from '@/components/common/ClientOnly';
import { GenericTable } from '@/components/common/GenericTable';
import AssignShiftForm from '@/components/forms/AssignShiftForm';
import ProfileForm from '@/components/forms/ProfileForm';
import PromoteForm from '@/components/forms/PromoteForm';
import ReinstateForm from '@/components/forms/ReinstateForm';
import ResignForm from '@/components/forms/ResignForm';
import TransferForm from '@/components/forms/TransferForm';
import ProfileUI from '@/components/ui/profileUI';
import { CareerHistoryResponseType } from '@/types/response/dailyCareerRecord';
import { EmployeeResponseType } from '@/types/response/employees';
import { TransferEmployeesResponseType } from '@/types/response/transferEmployees';
import { useDailyCareerRecordCols } from '@/utils/constants/cols/dailyCareerRecord';
import { useEmployeeCols } from '@/utils/constants/cols/employeeCols';
import { useTransferCols } from '@/utils/constants/cols/tranferCols';
import { getInfomation } from '@/utils/functions/getInfomation';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { FileOutlined, ImportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select, Tabs } from 'antd';
import { Brush, User } from 'lucide-react';
import { useEffect, useState } from 'react';

function EmployeesPage() {
    const { t, lang } = useTranslationCustom();
    const { workPlaces, isLoading: isLoadingWorkPlaces } = useWorkPlaces();
    const { employeeState, isLoading: isLoadingEmployeeState } = useEmployeeState();
    const [selectedUnit, setSelectedUnit] = useState<number | undefined>(undefined);
    const [selectedState, setSelectedState] = useState<number>();
    const [search, setSearch] = useState<string>('');
    const myInfo = getInfomation();
    const [selectedWorkPlace, setSelectedWorkPlace] = useState<number>(myInfo?.work_place_id || 0);
    const [selectedUUID, setSelectedUUID] = useState<string>('');
    const [key, setKey] = useState<string>('');
    const [selectedRecord, setSelectedRecord] = useState<EmployeeResponseType>();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const { dailyCareerRecord, isLoading: isLoadingDaily } = useDailyCareerRecord({
        uuid: selectedUUID,
    });

    useEffect(() => {
        if (!selectedState && employeeState && employeeState.length > 0) {
            setSelectedState(employeeState[0].id);
        }
    }, [employeeState, selectedState]);

    const hanldeToggleModal = (key: string) => {
        setIsOpenModal(!isOpenModal);
        switch (key) {
            case 'career_record':
                setKey(key);
                break;
            case 'profile':
                setKey(key);
                break;
            case 'create_profile':
                setKey(key);
                break;
            case 'modify_profile':
                setKey(key);
                break;
            case 'process_multiple_task':
                setKey(key);
                break;
        }
    };
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

    const employeeCols = useEmployeeCols({
        state: selectedState,
        setSelectedKey: hanldeToggleModal,
        setSelectedUUID,
        setSelectedRecord,
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>();
    const [selectcedRecordRow, setSelectedRecordRow] = useState<EmployeeResponseType[]>();
    const onSelectChange = (
        newSelectedRowKeys: React.Key[],
        selectedRows: EmployeeResponseType[],
    ) => {
        console.log(newSelectedRowKeys);
        console.log(selectedRows);
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRecordRow(selectedRows);
    };
    const rowSelection = {
        type: 'checkbox' as const,
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const transferCols = useTransferCols();
    const dailyRecord = useDailyCareerRecordCols();

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

    const renderModal = () => {
        switch (key) {
            case 'career_record': {
                return (
                    <div className="min-h-[300px] flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <p className="text-[20px] font-bold text-green-700">
                                {selectedRecord?.fullname}
                            </p>
                            <p className="text-[20px] font-bold text-green-700">
                                {selectedRecord?.card_number}
                            </p>
                        </div>
                        <GenericTable<CareerHistoryResponseType>
                            columns={dailyRecord}
                            dataSource={dailyCareerRecord || []}
                            rowKey={'stt'}
                            isLoading={isLoadingDaily}
                            pagination={{
                                defaultPageSize: 30,
                                pageSizeOptions: ['30', '50'],
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items`,
                                size: 'default',
                            }}
                        />
                    </div>
                );
            }
            case 'profile': {
                return (
                    <div className="min-h-[300px] flex flex-col gap-4">
                        <ProfileUI employee={selectedRecord} />
                    </div>
                );
            }
            case 'create_profile': {
                return (
                    <div className="min-h-[300px] flex flex-col gap-4">
                        <ProfileForm
                            close={() => hanldeToggleModal('create_profile')}
                            mutate={mutateEmployee}
                        />
                    </div>
                );
            }
            case 'modify_profile': {
                return (
                    <div className="min-h-[300px] flex flex-col gap-4">
                        <ProfileForm
                            employee_modify={selectedRecord}
                            close={() => hanldeToggleModal('modify_profile')}
                            mutate={mutateEmployee}
                        />
                    </div>
                );
            }
            case 'process_multiple_task': {
                const tabs = [
                    {
                        key: '1',
                        label: `AssignShiftForm`,
                        children: (
                            <>
                                {selectcedRecordRow && (
                                    <AssignShiftForm
                                        card_number={selectcedRecordRow[0]?.card_number}
                                        mutate={mutateEmployee}
                                        close={() => hanldeToggleModal('process_multiple_task')}
                                    />
                                )}
                            </>
                        ),
                        icon: <User strokeWidth={1.5} />,
                    },
                    {
                        key: '2',
                        label: `PromoteForm`,
                        children: (
                            <>
                                {selectcedRecordRow && (
                                    <PromoteForm
                                        uuid={selectcedRecordRow[0]?.uuid}
                                        card_number={selectcedRecordRow[0]?.card_number}
                                        mutate={mutateEmployee}
                                        close={() => hanldeToggleModal('process_multiple_task')}
                                    />
                                )}
                            </>
                        ),
                        icon: <User strokeWidth={1.5} />,
                    },
                    {
                        key: '3',
                        label: `TransferForm`,
                        children: (
                            <>
                                {selectcedRecordRow && (
                                    <TransferForm
                                        uuid={selectcedRecordRow[0]?.uuid}
                                        card_number={selectcedRecordRow[0]?.card_number}
                                        mutate={mutateEmployee}
                                        close={() => hanldeToggleModal('process_multiple_task')}
                                    />
                                )}
                            </>
                        ),
                        icon: <User strokeWidth={1.5} />,
                    },
                    {
                        key: '4',
                        label: `ResignForm`,
                        children: (
                            <>
                                {selectcedRecordRow && (
                                    <ResignForm
                                        card_number={selectcedRecordRow[0]?.card_number}
                                        mutate={mutateEmployee}
                                        close={() => hanldeToggleModal('process_multiple_task')}
                                    />
                                )}
                            </>
                        ),
                        icon: <User strokeWidth={1.5} />,
                    },
                    {
                        key: '5',
                        label: `Reinstate`,
                        children: (
                            <>
                                {selectcedRecordRow && (
                                    <ReinstateForm
                                        card_number={selectcedRecordRow[0]?.card_number}
                                        mutate={mutateEmployee}
                                        close={() => hanldeToggleModal('process_multiple_task')}
                                    />
                                )}
                            </>
                        ),
                        icon: <User strokeWidth={1.5} />,
                    },
                ];
                return (
                    <div className="min-h-[500px] flex flex-col gap-4">
                        {selectcedRecordRow && (
                            <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[10px] border border-green-700 w-fit">
                                <p className="font-medium text-green-700 flex items-center gap-2">
                                    {selectcedRecordRow[0]?.fullname} -{' '}
                                    {selectcedRecordRow[0]?.card_number} -{' '}
                                    {selectcedRecordRow[0]?.work_place.name_en} -{' '}
                                    {selectcedRecordRow[0]?.unit?.name_en}
                                </p>
                            </div>
                        )}
                        <Tabs defaultActiveKey="1" items={tabs} />
                    </div>
                );
            }
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
                <Button
                    icon={<PlusOutlined className="!text-green-700" />}
                    onClick={() => hanldeToggleModal('create_profile')}
                >
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

                <Button
                    icon={<Brush className="!text-blue-500 size-[14px]" />}
                    onClick={() => hanldeToggleModal('process_multiple_task')}
                    disabled={selectcedRecordRow && selectcedRecordRow?.length === 0}
                >
                    {`Process`}
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
                    rowSelection={rowSelection}
                />
            )}
            <Modal
                open={isOpenModal}
                footer={null}
                centered
                onCancel={() => hanldeToggleModal(key)}
                width={1000}
            >
                {renderModal()}
            </Modal>
        </ClientOnly>
    );
}

export default EmployeesPage;
