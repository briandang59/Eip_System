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
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Modal, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Pen, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useFactoryStore } from '@/stores/useFactoryStore';

function TakeLeavePage() {
    const takeleaveCols = useTakeLeaveCols();
    const { t, lang } = useTranslationCustom();
    const [dateRange, setDateRange] = useState<{ start: Dayjs; end: Dayjs }>({
        start: dayjs().startOf('month'),
        end: dayjs().endOf('month'),
    });
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const myInfo = getInfomation();
    const { filterWorkPlaces, isLoading: workplaceLoading } = useWorkPlaces();
    const { selectedFactoryId, setSelectedFactoryId } = useFactoryStore();
    const selectedWorkPlace = selectedFactoryId || myInfo?.work_place_id || 0;
    const [searchValue, setSearchValue] = useState('');
    const {
        takeLeaves,
        isLoading: takeLeaveLoading,
        mutate,
    } = useTakeLeave(
        {
            work_place_id: selectedWorkPlace ?? 0,
            start: dayjs(dateRange.start).format('YYYY-MM-DD'),
            end: dayjs(dateRange.end).format('YYYY-MM-DD'),
        },
        {
            search: searchValue,
        },
    );
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
        if (!isOpenModal) {
            setSelectedRecordRow([]);
            setSelectedRowKeys([]);
        }
    };

    const toggleModalConfirm = () => {
        setIsOpenModalConfirm(!isOpenModalConfirm);
    };

    const handleAdd = () => {
        setSelectedRecordRow([]);
        setSelectedRowKeys([]);
        setIsOpenModal(true);
    };

    const handleEdit = () => {
        if (selectedRowKeys.length !== 1) {
            toast.error(t.take_leave.err_3);
            return;
        }

        setIsOpenModal(true);
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
    const handleSearch = (value: string) => {
        setSearchValue(value);
    };
    return (
        <ClientOnly>
            <div className="flex items-end gap-2 mb-4">
                <Select
                    value={selectedWorkPlace}
                    options={filterWorkPlaces?.map((item) => ({
                        label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                        value: item.id,
                    }))}
                    onChange={(value) => {
                        setSelectedFactoryId(value);
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
                <Input.Search
                    placeholder={t.take_leave.search_placeholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={handleSearch}
                    style={{ width: '250px' }}
                />

                <Button icon={<PlusOutlined className="!text-green-800" />} onClick={handleAdd}>
                    {t.take_leave.add}
                </Button>
                <Button icon={<Pen className="!text-blue-800 size-[14px]" />} onClick={handleEdit}>
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
                <TakeLeaveForm
                    isOpen={isOpenModal}
                    close={toggleModal}
                    mutate={mutate}
                    takeLeaveRecord={selectcedRecordRow[0]}
                    card_number={selectcedRecordRow[0]?.card_number ?? ''}
                    work_place_id={selectedWorkPlace}
                />
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
