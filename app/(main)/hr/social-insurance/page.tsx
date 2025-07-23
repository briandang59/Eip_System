'use client';
import { useEmployeeSalaryAllowances } from '@/apis/useSwr/employeeSalaryAllowance';
import { GenericTable } from '@/components/common/GenericTable';
import { SalaryAllowance } from '@/types/response/salaryAllowance';
import { useSocialInsuranceCols } from '@/utils/constants/cols/socialInsuranceCols';

function SocialInsurancePage() {
    const socialInsurance = useSocialInsuranceCols();
    const { employeeSalaryAllowance, isLoading: isLoadingSalaryAllowance } =
        useEmployeeSalaryAllowances({ place_id: 3 });
    return (
        <div>
            <GenericTable<SalaryAllowance>
                columns={socialInsurance}
                dataSource={employeeSalaryAllowance || []}
                rowKey="stt"
                isLoading={isLoadingSalaryAllowance}
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

export default SocialInsurancePage;
