import { FabricManagementTypeResponseType } from '@/types/response/fabricManagementType';
import { FabricTypeTestResponseType } from '@/types/response/fabricTest';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Popover, TableColumnsType } from 'antd';
import { Pen, Settings, Trash } from 'lucide-react';

interface params {
    open: (
        key: string,
        recordFabric?: FabricManagementTypeResponseType,
        record?: FabricTypeTestResponseType,
    ) => void;
    openModalConfirm: (key: string, record?: FabricTypeTestResponseType) => void;
}
export const useFabricTypeTestCols = ({
    open,
    openModalConfirm,
}: params): TableColumnsType<FabricTypeTestResponseType> => {
    const { t } = useTranslationCustom();

    return [
        {
            title: 'Stt',
            width: 60,
            dataIndex: 'stt',
            key: 'stt',
            fixed: 'left',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t.fabric_management_type.form.temperature,
            dataIndex: 'temperature',
            key: 'temperature',
            width: 60,
            render: (_, record: FabricTypeTestResponseType) => <p>{record?.temperature}°C</p>,
        },
        {
            title: t.fabric_management_type.form.duration,
            dataIndex: 'duration',
            key: 'duration',
            width: 60,
            render: (_, record: FabricTypeTestResponseType) => <p>{record?.duration}'</p>,
        },
        {
            title: t.fabric_management_type.form.fabric_weight,
            dataIndex: 'fabric_weight',
            key: 'fabric_weight',
            width: 200,
            render: (_, record: FabricTypeTestResponseType) => {
                const ratio =
                    ((record?.pre_wash_weight - record?.post_wash_weight) /
                        record?.pre_wash_weight) *
                    100;

                return (
                    <div className="flex flex-col gap-2 p-2">
                        <div className="flex flex-col gap-2 border-b border-b-gray-300">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-gray-500 font-medium">
                                    {t.fabric_management_type.page.pre_wash}
                                </p>
                                <p className="font-medium">{record?.pre_wash_weight ?? '-'}</p>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-gray-500 font-medium">
                                    {t.fabric_management_type.page.post_wash}
                                </p>
                                <p className="font-medium">{record?.post_wash_weight ?? '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-gray-500 font-medium">
                                {t.fabric_management_type.page.ratio}
                            </p>
                            <p className="font-medium text-red-500">{`${ratio.toFixed(2) ?? '-'}%`}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            title: t.fabric_management_type.form.warp_density,
            dataIndex: 'warp_density',
            key: 'warp_density',
            width: 200,
            render: (_, record: FabricTypeTestResponseType) => {
                const ratio =
                    ((record?.pre_wash_warp - record?.post_wash_warp) / record?.pre_wash_warp) *
                    100;

                return (
                    <div className="flex flex-col gap-2 p-2">
                        <div className="flex flex-col gap-2 border-b border-b-gray-300">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-gray-500 font-medium">
                                    {t.fabric_management_type.page.pre_wash}
                                </p>
                                <p className="font-medium">{record?.pre_wash_warp ?? '-'}</p>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-gray-500 font-medium">
                                    {t.fabric_management_type.page.post_wash}
                                </p>
                                <p className="font-medium">{record?.post_wash_warp ?? '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-gray-500 font-medium">
                                {t.fabric_management_type.page.ratio}
                            </p>
                            <p className="font-medium text-red-500">{`${ratio.toFixed(2) ?? '-'}%`}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            title: t.fabric_management_type.form.weft_density,
            dataIndex: 'weft_density',
            key: 'weft_density',
            width: 200,
            render: (_, record: FabricTypeTestResponseType) => {
                const ratio =
                    ((record?.pre_wash_weft - record?.post_wash_weft) / record?.pre_wash_weft) *
                    100;

                return (
                    <div className="flex flex-col gap-2 p-2">
                        <div className="flex flex-col gap-2 border-b border-b-gray-300">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-gray-500 font-medium">
                                    {t.fabric_management_type.page.pre_wash}
                                </p>
                                <p className="font-medium">{record?.pre_wash_weft ?? '-'}</p>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-gray-500 font-medium">
                                    {t.fabric_management_type.page.post_wash}
                                </p>
                                <p className="font-medium">{record?.post_wash_weft ?? '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-gray-500 font-medium">
                                {t.fabric_management_type.page.ratio}
                            </p>
                            <p className="font-medium text-red-500">{`${ratio.toFixed(2) ?? '-'}%`}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            title: t.fabric_management_type.form.test_date,
            dataIndex: 'test-date',
            key: 'test-date',
            width: 100,
            render: (_, record: FabricTypeTestResponseType) => <p>{record?.test_date ?? '-'}</p>,
        },
        {
            title: t.fabric_management_type.form.notes,
            dataIndex: 'notes',
            key: 'notes',
            width: 100,
            render: (_, record: FabricTypeTestResponseType) => <p>{record?.notes ?? '-'}</p>,
        },
        {
            title: t.utils.actions,
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (_, record: FabricTypeTestResponseType) => (
                <div className="flex items-center justify-center">
                    <Popover
                        trigger={'click'}
                        content={
                            <div className="flex flex-col gap-2">
                                <Button
                                    icon={<Pen className="size-[14px] !text-blue-700" />}
                                    onClick={() => open('modify_fabric_test', undefined, record)}
                                >
                                    {t.common.forms.edit}
                                </Button>
                                <Button
                                    icon={<Trash className="size-[14px] !text-red-700" />}
                                    onClick={() => openModalConfirm('delete_fabric_test', record)}
                                >
                                    {t.common.forms.delete}
                                </Button>
                            </div>
                        }
                    >
                        <Button icon={<Settings className="size-[14px] !text-green-700" />} />
                    </Popover>
                </div>
            ),
            fixed: 'right',
        },
    ];
};
