'use client';
import { fabricManagementTypeServices } from '@/apis/services/fabricManagementType';
import { fabricManagementTypeTestServices } from '@/apis/services/fabricManagementTypeTest';
import { useAnalysisDataFabricTest } from '@/apis/useSwr/analysisDataFabric';
import { useFabricManagementTypes } from '@/apis/useSwr/fabricManagementType';
import { useFabricManagementTypesTests } from '@/apis/useSwr/fabricManagementTypeTest';
import { GenericTable } from '@/components/common/GenericTable';
import ModalConfirm from '@/components/common/ModalConfirm';
import FabricManagementTypeForm from '@/components/forms/FabricManagementTypeForm';
import FabricManagementTypeTestForm from '@/components/forms/FabricManagementTypeTestForm';
import AnalysisDataFabricTest from '@/components/ui/AnalysisDataFabricTest';
import FabricSectionInformation from '@/components/ui/FabricSectionInformation';
import FabricTestMultiImportTable from '@/components/ui/FabricTestMultiImportTable';
import { FabricManagementTypeResponseType } from '@/types/response/fabricManagementType';
import { FabricTypeTestResponseType } from '@/types/response/fabricTest';
import { useFabricTypeTestCols } from '@/utils/constants/cols/fabricTypeTestCols';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { FileExcelFilled, ReloadOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Tabs } from 'antd';
import { AppWindow, ChartArea, FileSpreadsheet, Pen, Plus, Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

function FabricRd() {
    const { t } = useTranslationCustom();
    const {
        fabricManagemnentTypes,
        isLoading: isLoadingFabricManagementType,
        mutate: mutateFabricManagementType,
    } = useFabricManagementTypes();

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [key, setKey] = useState<string>('');
    const [selectedFabric, setSelectedFabric] = useState<
        FabricManagementTypeResponseType | undefined
    >(fabricManagemnentTypes?.[0]);

    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        if (!selectedFabric && fabricManagemnentTypes && fabricManagemnentTypes.length > 0) {
            setSelectedFabric(fabricManagemnentTypes[0]);
        }
    }, [fabricManagemnentTypes, selectedFabric]);

    const code = useMemo(() => selectedFabric?.fabric_code, [selectedFabric]);

    const {
        fabricManagemnentTypesTests,
        isLoading: isLoadingfabricManagemnentTypesTests,
        mutate: mutatefabricManagemnentTypesTests,
    } = useFabricManagementTypesTests({ code: code });

    const { analysisDataFabricTest, isLoading: isLoadingAnalysisDataFabricTest } =
        useAnalysisDataFabricTest({ code: code });

    const [selectedFabricTest, setSelectedFabricTest] = useState<
        FabricTypeTestResponseType | undefined
    >(fabricManagemnentTypesTests?.[0]);

    const openModalConfirm = (key: string, record?: FabricTypeTestResponseType) => {
        setKey(key);
        setIsOpenModalConfirm(true);
        setSelectedFabricTest(record);
    };
    const closeModalConfirm = () => {
        setIsOpenModalConfirm(false);
        setKey('');
        setSelectedFabricTest(undefined);
    };

    const handleConfirm = async () => {
        try {
            switch (key) {
                case 'delete_fabric':
                    if (!selectedFabric) return;
                    if (selectedFabric.data_source !== 'ttri') {
                        await fabricManagementTypeServices.remove(selectedFabric?.fabric_code);
                        toast.success('successed');
                        mutateFabricManagementType();
                        closeModalConfirm();
                    }
                case 'delete_fabric_test':
                    if (!selectedFabricTest) return;
                    await fabricManagementTypeTestServices.remove(selectedFabricTest?.id);
                    toast.success('successed');
                    mutatefabricManagemnentTypesTests();
                    closeModalConfirm();
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    const openModal = (
        key: string,
        record?: FabricManagementTypeResponseType,
        recordTest?: FabricTypeTestResponseType,
    ) => {
        setIsOpenModal(true);
        if (record) setSelectedFabric(record);
        setKey(key);
        setSelectedFabricTest(recordTest);
    };
    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedFabricTest(undefined);
        setKey('');
    };
    const fabricTypeCols = useFabricTypeTestCols({ open: openModal, openModalConfirm });

    useEffect(() => {
        switch (key) {
            case 'create_fabric':
                setTitle(`${t.fabric_management_type.page.add}`);
                break;
            case 'modify_fabric':
                setTitle(`${t.fabric_management_type.page.modify}`);
                break;
            case 'create_fabric_test':
                setTitle(`${t.fabric_management_type.page.create_fabric_test}`);
                break;
            case 'modify_fabric_test':
                setTitle(`${t.fabric_management_type.page.modify_fabric_test}`);
                break;
            case 'analysis':
                setTitle(`${t.fabric_management_type.analysis.title}`);
                break;
            default:
                setTitle('');
        }
    }, [key, t]);

    const renderContent = () => {
        switch (key) {
            case 'create_fabric': {
                return (
                    <FabricManagementTypeForm
                        key={key + (selectedFabric?.fabric_code ?? '')}
                        close={closeModal}
                        mutate={mutateFabricManagementType}
                    />
                );
            }
            case 'modify_fabric': {
                return (
                    <FabricManagementTypeForm
                        key={key + (selectedFabric?.fabric_code ?? '')}
                        close={closeModal}
                        mutate={mutateFabricManagementType}
                        record={selectedFabric}
                        setSelectedRecord={setSelectedFabric}
                    />
                );
            }
            case 'create_fabric_test': {
                return (
                    <>
                        {selectedFabric && (
                            <FabricManagementTypeTestForm
                                key={key + (selectedFabric?.fabric_code ?? '')}
                                close={closeModal}
                                mutate={mutatefabricManagemnentTypesTests}
                                code={selectedFabric?.fabric_code}
                            />
                        )}
                    </>
                );
            }
            case 'modify_fabric_test': {
                return (
                    <>
                        {selectedFabric && (
                            <FabricManagementTypeTestForm
                                key={key + (selectedFabric?.fabric_code ?? '')}
                                close={closeModal}
                                mutate={mutatefabricManagemnentTypesTests}
                                record={selectedFabricTest}
                                code={selectedFabric?.fabric_code}
                            />
                        )}
                    </>
                );
            }
            case 'analysis': {
                return (
                    <>
                        {analysisDataFabricTest && (
                            <AnalysisDataFabricTest
                                key={key + (analysisDataFabricTest?.fabric_code ?? '')}
                                analysis={analysisDataFabricTest}
                                isLoading={isLoadingAnalysisDataFabricTest}
                            />
                        )}
                    </>
                );
            }
        }
    };

    const handleReload = () => {
        mutateFabricManagementType();
        mutatefabricManagemnentTypesTests();
    };

    const tabs = [
        {
            key: '1',
            label: t.fabric_management_type.page.normal_table,
            children: (
                <>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Button
                                    icon={<Plus className="!text-green-700 size-[14px]" />}
                                    onClick={() => openModal('create_fabric_test')}
                                >
                                    {t.fabric_management_type.page.add_test}
                                </Button>
                                <Button
                                    icon={
                                        <FileExcelFilled className="!text-purple-700 size-[14px]" />
                                    }
                                >
                                    {t.fabric_management_type.page.import_test}
                                </Button>
                            </div>
                            <Button
                                icon={<ChartArea className="!text-purple-700 size-[14px]" />}
                                onClick={() => openModal('analysis')}
                                disabled={analysisDataFabricTest?.fabric_test_data.length === 0}
                            >
                                {t.fabric_management_type.page.data_analysis}
                            </Button>
                        </div>
                        <GenericTable<FabricTypeTestResponseType>
                            columns={fabricTypeCols}
                            dataSource={fabricManagemnentTypesTests || []}
                            rowKey="stt"
                            isLoading={isLoadingfabricManagemnentTypesTests}
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
                </>
            ),
            icon: <AppWindow strokeWidth={1.5} />,
        },
        {
            key: '2',
            label: t.fabric_management_type.page.excel_table,
            children: (
                <>
                    {selectedFabric && fabricManagemnentTypesTests && (
                        <FabricTestMultiImportTable
                            selectedFabric={selectedFabric}
                            mutate={mutatefabricManagemnentTypesTests}
                            fabricManagemnentTypesTests={fabricManagemnentTypesTests}
                        />
                    )}
                </>
            ),
            icon: <FileSpreadsheet strokeWidth={1.5} />,
        },
    ];
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-[10px]">
                <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-[16px]">
                        {t.fabric_management_type.page.choose_fabric}
                    </p>
                    <Button
                        icon={<ReloadOutlined className="!text-orange-500 size-[14px]" />}
                        onClick={() => handleReload()}
                    />
                </div>
                <div className="flex items-end gap-2">
                    <div className="flex flex-col gap-2">
                        <span className="font-medium">
                            {t.fabric_management_type.form.fabric_code}
                        </span>
                        <Select
                            value={selectedFabric?.fabric_code}
                            onChange={(value) => {
                                const selected = fabricManagemnentTypes?.find(
                                    (item) => item.fabric_code === value,
                                );
                                setSelectedFabric(selected);
                            }}
                            loading={isLoadingFabricManagementType}
                            className="w-[300px]"
                            options={fabricManagemnentTypes?.map((item) => ({
                                value: item.fabric_code,
                                label: item.fabric_code,
                            }))}
                            showSearch
                        />
                    </div>
                    <Button
                        icon={<Plus className="!text-green-700 size-[14px]" />}
                        onClick={() => openModal('create_fabric')}
                    >
                        {t.fabric_management_type.page.add}
                    </Button>
                    <Button
                        icon={<Pen className="!text-blue-700 size-[14px]" />}
                        onClick={() => openModal('modify_fabric', selectedFabric)}
                    >
                        {t.fabric_management_type.page.modify}
                    </Button>
                    <Button
                        icon={<Trash className="!text-red-700 size-[14px]" />}
                        onClick={() => openModalConfirm('delete_fabric')}
                        disabled={!selectedFabric || selectedFabric.data_source === 'ttri'}
                    >
                        {t.fabric_management_type.page.remove}
                    </Button>
                </div>
                {selectedFabric && <FabricSectionInformation selectedFabric={selectedFabric} />}
            </div>
            <Tabs defaultActiveKey="1" items={tabs} />

            <Modal
                centered
                open={isOpenModal}
                onCancel={closeModal}
                footer={false}
                width={1200}
                title={title}
            >
                {renderContent()}
            </Modal>
            <ModalConfirm
                isOpen={isOpenModalConfirm}
                confirmAndClose={() => {
                    handleConfirm();
                }}
                toggleModal={closeModalConfirm}
            />
        </div>
    );
}

export default FabricRd;
