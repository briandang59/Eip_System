'use client';
import { useRoles } from '@/apis/useSwr/roles';
import { GenericTable } from '@/components/common/GenericTable';
import { RoleType, useRoleCols } from '@/utils/constants/cols/roleCols';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

function AccountRole() {
    const { roles, isLoading } = useRoles();
    const { t } = useTranslationCustom();
    const cols = useRoleCols();

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-[20px] font-bold">{t.settings.account_role.list_roles}</h2>
            <GenericTable<RoleType>
                columns={cols}
                dataSource={roles}
                rowKey="key"
                isLoading={isLoading}
            />
        </div>
    );
}

export default AccountRole;
