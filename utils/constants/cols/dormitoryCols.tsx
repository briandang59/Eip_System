import { DormitoriesResponseType } from '@/types/response/dormitories';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Popover, TableColumnsType } from 'antd';
import { Pen, Settings, Trash } from 'lucide-react';

interface params {
    openModal: (key: string, record?: DormitoriesResponseType) => void;
}
export const useDormitoriesCols = ({
    openModal,
}: params): TableColumnsType<DormitoriesResponseType> => {
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
            title: `${t.utils.name} (en)`,
            dataIndex: 'name_en',
            key: 'name_en',
            width: 200,
            render: (text: string) => (
                <div className="line-clamp-2">{text !== null ? text : '-'}</div>
            ),
        },
        {
            title: `${t.utils.name} (vn)`,
            dataIndex: 'name_vn',
            key: 'name_vn',
            width: 200,
            render: (text: string) => (
                <div className="line-clamp-2">{text !== null ? text : '-'}</div>
            ),
        },
        {
            title: `${t.utils.name} (zh)`,
            dataIndex: 'name_zh',
            key: 'name_zh',
            width: 200,
            render: (text: string) => (
                <div className="line-clamp-2">{text !== null ? text : '-'}</div>
            ),
        },
        {
            title: `${t.utils.code}`,
            dataIndex: 'code',
            key: 'code',
            width: 200,
            render: (text: string) => (
                <div className="line-clamp-2">{text !== null ? text : '-'}</div>
            ),
        },
        {
            title: `${t.utils.capacity}`,
            dataIndex: 'capacity',
            key: 'capacity',
            width: 200,
            render: (text: string) => (
                <div className="line-clamp-2">{text !== null ? text : '-'}</div>
            ),
        },
        {
            title: `${t.utils.note}`,
            dataIndex: 'note',
            key: 'note',
            width: 200,
            render: (text: string) => (
                <div className="line-clamp-2">{text !== null ? text : '-'}</div>
            ),
        },

        {
            title: t.utils.actions,
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (_, record: DormitoriesResponseType) => {
                return (
                    <div>
                        <Popover
                            content={
                                <div className="flex flex-col gap-2">
                                    <Button
                                        icon={<Pen className="size-[14px] !text-blue-700" />}
                                        onClick={() => openModal('modify', record)}
                                    >
                                        {t.common.forms.edit}
                                    </Button>
                                    <Button
                                        icon={<Trash className="size-[14px] !text-red-700" />}
                                        onClick={() => openModal('delete', record)}
                                    >
                                        {t.common.forms.delete}
                                    </Button>
                                </div>
                            }
                            trigger="click"
                        >
                            <Button icon={<Settings className="size-[14px] !text-green-700" />} />
                        </Popover>
                    </div>
                );
            },
            fixed: 'right',
        },
    ];
};
