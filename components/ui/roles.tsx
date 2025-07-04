import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import { useState } from 'react';
import { GenericTable } from '../common/GenericTable';
import { useRoleITCols } from '@/utils/constants/cols/roleITCols';
import { useRolesIT } from '@/apis/useSwr/rolesIT';
import { RoleITResponseType } from '@/types/response/roleIT';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import RoleForm from '../forms/RoleForm';
import RolePermissionUI from '../forms/RolePermissionUI';

function Roles() {
    const [search, setSearch] = useState<string>('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const { roles, isLoading: isLoadingRoles, mutate } = useRolesIT({ search });
    const [selectedRole, setSelectedRole] = useState<RoleITResponseType | null>(null);
    const [key, setKey] = useState<string>('');
    const { t } = useTranslationCustom();
    const titleMap = {
        add_role: 'Add role',
        edit_role: 'Edit role',
        role_permission: 'Role permission',
    };
    const title = titleMap[key as keyof typeof titleMap] || '';

    const toggleModal = (key: string) => {
        setIsOpenModal(!isOpenModal);
        setKey(key);
    };

    const handleGetRole = (role: RoleITResponseType) => {
        setSelectedRole(role);
    };
    const cols = useRoleITCols({ toggleModal, handleGetRole });

    function renderChildren() {
        switch (key) {
            case 'add_role':
                return <RoleForm mutate={mutate} toggleModal={toggleModal} />;
            case 'edit_role':
                return <RoleForm mutate={mutate} role={selectedRole} toggleModal={toggleModal} />;
            case 'role_permission':
                return (
                    <RolePermissionUI
                        toggleModal={toggleModal}
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                    />
                );

            default:
                return null;
        }
    }

    return (
        <div>
            <div className="flex items-end gap-2 mb-4">
                <Button icon={<PlusOutlined />} onClick={() => toggleModal('add_role')}>
                    {t.role_and_permission.add}
                </Button>
                <Button icon={<ReloadOutlined />}>{t.role_and_permission.refresh}</Button>
                <div className="w-[200px]">
                    <Input.Search
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />
                </div>
            </div>
            <GenericTable<RoleITResponseType>
                columns={cols}
                dataSource={roles || []}
                rowKey="id"
                isLoading={isLoadingRoles}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: 'default',
                }}
            />
            <Modal
                title={title}
                open={isOpenModal}
                width={1000}
                footer={null}
                onCancel={() => toggleModal(key)}
                centered
            >
                {renderChildren()}
            </Modal>
        </div>
    );
}

export default Roles;
