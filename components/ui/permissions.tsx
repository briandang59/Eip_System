import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useState } from 'react';
import { GenericTable } from '../common/GenericTable';

import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { usePermissionIT } from '@/apis/useSwr/permissionIT';
import { PermisisonITResponse } from '@/types/response/permissionIT';
import { usePermissionCols } from '@/utils/constants/cols/permissionITCols';

function Permisisons() {
    const [search, setSearch] = useState<string>('');
    const cols = usePermissionCols();
    const { permissions, isLoading: isLoadingPermission } = usePermissionIT({ search });
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
            <GenericTable<PermisisonITResponse>
                columns={cols}
                dataSource={permissions || []}
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

export default Permisisons;
