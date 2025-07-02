import { Button, Input } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';

import { useState } from 'react';

import { useShifts } from '@/apis/useSwr/shift';
import { useShiftCols } from '@/utils/constants/cols/shiftCols';
import { ShiftType } from '@/types/response/shiftType';

function ShiftTypes() {
    const { t } = useTranslationCustom();
    const shiftCols = useShiftCols();
    const [search, setSearch] = useState('');

    const { shifts, isLoading: isLoadingShifts } = useShifts({ search });

    // Convert object to array for table
    const shiftsArray = shifts ? Object.values(shifts) : [];

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
            <GenericTable<ShiftType>
                columns={shiftCols}
                dataSource={shiftsArray}
                rowKey="id"
                isLoading={isLoadingShifts}
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

export default ShiftTypes;
