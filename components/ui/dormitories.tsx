import { Button, Input, Modal } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';

import { useState } from 'react';
import { useDormitories } from '@/apis/useSwr/dormitories';
import { DormitoriesResponseType } from '@/types/response/dormitories';
import { useDormitoriesCols } from '@/utils/constants/cols/dormitoryCols';
import DormitoriesForm from '../forms/DormitoriesForm';
import ModalConfirm from '../common/ModalConfirm';
import { dormitoryService } from '@/apis/services/dormitory';
import { toast } from 'sonner';

function Dormitories() {
    const { t } = useTranslationCustom();
    const [search, setSearch] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);

    const toggleModal = () => {
        setIsOpenModal(!isOpenModal);
    };
    const [selectedRecord, setSelectedRecord] = useState<DormitoriesResponseType>();
    const [key, setKey] = useState<string>('');
    const handleSelectedRecord = (record: DormitoriesResponseType) => {
        setSelectedRecord(record);
        toggleModal();
    };

    const handleOpenByKey = (key: string) => {
        switch (key) {
            case 'create':
                setKey('create');
                toggleModal();
            case 'modify':
                setKey('modify');
                toggleModal();
            case 'delete':
                setKey('delete');
                toggleModal();
        }
    };
    const dormitoriesCols = useDormitoriesCols({
        selectedRecord: handleSelectedRecord,
        setKey: handleOpenByKey,
    });
    const handleConfirm = async () => {
        try {
            if (selectedRecord) await dormitoryService.remove(selectedRecord?.id);
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    const { dormitories, isLoading: isLoadingDormitory, mutate } = useDormitories();
    return (
        <div>
            <div className="flex flex-wrap items-end gap-2 mb-4">
                <Button icon={<PlusOutlined />} onClick={toggleModal}>
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
            <GenericTable<DormitoriesResponseType>
                columns={dormitoriesCols}
                dataSource={dormitories || []}
                rowKey="id"
                isLoading={isLoadingDormitory}
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

            {key === 'delete' ? (
                <ModalConfirm
                    isOpen={isOpenModal}
                    confirmAndClose={handleConfirm}
                    toggleModal={toggleModal}
                />
            ) : (
                <Modal open={isOpenModal} centered footer={null} onCancel={toggleModal} width={700}>
                    <DormitoriesForm close={toggleModal} mutate={mutate} record={selectedRecord} />
                </Modal>
            )}
        </div>
    );
}

export default Dormitories;
