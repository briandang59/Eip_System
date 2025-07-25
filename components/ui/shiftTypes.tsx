import { Button, Input, Modal } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';

import { useState } from 'react';

import { useShifts } from '@/apis/useSwr/shift';
import { useShiftCols } from '@/utils/constants/cols/shiftCols';
import { ShiftType } from '@/types/response/shiftType';
import ShifTypeForm from '../forms/ShiftTypeForm';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';

function ShiftTypes() {
    const { t } = useTranslationCustom();
    const [search, setSearch] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<ShiftType>();
    const [key, setKey] = useState<string>('');

    const openModal = (key: string, record?: ShiftType) => {
        setKey(key);
        setSelectedRecord(record);
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedRecord(undefined);
        setKey('');
    };
    const { shifts, isLoading: isLoadingShifts, mutate } = useShifts({ search });
    const shiftCols = useShiftCols({ open: openModal });
    const shiftsArray = shifts ? Object.values(shifts) : [];
    const { exportBasic } = useExportToExcel(shiftCols, 'ShiftTypes', 'ShiftTypes');
    const handleExportExcel = () => {
        if (!shiftsArray || shiftsArray.length === 0) return;
        exportBasic(shiftsArray);
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

            {(key === 'create' || key === 'modify') && (
                <Modal open={isOpenModal} centered footer={null} onCancel={closeModal} width={700}>
                    <ShifTypeForm
                        close={closeModal}
                        mutate={mutate}
                        record={key === 'modify' ? selectedRecord : undefined}
                    />
                </Modal>
            )}
        </div>
    );
}

export default ShiftTypes;
