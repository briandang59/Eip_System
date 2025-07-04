import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Checkbox, CheckboxChangeEvent, Input, Modal, Spin } from 'antd';
import { useState } from 'react';
import { GenericTable } from '../common/GenericTable';
import { useRoleITCols } from '@/utils/constants/cols/roleITCols';
import { useRolesIT } from '@/apis/useSwr/rolesIT';
import { RoleITResponseType } from '@/types/response/roleIT';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { usePermissionIT } from '@/apis/useSwr/permissionIT';
import { useRolePermission } from '@/apis/useSwr/rolePermission';
import { rolePermissionService } from '@/apis/services/rolePermission';
import { toast } from 'sonner';

function Roles() {
    const [search, setSearch] = useState<string>('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const { roles, isLoading: isLoadingRoles } = useRolesIT({ search });
    const [selectedRole, setSelectedRole] = useState<RoleITResponseType | null>(null);
    const { permissions, isLoading: isLoadingPermission } = usePermissionIT();
    const { rolePermissions, mutate } = useRolePermission();
    const [initialPermission, setInitialPermission] = useState<number[]>([]); // danh sách quyền gốc
    const [selectedPermission, setSelectedPermission] = useState<number[]>([]);
    const [toAdd, setToAdd] = useState<number[]>([]);
    const [toRemove, setToRemove] = useState<number[]>([]);

    const { t } = useTranslationCustom();
    const toggleModal = () => {
        setIsOpenModal(!isOpenModal);
    };
    const handleGetRole = (role: RoleITResponseType) => {
        setSelectedRole(role);
        const permissionIds =
            rolePermissions
                ?.filter((rp) => rp.role_id === role.id)
                .map((rp) => rp.permissions.id) ?? [];

        setInitialPermission(permissionIds);
        setSelectedPermission(permissionIds);
        setToAdd([]);
        setToRemove([]);
        setIsOpenModal(true);
    };
    const cols = useRoleITCols({ toggleModal, handleGetRole });
    const handleTogglePermission = (id: number, checked: boolean) => {
        setSelectedPermission((prev) => (checked ? [...prev, id] : prev.filter((p) => p !== id)));

        const existedAtStart = initialPermission.includes(id);

        if (checked) {
            if (!existedAtStart) {
                setToAdd((prev) => (prev.includes(id) ? prev : [...prev, id]));
            }
            setToRemove((prev) => prev.filter((p) => p !== id));
        } else {
            if (existedAtStart) {
                setToRemove((prev) => (prev.includes(id) ? prev : [...prev, id]));
            }
            setToAdd((prev) => prev.filter((p) => p !== id));
        }
    };

    const handleSubmit = async () => {
        try {
            if (!selectedRole) return;

            if (toAdd.length && selectedRole) {
                await Promise.all(
                    toAdd.map((id) =>
                        rolePermissionService.add({
                            role_id: selectedRole.id,
                            permission_id: id,
                        }),
                    ),
                );
            }

            if (toRemove.length && selectedRole) {
                await Promise.all(
                    toRemove.map((id) =>
                        rolePermissionService.remove({
                            role_id: selectedRole.id,
                            permission_id: id,
                        }),
                    ),
                );
            }
            mutate();
            toast.success(t.role_and_permission.success);
            toggleModal();

            setToAdd([]);
            setToRemove([]);
            setInitialPermission([]);
            setSelectedPermission([]);
            setSelectedRole(null);
        } catch (error) {
            console.error(error);
            toast.error(t.role_and_permission.error);
        }
    };

    return (
        <div>
            <div className="flex items-end gap-2 mb-4">
                <Button icon={<PlusOutlined />}>{t.role_and_permission.add}</Button>
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
            <Modal open={isOpenModal} onCancel={toggleModal} width={1000} onOk={handleSubmit}>
                <h2 className="text-[20px] font-bold">{selectedRole?.tag}</h2>
                <ul className="grid grid-cols-4 gap-4 mt-4">
                    {!isLoadingPermission ? (
                        permissions?.map((item, index) => {
                            const matched = selectedPermission.some((itemP) => item.id === itemP);
                            return (
                                <li key={index}>
                                    <Checkbox
                                        checked={matched}
                                        value={item.id}
                                        onChange={(e: CheckboxChangeEvent) =>
                                            handleTogglePermission(item.id, e.target.checked)
                                        }
                                    >
                                        {item.tag}
                                    </Checkbox>
                                </li>
                            );
                        })
                    ) : (
                        <Spin />
                    )}
                </ul>
            </Modal>
        </div>
    );
}

export default Roles;
