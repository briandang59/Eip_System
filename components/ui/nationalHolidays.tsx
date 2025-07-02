import { Button, Input } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';

import { useState } from 'react';

import { useHolidays } from '@/apis/useSwr/holiday';
import { HolidayResponseType } from '@/types/response/holiday';
import { useHolidayCols } from '@/utils/constants/cols/holidayCols';

function NationalHolidays() {
    const { t } = useTranslationCustom();
    const holidayCols = useHolidayCols();
    const [search, setSearch] = useState('');

    const typeOptions = [
        { label: 'Product', value: 1 },
        { label: 'Office', value: 2 },
    ];

    const { holidays, isLoading: isLoadingHolidays } = useHolidays(undefined, { search });

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
            <GenericTable<HolidayResponseType>
                columns={holidayCols}
                dataSource={holidays || []}
                rowKey="id"
                isLoading={isLoadingHolidays}
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

export default NationalHolidays;
