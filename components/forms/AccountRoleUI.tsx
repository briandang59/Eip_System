import { accountRoleService } from '@/apis/services/accountRole';
import { useRolesIT } from '@/apis/useSwr/rolesIT';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { AccountRoleITResponse } from '@/types/response/accountRole';
import { RoleITResponseType } from '@/types/response/roleIT';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Checkbox, CheckboxChangeEvent } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface WorkPlaceRolesProps {
    work_place_id: number;
    work_place_name: string;
    roles: RoleITResponseType[];
}

interface Params {
    accountRoles: AccountRoleITResponse[];
    mutate: () => void;
    toggleModal: (key: string) => void;
}

interface RoleMapping {
    work_place_id: number;
    role_id: number;
}

// Helper to check if a role exists in a list
const hasRole = (list: RoleMapping[], wpId: number, roleId: number) =>
    list.some((r) => r.role_id === roleId && r.work_place_id === wpId);

function AcountRoleUI({ accountRoles, mutate, toggleModal }: Params) {
    const { t } = useTranslationCustom();
    const { workPlaces } = useWorkPlaces();
    const { roles } = useRolesIT();

    const [workPlaceRoles, setWorkPlaceRoles] = useState<WorkPlaceRolesProps[]>([]);
    const [selectedAccountRole, setSelectedAccountRole] = useState<RoleMapping[]>([]);
    const [initialPermission, setInitialPermission] = useState<RoleMapping[]>([]);
    const [toAdd, setToAdd] = useState<RoleMapping[]>([]);
    const [toRemove, setToRemove] = useState<RoleMapping[]>([]);

    useEffect(() => {
        if (!workPlaces || !roles || !accountRoles) return;

        // 1. Danh sách workplace kèm roles
        const newArr: WorkPlaceRolesProps[] = workPlaces.map((wp) => ({
            work_place_id: wp.id,
            work_place_name: wp.name_en,
            roles,
        }));
        setWorkPlaceRoles(newArr);

        // 2. Quy đổi quyền hiện có của nhân viên
        const existingRoles: RoleMapping[] = accountRoles.map((item) => ({
            role_id: item.roles.id,
            work_place_id: item.work_place.id,
        }));
        setSelectedAccountRole(existingRoles);
        setInitialPermission(existingRoles);

        // reset buffer nếu cần
        setToAdd([]);
        setToRemove([]);
    }, [accountRoles]); // 👈 phụ thuộc đúng!

    const handleTogglePermission = (work_place_id: number, role_id: number, checked: boolean) => {
        const existedAtStart = hasRole(initialPermission, work_place_id, role_id);
        const roleObj = { work_place_id, role_id };

        // Update UI state
        setSelectedAccountRole((prev) =>
            checked
                ? hasRole(prev, work_place_id, role_id)
                    ? prev
                    : [...prev, roleObj]
                : prev.filter((p) => !(p.role_id === role_id && p.work_place_id === work_place_id)),
        );

        // Update Add/Remove buffers
        if (checked) {
            if (!existedAtStart) {
                setToAdd((prev) =>
                    hasRole(prev, work_place_id, role_id) ? prev : [...prev, roleObj],
                );
            }
            setToRemove((prev) =>
                prev.filter((p) => !(p.role_id === role_id && p.work_place_id === work_place_id)),
            );
        } else {
            if (existedAtStart) {
                setToRemove((prev) =>
                    hasRole(prev, work_place_id, role_id) ? prev : [...prev, roleObj],
                );
            }
            setToAdd((prev) =>
                prev.filter((p) => !(p.role_id === role_id && p.work_place_id === work_place_id)),
            );
        }
    };

    const handleSubmit = async () => {
        try {
            if (toAdd.length) {
                await Promise.all(
                    toAdd.map((id) =>
                        accountRoleService.add({
                            card_number: accountRoles[0]?.employee?.card_number,
                            role_id: id.role_id,
                            work_place_id: id.work_place_id,
                        }),
                    ),
                );
            }

            if (toRemove.length) {
                await Promise.all(
                    toRemove.map((id) =>
                        accountRoleService.remove({
                            card_number: accountRoles[0]?.employee?.card_number,
                            role_id: id.role_id,
                            work_place_id: id.work_place_id,
                        }),
                    ),
                );
            }

            mutate();
            toast.success(t.role_and_permission.success);
            toggleModal('account_role');

            setToAdd([]);
            setToRemove([]);
            setInitialPermission([]);
        } catch (error) {
            console.error(error);
            toast.error(`${error}`);
        }
    };

    return (
        <div>
            <h2 className="text-[20px] font-bold text-green-700 mb-4">
                {accountRoles[0]?.employee?.card_number} - {accountRoles[0]?.employee?.fullname}
            </h2>

            {workPlaceRoles.map((item) => (
                <div key={item.work_place_id} className="flex flex-col gap-2">
                    <h3 className="font-bold">{item.work_place_name}</h3>
                    <ul className="grid grid-cols-4 gap-2 mb-2">
                        {item.roles.map((role) => {
                            const matched = hasRole(
                                selectedAccountRole,
                                item.work_place_id,
                                role.id,
                            );

                            return (
                                <li key={role.id}>
                                    <Checkbox
                                        checked={matched}
                                        value={role.id}
                                        onChange={(e: CheckboxChangeEvent) =>
                                            handleTogglePermission(
                                                item.work_place_id,
                                                role.id,
                                                e.target.checked,
                                            )
                                        }
                                    >
                                        {role.tag}
                                    </Checkbox>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}

            <div className="flex justify-end gap-2">
                <Button onClick={() => toggleModal('account_role')}>{t.common.forms.cancel}</Button>
                <Button type="primary" onClick={handleSubmit}>
                    {t.common.forms.submit}
                </Button>
            </div>
        </div>
    );
}

export default AcountRoleUI;
