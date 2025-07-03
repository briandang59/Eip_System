import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useState } from 'react';
import { GenericTable } from '../common/GenericTable';

import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

import { useAccountRoleIT } from '@/apis/useSwr/accountRoleIT';
import { AccountRoleITResponse } from '@/types/response/accountRole';
import { useAccountRoleCols } from '@/utils/constants/cols/accountRoleCols';

function AccountRoles() {
    const [search, setSearch] = useState<string>('');
    const cols = useAccountRoleCols();
    const { accountRoles, isLoading: isLoadingPermission } = useAccountRoleIT({ search });
    const { t } = useTranslationCustom();
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
            <GenericTable<AccountRoleITResponse>
                columns={cols}
                dataSource={accountRoles || []}
                rowKey="id"
                isLoading={isLoadingPermission}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: 'default',
                }}
            />
        </div>
    );
}

export default AccountRoles;
