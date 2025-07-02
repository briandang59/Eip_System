import { EducationResponseType } from '@/types/response/education';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { TableColumnsType } from 'antd';

export const useEducationCols = (): TableColumnsType<EducationResponseType> => {
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
            render: (_, record: EducationResponseType) => (
                <div className="line-clamp-2">{record.name_en || '-'}</div>
            ),
        },
        {
            title: `${t.utils.name} (vn)`,
            dataIndex: 'name_vn',
            key: 'name_vn',
            width: 200,
            render: (_, record: EducationResponseType) => (
                <div className="line-clamp-2">{record.name_vn || '-'}</div>
            ),
        },
        {
            title: `${t.utils.name} (zh)`,
            dataIndex: 'name_zh',
            key: 'name_zh',
            width: 200,
            render: (_, record: EducationResponseType) => (
                <div className="line-clamp-2">{record.name_zh || '-'}</div>
            ),
        },
        {
            title: `${t.utils.level}`,
            dataIndex: 'level',
            key: 'level',
            width: 200,
            render: (_, record: EducationResponseType) => (
                <div className="line-clamp-2">{record.level || '-'}</div>
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
