'use client';
import { useRoles } from '@/apis/useSwr/roles';
import { GenericTable } from '@/components/common/GenericTable';
import { RoleType, useRoleCols } from '@/utils/constants/cols/roleCols';

function AccountRole() {
    const { roles, isLoading, isError, total, mutate } = useRoles();
    const cols = useRoleCols();

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-[20px] font-bold">Danh sách vai trò</h2>
            <GenericTable<RoleType> columns={cols} dataSource={roles} rowKey="key" />
        </div>
    );
}

export default AccountRole;
