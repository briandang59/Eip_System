'use client';
import { bulletinsService } from '@/apis/services/bulletins';
import { useManageBulletins } from '@/apis/useSwr/bulletins';
import { GenericTable } from '@/components/common/GenericTable';
import ModalConfirm from '@/components/common/ModalConfirm';
import BulletinsForm from '@/components/forms/BulletinsForm';
import { BulletinsResponseType } from '@/types/response/bulletins';
import { useBulletinsCols } from '@/utils/constants/cols/bulletinsCols';
import { Button, Modal } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function ManageBulletins() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [selectedBulletin, setSelectedBulletin] = useState<BulletinsResponseType>();
    const [key, setKey] = useState('');
    const {
        bulletins,
        isLoading: isLoadingBulletins,
        mutate: mutateBulletins,
    } = useManageBulletins();

    const openModal = (bulletin?: BulletinsResponseType) => {
        setIsOpenModal(true);
        setKey('create');

        if (bulletin) {
            setSelectedBulletin(bulletin);
            setKey('modify');
        }
    };
    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedBulletin(undefined);
        setKey('');
    };

    const openModalConfirm = (bulletin: BulletinsResponseType) => {
        setSelectedBulletin(bulletin);
        setIsOpenModalConfirm(true);
    };
    const closeModalConfirm = () => {
        setIsOpenModalConfirm(false);
        setSelectedBulletin(undefined);
    };

    const handleConfirmDelete = async () => {
        try {
            if (selectedBulletin) {
                await bulletinsService.remove(selectedBulletin.id);
                closeModalConfirm();
                mutateBulletins();
                toast.success('Bulletin deleted successfully');
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    const bulletinsCols = useBulletinsCols({ openModalConfirm, openModalForm: openModal });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-end gap-2">
                <Button
                    onClick={() => openModal()}
                    icon={<Plus className="!text-green-700 size-[14px]" />}
                >
                    Add
                </Button>
            </div>
            <GenericTable<BulletinsResponseType>
                columns={bulletinsCols}
                dataSource={bulletins || []}
                rowKey="stt"
                isLoading={isLoadingBulletins}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: 'default',
                }}
            />
            <Modal
                title="Add Bulletin"
                open={isOpenModal}
                onCancel={closeModal}
                footer={null}
                width={1000}
                centered
            >
                <BulletinsForm
                    close={closeModal}
                    bulletin={key === 'modify' ? selectedBulletin : undefined}
                    mutate={mutateBulletins}
                />
            </Modal>
            <ModalConfirm
                isOpen={isOpenModalConfirm}
                confirmAndClose={handleConfirmDelete}
                toggleModal={closeModalConfirm}
            />
        </div>
    );
}

export default ManageBulletins;
