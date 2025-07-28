import { FabricManagementTypeResponseType } from '@/types/response/fabricManagementType';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

interface FabricSectionInformationProps {
    selectedFabric: FabricManagementTypeResponseType;
}
interface RenderItemProps {
    label: string;
    recordText: string | number;
}

function FabricSectionInformation({ selectedFabric }: FabricSectionInformationProps) {
    const { t } = useTranslationCustom();
    const RenderItem = ({ label, recordText }: RenderItemProps) => {
        return (
            <div className="flex flex-col">
                <p className="text-[12px] text-gray-500 font-medium">{label}</p>
                <p className="text-[14px] font-medium">{recordText ?? '-'}</p>
            </div>
        );
    };
    return (
        <div>
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
    );
}

export default FabricSectionInformation;
