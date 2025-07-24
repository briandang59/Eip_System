import { LanguageResponseType } from '@/types/response/languages';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Popover, TableColumnsType } from 'antd';
import { Pen, Settings, Trash } from 'lucide-react';

interface params {
    open: (key: string, record: LanguageResponseType) => void;
}
export const useLanguageCols = ({ open }: params): TableColumnsType<LanguageResponseType> => {
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
            title: t.utils.actions,
            dataIndex: 'action',
            key: 'action',
            width: 100,
            render: (_, record: LanguageResponseType) => (
                <div>
                    <Popover
                        trigger={'click'}
                        content={
                            <div className="flex flex-col gap-2">
                                <Button
                                    icon={<Pen className="size-[14px] !text-blue-700" />}
                                    onClick={() => open('modify', record)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    icon={<Trash className="size-[14px] !text-red-700" />}
                                    onClick={() => open('delete', record)}
                                >
                                    Remove
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
