import { EthnicResponseType } from '@/types/response/ethnic';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Popover, TableColumnsType } from 'antd';
import { Pen, Settings, Trash } from 'lucide-react';

interface params {
    open: (key: string, record?: EthnicResponseType) => void;
}
export const useEthnicCols = ({ open }: params): TableColumnsType<EthnicResponseType> => {
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
            title: `${t.utils.name}`,
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (_, record: EthnicResponseType) => (
                <div className="line-clamp-2">{record.name || '-'}</div>
            ),
        },

        {
            title: t.utils.actions,
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (_, record: EthnicResponseType) => (
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
