import { EthnicResponseType } from '@/types/response/ethnic';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { TableColumnsType } from 'antd';

export const useEthnicCols = (): TableColumnsType<EthnicResponseType> => {
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
            width: 100,
            render: (text: string) => <div className="line-clamp-2">{text}</div>,
            fixed: 'right',
        },
    ];
};
