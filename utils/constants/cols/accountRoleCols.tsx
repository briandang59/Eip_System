import { AccountRoleITResponse } from '@/types/response/accountRole';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Popover, TableColumnsType } from 'antd';
import { Pen, Settings, Shield, Trash } from 'lucide-react';

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
            width: 40,
            render: () => {
                return (
                    <div className="flex items-center gap-2">
                        <Popover
                            trigger="click"
                            content={
                                <div className="flex flex-col gap-2">
                                    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-[10px] duration-300">
                                        <Shield className="size-4 !text-green-700" />
                                        Add permission
                                    </button>
                                    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-[10px] duration-300">
                                        <Pen className="size-4 !text-blue-700" />
                                        Edit role
                                    </button>
                                    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-[10px] duration-300">
                                        <Trash className="size-4 !text-red-700" />
                                        Delete role
                                    </button>
                                </div>
                            }
                        >
                            <Button icon={<Settings className="size-4 !text-green-700" />}></Button>
                        </Popover>
                    </div>
                );
            },
        },
    ];
};
