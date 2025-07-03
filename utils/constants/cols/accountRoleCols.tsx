import { AccountRoleITResponse } from '@/types/response/accountRole';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, TableColumnsType } from 'antd';
import { Pen, Shield, Trash } from 'lucide-react';

export const useAccountRoleCols = (): TableColumnsType<AccountRoleITResponse> => {
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
            title: t.role_and_permission.card_number,
            dataIndex: ['employee', 'card_number'],
            key: 'permission_type.name_en',
            width: 200,
        },

        {
            title: t.role_and_permission.fullname,
            dataIndex: ['employee', 'fullname'],
            key: 'permission_type.name_vn',
            width: 200,
        },
        {
            title: t.role_and_permission.workplace,
            dataIndex: ['work_place', 'name'],
            key: 'permission_type.name_zh',
            width: 200,
        },
        {
            title: t.role_and_permission.tag,
            dataIndex: ['roles', 'tag'],
            key: 'tag',
            width: 100,
        },
        {
            title: t.role_and_permission.description,
            dataIndex: ['roles', 'description'],
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
