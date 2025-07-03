import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useState } from 'react';
import { GenericTable } from '../common/GenericTable';
import { useRoleITCols } from '@/utils/constants/cols/roleITCols';
import { useRolesIT } from '@/apis/useSwr/rolesIT';
import { RoleITResponseType } from '@/types/response/roleIT';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

function Roles() {
    const [search, setSearch] = useState<string>('');
    const cols = useRoleITCols();
    const { roles, isLoading: isLoadingRoles } = useRolesIT({ search });
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
        </div>
    );
}

export default Roles;
