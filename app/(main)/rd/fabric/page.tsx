'use client';
import { useFabricManagementTypes } from '@/apis/useSwr/fabricManagementType';
import FabricManagementTypeForm from '@/components/forms/FabricManagementTypeForm';
import { FabricManagementTypeResponseType } from '@/types/response/fabricManagementType';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Modal, Select } from 'antd';
import { Pen, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

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
        mutate,
    } = useFabricManagementTypes();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [key, setKey] = useState<string>('');
    const [selectedFabric, setSelectedFabric] = useState<
        FabricManagementTypeResponseType | undefined
    >(fabricManagemnentTypes?.[0]);

    useEffect(() => {
        if (fabricManagemnentTypes && fabricManagemnentTypes.length > 0 && !selectedFabric) {
            setSelectedFabric(fabricManagemnentTypes[0]);
        }
    }, [fabricManagemnentTypes, selectedFabric]);

    const openModal = (key: string, record?: FabricManagementTypeResponseType) => {
        setIsOpenModal(true);
        setSelectedFabric(record);
        setKey(key);
    };
    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedFabric(undefined);
        setKey('');
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
            <Modal
                centered
                open={isOpenModal}
                onCancel={closeModal}
                footer={false}
                width={1200}
                title={
                    key === 'create_fabric'
                        ? `${t.fabric_management_type.page.add}`
                        : `${t.fabric_management_type.page.modify}`
                }
            >
                <FabricManagementTypeForm
                    key={key + (selectedFabric?.fabric_code ?? '')}
                    close={closeModal}
                    mutate={mutate}
                    record={key === 'modify_fabric' ? selectedFabric : undefined}
                />
            </Modal>
        </div>
    );
}

export default FabricRd;
