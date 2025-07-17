'use client';
import { dayOffService } from '@/apis/services/dayOff';
import { useTakeLeave } from '@/apis/useSwr/takeLeave';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import ClientOnly from '@/components/common/ClientOnly';
import { GenericTable } from '@/components/common/GenericTable';
import ModalConfirm from '@/components/common/ModalConfirm';
import TakeLeaveForm from '@/components/forms/TakeLeaveForm';
import { TakeLeaveResponseType } from '@/types/response/takeLeave';
import { useTakeLeaveCols } from '@/utils/constants/cols/takeleaveCols';
import { getInfomation } from '@/utils/functions/getInfomation';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Modal, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Pen, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function TakeLeavePage() {
    const takeleaveCols = useTakeLeaveCols();
    const { t } = useTranslationCustom();
    const [dateRange, setDateRange] = useState<{ start: Dayjs; end: Dayjs }>({
        start: dayjs().startOf('month'),
        end: dayjs().endOf('month'),
    });
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const myInfo = getInfomation();
    const { workPlaces, isLoading: workplaceLoading } = useWorkPlaces();
    const [selectedWorkplace, setSelectedWorkplace] = useState<number | null>(
        myInfo?.work_place_id ?? null,
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
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectcedRecordRow, setSelectedRecordRow] = useState<TakeLeaveResponseType[]>([]);
    const onSelectChange = (
        newSelectedRowKeys: React.Key[],
        selectedRows: TakeLeaveResponseType[],
    ) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRecordRow(selectedRows);
    };

    const rowSelection = {
        type: 'checkbox' as const,
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const toggleModal = () => {
        setIsOpenModal(!isOpenModal);
    };
    const toggleModalConfirm = () => {
        setIsOpenModalConfirm(!isOpenModalConfirm);
    };

    const handleConfirm = async () => {
        try {
            const deletePromises = selectcedRecordRow.map((row) =>
                dayOffService.remove(row.id).catch((error) => {
                    return { row, error };
                }),
            );

            const results = await Promise.all(deletePromises);
            const errors = results.filter((result) => result?.error);
            if (errors.length > 0) {
                toast.warning(
                    `${t.take_leave.partial_delete} ${errors.length} ${t.take_leave.cannot_delete}`,
                );
            } else {
                toast.success(t.take_leave.delete_succcess);
            }

            setSelectedRowKeys([]);
            mutate();
            toggleModalConfirm();
        } catch (error) {
            toast.error(`${error}`);
        }
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
                <Button icon={<PlusOutlined className="!text-green-800" />} onClick={toggleModal}>
                    {t.take_leave.add}
                </Button>
                <Button icon={<Pen className="!text-blue-800 size-[14px]" />} onClick={toggleModal}>
                    {t.take_leave.modify}
                </Button>
                <Button
                    icon={<Trash className="!text-red-800 size-[14px]" />}
                    onClick={toggleModalConfirm}
                    disabled={selectedRowKeys.length === 0}
                >
                    {t.take_leave.remove}
                </Button>
                <Button icon={<ReloadOutlined className="!text-orange-600" />}>
                    {t.take_leave.reload}
                </Button>
            </div>
            <GenericTable<TakeLeaveResponseType>
                columns={takeleaveCols}
                dataSource={takeLeaves || []}
                rowKey="id"
                isLoading={takeLeaveLoading}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: 'default',
                }}
                rowSelection={rowSelection}
            />
            <Modal open={isOpenModal} onCancel={toggleModal} footer={null} width={1000} centered>
                <TakeLeaveForm isOpen={isOpenModal} close={toggleModal} mutate={mutate} />
            </Modal>
            <ModalConfirm
                isOpen={isOpenModalConfirm}
                toggleModal={toggleModalConfirm}
                confirmAndClose={handleConfirm}
            />
        </ClientOnly>
    );
}

export default TakeLeavePage;
