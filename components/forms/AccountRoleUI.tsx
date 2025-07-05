'use client';

import { accountRoleService } from '@/apis/services/accountRole';
import { useRolesIT } from '@/apis/useSwr/rolesIT';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { AccountRoleITResponse } from '@/types/response/accountRole';
import { RoleITResponseType } from '@/types/response/roleIT';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Checkbox, CheckboxChangeEvent } from 'antd';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

/* ---------- Types ---------- */

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

/* ---------- Helpers ---------- */

const hasRole = (list: RoleMapping[], wpId: number, roleId: number) =>
    list.some((r) => r.role_id === roleId && r.work_place_id === wpId);

/* ---------- Component ---------- */

function AccountRoleUI({ accountRoles, mutate, toggleModal }: Params) {
    const { t } = useTranslationCustom();
    const { workPlaces } = useWorkPlaces();
    const { roles } = useRolesIT();

    /* --- 1. Dẫn xuất dữ liệu --- */

    // Danh sách WP kèm roles – tính 1 lần, chỉ đổi khi API đổi
    const workPlaceRoles: WorkPlaceRolesProps[] = useMemo(() => {
        if (!workPlaces || !roles) return [];
        return workPlaces.map((wp) => ({
            work_place_id: wp.id,
            work_place_name: wp.name_en,
            roles, // mảng roles đã load
        }));
    }, [workPlaces, roles]);

    // Quyền hiện có (initial) – đổi khi accountRoles đổi
    const initialPermission: RoleMapping[] = useMemo(() => {
        if (!accountRoles) return [];
        return accountRoles.map((item) => ({
            role_id: item.roles.id,
            work_place_id: item.work_place.id,
        }));
    }, [accountRoles]);

    /* --- 2. State hiển thị và buffer thay đổi --- */

    const [selectedAccountRole, setSelectedAccountRole] =
        useState<RoleMapping[]>(initialPermission);
    const [toAdd, setToAdd] = useState<RoleMapping[]>([]);
    const [toRemove, setToRemove] = useState<RoleMapping[]>([]);

    // Khi accountRoles mới về, reset UI & buffer
    useEffect(() => {
        setSelectedAccountRole(initialPermission);
        setToAdd([]);
        setToRemove([]);
    }, [initialPermission]);

    /* --- 3. Xử lý tick/untick --- */

    const handleTogglePermission = (work_place_id: number, role_id: number, checked: boolean) => {
        const existedAtStart = hasRole(initialPermission, work_place_id, role_id);
        const roleObj = { work_place_id, role_id };

        // cập nhật UI
        setSelectedAccountRole((prev) =>
            checked
                ? hasRole(prev, work_place_id, role_id)
                    ? prev
                    : [...prev, roleObj]
                : prev.filter((p) => !(p.role_id === role_id && p.work_place_id === work_place_id)),
        );

        // buffer thêm / xoá
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

    /* --- 4. Submit --- */

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
        } catch (error) {
            console.error(error);
            toast.error(`${error}`);
        }
    };

    /* --- 5. Render --- */

    return (
        <div>
            <h2 className="text-[20px] font-bold text-green-700 mb-4">
                {accountRoles[0]?.employee?.card_number} – {accountRoles[0]?.employee?.fullname}
            </h2>

            {workPlaceRoles.map((wp) => (
                <div key={wp.work_place_id} className="flex flex-col gap-2">
                    <h3 className="font-bold">{wp.work_place_name}</h3>
                    <ul className="grid grid-cols-4 gap-2 mb-2">
                        {wp.roles.map((role) => {
                            const matched = hasRole(selectedAccountRole, wp.work_place_id, role.id);

                            return (
                                <li key={role.id}>
                                    <Checkbox
                                        checked={matched}
                                        onChange={(e: CheckboxChangeEvent) =>
                                            handleTogglePermission(
                                                wp.work_place_id,
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

export default AccountRoleUI;
