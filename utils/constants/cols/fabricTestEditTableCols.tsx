import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { EditableColumn } from '@/components/common/EditableTable';
import { FabricTypeTestResponseType } from '@/types/response/fabricTest';

interface EditableFabricTypeTestResponseType extends FabricTypeTestResponseType {
    key: React.Key;
}

export const useFabricTestEditTableCols =
    (): EditableColumn<EditableFabricTypeTestResponseType>[] => {
        const { t } = useTranslationCustom();

        return [
            {
                title: t.fabric_management_type.form.temperature,
                dataIndex: 'temperature',
                editable: true,
                width: 100,
            },
            {
                title: t.fabric_management_type.form.duration,
                dataIndex: 'duration',
                editable: true,
                width: 100,
            },
            {
                title: t.fabric_management_type.form.pre_wash_weight,
                dataIndex: 'pre_wash_weight',
                editable: true,
                width: 100,
            },
            {
                title: t.fabric_management_type.form.post_wash_weight,
                dataIndex: 'post_wash_weight',
                editable: true,
                width: 100,
            },
            {
                title: t.fabric_management_type.form.pre_wash_warp,
                dataIndex: 'pre_wash_warp',
                editable: true,
                width: 100,
            },
            {
                title: t.fabric_management_type.form.post_wash_warp,
                dataIndex: 'post_wash_warp',
                editable: true,
                width: 100,
            },
            {
                title: t.fabric_management_type.form.pre_wash_weft,
                dataIndex: 'pre_wash_weft',
                editable: true,
                width: 100,
            },
            {
                title: t.fabric_management_type.form.post_wash_weft,
                dataIndex: 'post_wash_weft',
                editable: true,
                width: 100,
            },
            {
                title: t.fabric_management_type.form.test_date,
                dataIndex: 'test_date',
                editable: true,
                width: 100,
            },
        ];
    };
