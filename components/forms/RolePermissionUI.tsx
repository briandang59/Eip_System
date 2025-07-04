import { rolePermissionService } from '@/apis/services/rolePermission';
import { usePermissionIT } from '@/apis/useSwr/permissionIT';
import { useRolePermission } from '@/apis/useSwr/rolePermission';
import { RoleITResponseType } from '@/types/response/roleIT';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Checkbox, CheckboxChangeEvent, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface params {
    toggleModal: (key: string) => void;
    selectedRole: RoleITResponseType | null;
    setSelectedRole: (value: RoleITResponseType | null) => void;
}
function RolePermissionUI({ toggleModal, selectedRole, setSelectedRole }: params) {
    const { t } = useTranslationCustom();
    const { permissions, isLoading: isLoadingPermission } = usePermissionIT();
    const { rolePermissions, mutate } = useRolePermission();

    const [initialPermission, setInitialPermission] = useState<number[]>([]);
    const [selectedPermission, setSelectedPermission] = useState<number[]>([]);
    const [toAdd, setToAdd] = useState<number[]>([]);
    const [toRemove, setToRemove] = useState<number[]>([]);
    useEffect(() => {
        if (selectedRole !== null) {
            const permissionIds =
                rolePermissions
                    ?.filter((rp) => rp.role_id === selectedRole.id)
                    .map((rp) => rp.permissions.id) ?? [];

            setInitialPermission(permissionIds);
            setSelectedPermission(permissionIds);
            setToAdd([]);
            setToRemove([]);
        }
    }, [selectedRole, rolePermissions]);
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
            toggleModal('role_permission');

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
    return (
        <>
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
            <div className="flex items-end justify-end gap-2 mt-4">
                <Button onClick={() => toggleModal('role_permission')}>Cancel</Button>
                <Button type="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </>
    );
}

export default RolePermissionUI;
