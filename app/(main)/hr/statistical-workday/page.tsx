'use client';
import { GenericTable } from '@/components/common/GenericTable';
import { AttendanceV2Type } from '@/types/response/attendance';
import { useStatisticalWorkdayCols } from '@/utils/constants/cols/statisticalWorkdayCols';
import { Select } from 'antd';

function StatisticalWorkday() {
    const workdayCols = useStatisticalWorkdayCols();
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Select options={[]} placeholder="Select version" className="w-40" />
            </div>
            <GenericTable<AttendanceV2Type>
                columns={workdayCols}
                dataSource={[]}
                rowKey="stt"
                isLoading={false}
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

export default StatisticalWorkday;
