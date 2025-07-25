import { Button, Input, Modal } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';

import { useState } from 'react';
import { useNations } from '@/apis/useSwr/nation';
import { NationResponseType } from '@/types/response/nation';
import { useNationCols } from '@/utils/constants/cols/nationCols';
import ModalConfirm from '../common/ModalConfirm';
import NationForm from '../forms/NationForm';
import { nationService } from '@/apis/services/nation';
import { toast } from 'sonner';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';

function Nationalities() {
    const { t } = useTranslationCustom();
    const [search, setSearch] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<NationResponseType>();
    const [key, setKey] = useState<string>('');

    const openModal = (key: string, record?: NationResponseType) => {
        setKey(key);
        setSelectedRecord(record);
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedRecord(undefined);
        setKey('');
    };
    const nationCols = useNationCols({ open: openModal });
    const { exportBasic } = useExportToExcel(nationCols, 'Nationalities', 'Nationalities');
    const handleExportExcel = () => {
        if (!nations || nations.length === 0) return;
        exportBasic(nations);
    };
    const handleConfirm = async () => {
        try {
            if (selectedRecord) await nationService.delete(selectedRecord?.id);
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    const { nations, isLoading: isLoadingNations, mutate } = useNations(undefined, { search });

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
                    <NationForm
                        close={closeModal}
                        mutate={mutate}
                        record={key === 'modify' ? selectedRecord : undefined}
                    />
                </Modal>
            )}
        </div>
    );
}

export default Nationalities;
