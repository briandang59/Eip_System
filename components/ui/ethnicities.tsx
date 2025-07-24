import { Button, Input, Modal } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';

import { useState } from 'react';

import { useEthnics } from '@/apis/useSwr/ethnic';
import { EthnicResponseType } from '@/types/response/ethnic';
import { useEthnicCols } from '@/utils/constants/cols/ethnicCols';
import EthnicForm from '../forms/EthnicForm';
import ModalConfirm from '../common/ModalConfirm';
import { dormitoryService } from '@/apis/services/dormitory';
import { toast } from 'sonner';

function Ethnicities() {
    const { t } = useTranslationCustom();
    const [search, setSearch] = useState('');

    const { ethnics, isLoading: isLoadingEthnics, mutate } = useEthnics({ search });
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<EthnicResponseType>();
    const [key, setKey] = useState<string>('');

    const openModal = (key: string, record?: EthnicResponseType) => {
        setKey(key);
        setSelectedRecord(record);
        setIsOpenModal(true);
    };

    const close = () => {
        setKey('');
        setSelectedRecord(undefined);
        setIsOpenModal(false);
    };
    const ethnicCols = useEthnicCols({ open: openModal });
    const handleConfirm = async () => {
        try {
            if (selectedRecord) await dormitoryService.remove(selectedRecord?.id);
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    return (
        <div>
            <div className="flex flex-wrap items-end gap-2 mb-4">
                <Button icon={<PlusOutlined />} onClick={() => openModal('create', undefined)}>
                    {t.utils.add}
                </Button>
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
            <GenericTable<EthnicResponseType>
                columns={ethnicCols}
                dataSource={ethnics || []}
                rowKey="id"
                isLoading={isLoadingEthnics}
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
            {key === 'modify' || key === 'create' ? (
                <Modal open={isOpenModal} centered footer={null} onCancel={close} width={500}>
                    <EthnicForm
                        close={close}
                        mutate={mutate}
                        record={key === 'modify' ? selectedRecord : undefined}
                    />
                </Modal>
            ) : (
                <ModalConfirm
                    isOpen={isOpenModal}
                    confirmAndClose={async () => {
                        await handleConfirm();
                        close();
                    }}
                    toggleModal={close}
                />
            )}
        </div>
    );
}

export default Ethnicities;
