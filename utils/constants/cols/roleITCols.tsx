import { RoleITResponseType } from '@/types/response/roleIT';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, TableColumnsType } from 'antd';
import { Pen, Shield, Trash } from 'lucide-react';

export const useRoleITCols = (): TableColumnsType<RoleITResponseType> => {
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
            title: t.settings.account_role.role_name_en,
            dataIndex: 'name_en',
            key: 'name_en',
            width: 200,
        },
        {
            title: t.settings.account_role.role_name_vn,
            dataIndex: 'name_vn',
            key: 'name_en',
            width: 200,
        },
        {
            title: t.settings.account_role.role_name_zh,
            dataIndex: 'name_zh',
            key: 'name_en',
            width: 200,
        },
        {
            title: t.settings.account_role.tag,
            dataIndex: 'tag',
            key: 'tag',
            width: 100,
        },
        {
            title: t.settings.account_role.description,
            dataIndex: 'description',
            key: 'description',
            width: 500,
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
            render: () => {
                return (
                    <div className="flex items-center gap-2">
                        <Button icon={<Shield className="size-4 !text-green-700" />}></Button>
                        <Button icon={<Pen className="size-4 !text-blue-700" />}></Button>
                        <Button icon={<Trash className="size-4 !text-red-700" />}></Button>
                    </div>
                );
            },
        },
    ];
};
