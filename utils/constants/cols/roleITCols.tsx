import { RoleITResponseType } from '@/types/response/roleIT';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Popover, TableColumnsType } from 'antd';
import { Pen, Settings, Shield, Trash } from 'lucide-react';

interface params {
    toggleModal: () => void;
    handleGetRole: (role: RoleITResponseType) => void;
}
export const useRoleITCols = ({
    toggleModal,
    handleGetRole,
}: params): TableColumnsType<RoleITResponseType> => {
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
            width: 40,
            render: (_, record: RoleITResponseType) => {
                return (
                    <div className="flex items-center gap-2">
                        <Popover
                            trigger="click"
                            content={
                                <div className="flex flex-col gap-2">
                                    <button
                                        className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-[10px] duration-300"
                                        onClick={() => {
                                            toggleModal();
                                            handleGetRole(record);
                                        }}
                                    >
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
