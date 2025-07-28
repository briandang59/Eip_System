'use client';
import { fabricManagementTypeServices } from '@/apis/services/fabricManagementType';
import { fabricManagementTypeTestServices } from '@/apis/services/fabricManagementTypeTest';
import { useFabricManagementTypes } from '@/apis/useSwr/fabricManagementType';
import { useFabricManagementTypesTests } from '@/apis/useSwr/fabricManagementTypeTest';
import { GenericTable } from '@/components/common/GenericTable';
import ModalConfirm from '@/components/common/ModalConfirm';
import FabricManagementTypeForm from '@/components/forms/FabricManagementTypeForm';
import FabricManagementTypeTestForm from '@/components/forms/FabricManagementTypeTestForm';
import { FabricManagementTypeResponseType } from '@/types/response/fabricManagementType';
import { FabricTypeTestResponseType } from '@/types/response/fabricTest';
import { useFabricTypeTestCols } from '@/utils/constants/cols/fabricTypeTestCols';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { FileExcelFilled } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { ChartArea, Pen, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface RenderItemProps {
    label: string;
    recordText: string | number;
}
const RenderItem = ({ label, recordText }: RenderItemProps) => {
    return (
        <div className="flex flex-col">
            <p className="text-[12px] text-gray-500 font-medium">{label}</p>
            <p className="text-[14px] font-medium">{recordText ?? '-'}</p>
        </div>
    );
};
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
        if (fabricManagemnentTypes && fabricManagemnentTypes.length > 0 && !selectedFabric) {
            setSelectedFabric(fabricManagemnentTypes[0]);
        }
    }, [fabricManagemnentTypes, selectedFabric]);

    const code = selectedFabric?.fabric_code || fabricManagemnentTypes?.[0]?.fabric_code;
    const {
        fabricManagemnentTypesTests,
        isLoading: isLoadingfabricManagemnentTypesTests,
        mutate: mutatefabricManagemnentTypesTests,
    } = useFabricManagementTypesTests({ code: code });

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
                    await fabricManagementTypeServices.remove(selectedFabric?.fabric_code);
                    toast.success('successed');
                    mutateFabricManagementType();
                    closeModalConfirm();
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
        setSelectedFabric(record);
        setKey(key);
        setSelectedFabricTest(recordTest);
    };
    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedFabric(undefined);
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
        }
    };
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-[10px]">
                <p className="font-medium text-[16px]">
                    {t.fabric_management_type.page.choose_fabric}
                </p>
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
                    >
                        {t.fabric_management_type.page.remove}
                    </Button>
                </div>
                {selectedFabric && (
                    <div className="bg-white min-h-[100px] rounded-[10px] grid grid-cols-6 gap-2 p-2">
                        <RenderItem
                            label={t.fabric_management_type.form.fabric_code}
                            recordText={selectedFabric?.fabric_code}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.customer}
                            recordText={selectedFabric?.customer_id}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.fabric_name}
                            recordText={selectedFabric?.fabric_name}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.fabric_width}
                            recordText={selectedFabric?.fabric_width}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.fabric_weight}
                            recordText={selectedFabric?.fabric_weight}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.warp_density}
                            recordText={selectedFabric?.warp_density}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.weft_density}
                            recordText={selectedFabric?.weft_density}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.machine_warp_density}
                            recordText={selectedFabric?.machine_warp_density}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.machine_weft_density}
                            recordText={selectedFabric?.machine_weft_density}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.raw_fabric_warp_density}
                            recordText={selectedFabric?.raw_fabric_warp_density}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.raw_fabric_weft_density}
                            recordText={selectedFabric?.raw_fabric_weft_density}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.raw_fabric_spec}
                            recordText={selectedFabric?.raw_fabric_spec}
                        />
                        <RenderItem
                            label={t.fabric_management_type.form.finished_product_spec}
                            recordText={selectedFabric?.finished_product_spec}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Button
                            icon={<Plus className="!text-green-700 size-[14px]" />}
                            onClick={() => openModal('create_fabric_test')}
                        >
                            {t.fabric_management_type.page.add_test}
                        </Button>
                        <Button icon={<FileExcelFilled className="!text-purple-700 size-[14px]" />}>
                            {t.fabric_management_type.page.export_test}
                        </Button>
                    </div>
                    <Button icon={<ChartArea className="!text-purple-700 size-[14px]" />}>
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
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        size: 'default',
                    }}
                />
            </div>
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
