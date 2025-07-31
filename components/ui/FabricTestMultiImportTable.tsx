import { useState } from 'react';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { FabricManagementTypeResponseType } from '@/types/response/fabricManagementType';
import { FabricTypeTestResponseType } from '@/types/response/fabricTest';
import { EditableTable } from '../common/EditableTable';
import { useFabricTestEditTableCols } from '@/utils/constants/cols/fabricTestEditTableCols';
import { toast } from 'sonner';
import { fabricManagementTypeTestServices } from '@/apis/services/fabricManagementTypeTest';
import { FabricTypesTestRequestType } from '@/types/requests/fabricTest';

interface EditableFabricTypeTestResponseType extends FabricTypeTestResponseType {
    key: React.Key;
}

interface FabricTestMultiImportTableProps {
    selectedFabric: FabricManagementTypeResponseType;
    mutate: () => void;
    fabricManagemnentTypesTests: FabricTypeTestResponseType[];
}

function FabricTestMultiImportTable({
    selectedFabric,
    mutate,
    fabricManagemnentTypesTests,
}: FabricTestMultiImportTableProps) {
    const { t } = useTranslationCustom();
    const columns = useFabricTestEditTableCols();

    const [dataSource, setDataSource] = useState<EditableFabricTypeTestResponseType[]>(
        fabricManagemnentTypesTests.map((item, index) => ({
            ...item,
            key: item.id.toString() || index.toString(),
        })),
    );

    const [newData, setNewData] = useState<EditableFabricTypeTestResponseType[]>([]);
    const [updatedData, setUpdatedData] = useState<EditableFabricTypeTestResponseType[]>([]);
    const [deletedKeys, setDeletedKeys] = useState<React.Key[]>([]);

    const handleRowEdit = (row: EditableFabricTypeTestResponseType) => {
        const isNew = newData.some((item) => item.key === row.key);
        if (!isNew) {
            setUpdatedData((prev) => {
                const existing = prev.find((item) => item.key === row.key);
                if (existing) {
                    return prev.map((item) => (item.key === row.key ? row : item));
                }
                return [...prev, { ...row, updated_at: new Date().toISOString() }];
            });
        } else {
            setNewData((prev) => prev.map((item) => (item.key === row.key ? row : item)));
        }
        setDataSource((prev) => prev.map((item) => (item.key === row.key ? row : item)));
    };

    const handleDelete = (key: React.Key) => {
        const row = dataSource.find((item) => item.key === key);
        if (!row) {
            return;
        }

        if (newData.some((item) => item.key === key)) {
            setNewData((prev) => prev.filter((item) => item.key !== key));
        } else {
            if (row.id !== 0) {
                setDeletedKeys((prev) => [...prev, key]);
            }
        }

        setDataSource((prev) => prev.filter((item) => item.key !== key));
    };

    const handleSave = async () => {
        try {
            if (!selectedFabric) {
                toast.error(`${t.fabric_management_type.form.no_selected_fabric}`);
                return;
            }

            if (newData.length > 0) {
                const newDataArrayFormatted: FabricTypesTestRequestType[] = newData.map((item) => ({
                    temperature: item.temperature,
                    duration: item.duration,
                    pre_wash_weight: item.pre_wash_weight,
                    post_wash_weight: item.post_wash_weight,
                    pre_wash_warp: item.pre_wash_warp,
                    post_wash_warp: item.post_wash_warp,
                    pre_wash_weft: item.pre_wash_weft,
                    post_wash_weft: item.post_wash_weft,
                    test_date: item.test_date,
                    notes: item.notes,
                }));

                await Promise.all(
                    newDataArrayFormatted.map((data) =>
                        fabricManagementTypeTestServices.add(data, selectedFabric.fabric_code),
                    ),
                );
                toast.success(t.fabric_management_type.form.success_new);
            }

            if (updatedData.length > 0) {
                const updatedDataArrayFormatted: FabricTypesTestRequestType[] = updatedData.map(
                    (item) => ({
                        temperature: item.temperature,
                        duration: item.duration,
                        pre_wash_weight: item.pre_wash_weight,
                        post_wash_weight: item.post_wash_weight,
                        pre_wash_warp: item.pre_wash_warp,
                        post_wash_warp: item.post_wash_warp,
                        pre_wash_weft: item.pre_wash_weft,
                        post_wash_weft: item.post_wash_weft,
                        test_date: item.test_date,
                        notes: item.notes,
                    }),
                );

                await Promise.all(
                    updatedDataArrayFormatted.map((data, index) =>
                        fabricManagementTypeTestServices.modify(data, updatedData[index].id),
                    ),
                );
                toast.success(t.fabric_management_type.form.success_updated);
            }

            if (deletedKeys.length > 0) {
                await Promise.all(
                    deletedKeys.map((key) => {
                        const row = fabricManagemnentTypesTests.find(
                            (item) => item.id.toString() === key.toString(),
                        );
                        if (row && row.id !== 0) {
                            return fabricManagementTypeTestServices.remove(row.id);
                        }
                        return Promise.resolve();
                    }),
                );
                toast.success(t.fabric_management_type.form.success_deleted);
            }

            setNewData([]);
            setUpdatedData([]);
            setDeletedKeys([]);
            mutate();
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleAdd = () => {
        const newRow: EditableFabricTypeTestResponseType = {
            key: Date.now().toString(),
            id: 0,
            fabric_code: selectedFabric?.fabric_code || '',
            temperature: 0,
            duration: 0,
            pre_wash_weight: 0,
            post_wash_weight: 0,
            pre_wash_warp: 0,
            post_wash_warp: 0,
            warp_shrinkage_rate: 0,
            pre_wash_weft: 0,
            post_wash_weft: 0,
            weft_shrinkage_rate: 0,
            test_date: new Date().toISOString().split('T')[0],
            notes: '',
            created_at: new Date().toISOString(),
            updated_at: null,
            fabric_types: {
                customer_id: selectedFabric?.customer_id || '',
                fabric_code: selectedFabric?.fabric_code || '',
                fabric_name: selectedFabric?.fabric_name || '',
            },
        };
        setDataSource((prev) => [newRow, ...prev]);
        setNewData((prev) => [newRow, ...prev]);
    };

    return (
        <div className="flex flex-col gap-4 min-h-[400px]">
            <EditableTable
                columns={columns}
                dataSource={dataSource}
                onSave={handleRowEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
                onSaveAllWithApi={handleSave}
                titleDelete={t.fabric_management_type.form.confirm_delete}
                addButtonText={t.fabric_management_type.form.add_row}
                removeButtonText={t.fabric_management_type.form.delete}
                okText={t.fabric_management_type.form.ok}
                cancelText={t.fabric_management_type.form.cancel}
                saveButtonText={t.fabric_management_type.form.save}
            />
        </div>
    );
}

export default FabricTestMultiImportTable;
