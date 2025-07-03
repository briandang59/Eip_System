'use client';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Tabs } from 'antd';
import { Key, ShieldUser, UserLock } from 'lucide-react';

import Roles from '@/components/ui/roles';
import Permissions from '@/components/ui/permissions';
import AccountRole from '@/components/ui/accountRole';

function RolesAndPermissionsPage() {
    const { t } = useTranslationCustom();
    const tabs = [
        {
            key: '1',
            label: t.role_and_permission.manage_role,
            children: <Roles />,
            icon: <ShieldUser strokeWidth={1.5} />,
        },
        {
            key: '2',
            label: t.role_and_permission.manage_permission,
            children: <Permissions />,
            icon: <Key strokeWidth={1.5} />,
        },
        {
            key: '3',
            label: t.role_and_permission.account_role,
            children: <AccountRole />,
            icon: <UserLock strokeWidth={1.5} />,
        },
    ];
    return <Tabs defaultActiveKey="1" items={tabs} />;
}

export default RolesAndPermissionsPage;
