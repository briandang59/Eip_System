import { Button, Input } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';

import { useState } from 'react';
import { useNations } from '@/apis/useSwr/nation';
import { NationResponseType } from '@/types/response/nation';
import { useNationCols } from '@/utils/constants/cols/nationCols';

function Nationalities() {
    const { t } = useTranslationCustom();
    const nationCols = useNationCols();
    const [search, setSearch] = useState('');

    const typeOptions = [
        { label: 'Product', value: 1 },
        { label: 'Office', value: 2 },
    ];

    const { nations, isLoading: isLoadingNations } = useNations(undefined, { search });

    return (
        <div>
            <div className="flex flex-wrap items-end gap-2 mb-4">
                <Button icon={<PlusOutlined />}>{t.utils.add}</Button>
                <Button icon={<FileExcelOutlined />}>{t.utils.export}</Button>
                <Button icon={<ReloadOutlined />}>{t.utils.refresh}</Button>
                <Input.Search
                    placeholder={t.utils.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={setSearch}
                    style={{ width: 200 }}
                    allowClear
                />
            </div>
            <GenericTable<NationResponseType>
                columns={nationCols}
                dataSource={nations || []}
                rowKey="id"
                isLoading={isLoadingNations}
                summary={() => null}
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

export default Nationalities;
