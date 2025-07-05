'use client';
import { useTakeLeave } from '@/apis/useSwr/takeLeave';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import ClientOnly from '@/components/common/ClientOnly';
import { GenericTable } from '@/components/common/GenericTable';
import TakeLeaveForm from '@/components/forms/TakeLeaveForm';
import { TakeLeaveResponseType } from '@/types/response/takeLeave';
import { useTakeLeaveCols } from '@/utils/constants/cols/takeleaveCols';
import { getInfomation } from '@/utils/functions/getInfomation';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Modal, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

function TakeLeavePage() {
    const takeleaveCols = useTakeLeaveCols();
    const [dateRange, setDateRange] = useState<{ start: Dayjs; end: Dayjs }>({
        start: dayjs().startOf('month'),
        end: dayjs().endOf('month'),
    });
    const [isOpenModal, setIsOpenModal] = useState(false);
    const myInfo = getInfomation();
    const { workPlaces, isLoading: workplaceLoading } = useWorkPlaces();
    const [selectedWorkplace, setSelectedWorkplace] = useState<number | null>(
        myInfo?.work_place_id ?? null, // nếu chưa có dữ liệu => null
    );
    const {
        takeLeaves,
        isLoading: takeLeaveLoading,
        mutate,
    } = useTakeLeave({
        work_place_id: selectedWorkplace ?? 0,
        start: dayjs(dateRange.start).format('YYYY-MM-DD'),
        end: dayjs(dateRange.end).format('YYYY-MM-DD'),
    });
    const toggleModal = () => {
        setIsOpenModal(!isOpenModal);
    };
    const onChangeDateRange = (value: [Dayjs | null, Dayjs | null] | null) => {
        if (value) {
            setDateRange({
                start: value[0]!,
                end: value[1]!,
            });
        }
    };
    return (
        <ClientOnly>
            <div className="flex items-end gap-2 mb-4">
                <Select
                    value={selectedWorkplace}
                    options={workPlaces?.map((item) => ({
                        label: item.name_vn,
                        value: item.id,
                    }))}
                    onChange={(value) => {
                        setSelectedWorkplace(value);
                    }}
                    className="w-[150px]"
                    loading={workplaceLoading}
                />

                <DatePicker.RangePicker
                    style={{ width: '250px' }}
                    value={[dateRange.start, dateRange.end]}
                    onChange={onChangeDateRange}
                    allowClear={false}
                />
                <Button icon={<PlusOutlined />} onClick={toggleModal}>
                    Add
                </Button>
                <Button icon={<ReloadOutlined />}>Reload</Button>
            </div>
            <GenericTable<TakeLeaveResponseType>
                columns={takeleaveCols}
                dataSource={takeLeaves || []}
                rowKey="stt"
                isLoading={takeLeaveLoading}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: 'default',
                }}
            />
            <Modal open={isOpenModal} onCancel={toggleModal} footer={null} width={1000} centered>
                <TakeLeaveForm isOpen={isOpenModal} close={toggleModal} mutate={mutate} />
            </Modal>
        </ClientOnly>
    );
}

export default TakeLeavePage;
