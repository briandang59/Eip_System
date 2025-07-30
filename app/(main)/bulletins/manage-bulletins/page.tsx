'use client';
import { bulletinsService } from '@/apis/services/bulletins';
import { useManageBulletins } from '@/apis/useSwr/bulletins';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { GenericTable } from '@/components/common/GenericTable';
import ModalConfirm from '@/components/common/ModalConfirm';
import BulletinsForm from '@/components/forms/BulletinsForm';
import { BulletinsResponseType } from '@/types/response/bulletins';
import { useBulletinsCols } from '@/utils/constants/cols/bulletinsCols';
import { getInfomation } from '@/utils/functions/getInfomation';
import { Button, Modal, Select } from 'antd';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

function ManageBulletins() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [selectedBulletin, setSelectedBulletin] = useState<BulletinsResponseType>();
    const [key, setKey] = useState('');
    const myInfor = useMemo(() => getInfomation(), []);

    const [selectedWorkPlace, setSelectedWorkPlace] = useState<number[]>([]);
    const { workPlaces, isLoading: isLoadingWorkplace } = useWorkPlaces();
    const {
        bulletins,
        isLoading: isLoadingBulletins,
        mutate: mutateBulletins,
    } = useManageBulletins({ work_places: `[${selectedWorkPlace.join(',')}]` });

    useEffect(() => {
        if (myInfor?.work_place_id) {
            setSelectedWorkPlace([myInfor.work_place_id]);
        }
    }, [myInfor]);
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
    const handleWorkPlaceChange = (value: number[]) => {
        setSelectedWorkPlace(value);
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
                <Select
                    className="w-[300px]"
                    options={workPlaces?.map((item) => ({
                        label: item.name_en,
                        value: item.id,
                    }))}
                    mode="multiple"
                    onChange={handleWorkPlaceChange}
                    loading={isLoadingWorkplace}
                    placeholder="Select Work Places"
                    allowClear
                />
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
