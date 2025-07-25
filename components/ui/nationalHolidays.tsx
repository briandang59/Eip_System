import { Button, Input, Modal } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';

import { useState } from 'react';

import { useHolidays } from '@/apis/useSwr/holiday';
import { HolidayResponseType } from '@/types/response/holiday';
import { useHolidayCols } from '@/utils/constants/cols/holidayCols';
import { holidayService } from '@/apis/services/holiday';
import { toast } from 'sonner';
import ModalConfirm from '../common/ModalConfirm';
import HolidayForm from '../forms/HolidayForm';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';

function NationalHolidays() {
    const { t } = useTranslationCustom();
    const [search, setSearch] = useState('');

    const { holidays, isLoading: isLoadingHolidays, mutate } = useHolidays(undefined, { search });
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<HolidayResponseType>();
    const [key, setKey] = useState<string>('');

    const openModal = (key: string, record?: HolidayResponseType) => {
        setKey(key);
        setSelectedRecord(record);
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedRecord(undefined);
        setKey('');
    };
    const handleConfirm = async () => {
        try {
            if (selectedRecord) await holidayService.delete(selectedRecord?.id);
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    const holidayCols = useHolidayCols({ open: openModal });
    const { exportBasic } = useExportToExcel(holidayCols, 'NationalHolidays', 'NationalHolidays');
    const handleExportExcel = () => {
        if (!holidays || holidays.length === 0) return;
        exportBasic(holidays);
    };

    return (
        <div>
            <div className="flex flex-wrap items-end gap-2 mb-4">
                <Button icon={<PlusOutlined />} onClick={() => openModal('create')}>
                    {t.utils.add}
                </Button>
                <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
                    {t.utils.export}
                </Button>
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
            {key === 'delete' && (
                <ModalConfirm
                    isOpen={isOpenModal}
                    confirmAndClose={async () => {
                        await handleConfirm();
                        closeModal();
                    }}
                    toggleModal={closeModal}
                />
            )}
            {(key === 'create' || key === 'modify') && (
                <Modal open={isOpenModal} centered footer={null} onCancel={closeModal} width={700}>
                    <HolidayForm
                        close={closeModal}
                        mutate={mutate}
                        record={key === 'modify' ? selectedRecord : undefined}
                    />
                </Modal>
            )}
        </div>
    );
}

export default NationalHolidays;
