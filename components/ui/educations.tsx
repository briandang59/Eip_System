import { Button, Input, Modal } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';

import { useState } from 'react';
import { useEducations } from '@/apis/useSwr/educations';
import { useEducationCols } from '@/utils/constants/cols/educationCols';
import { EducationResponseType } from '@/types/response/education';
import EducationForm from '../forms/EducationForm';
import ModalConfirm from '../common/ModalConfirm';
import { toast } from 'sonner';
import { educationService } from '@/apis/services/education';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';

function Educations() {
    const { t } = useTranslationCustom();
    const [search, setSearch] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [key, setKey] = useState<string>('');
    const [selectedRecord, setSelectedRecord] = useState<EducationResponseType>();

    const open = (key: string, record?: EducationResponseType) => {
        setKey(key);
        setSelectedRecord(record);
        setIsOpenModal(true);
    };

    const close = () => {
        setKey('');
        setSelectedRecord(undefined);
        setIsOpenModal(false);
    };
    const educationCols = useEducationCols({ open });
    const { exportBasic } = useExportToExcel(educationCols, 'Educations', 'Educations');
    const handleExportExcel = () => {
        if (!educations || educations.length === 0) return;
        exportBasic(educations);
    };
    const { educations, isLoading: isLoadingEducations, mutate } = useEducations({ search });

    const handleDelete = async () => {
        try {
            if (selectedRecord) await educationService.delete(selectedRecord?.id);
            toast.success(`${t.common.forms.successed}`);
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    return (
        <div>
            <div className="flex flex-wrap items-end gap-2 mb-4">
                <Button icon={<PlusOutlined />} onClick={() => open('create')}>
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
            <GenericTable<EducationResponseType>
                columns={educationCols}
                dataSource={educations || []}
                rowKey="id"
                isLoading={isLoadingEducations}
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
            {key !== 'delete' ? (
                <Modal open={isOpenModal} centered width={500} footer={null} onCancel={close}>
                    <EducationForm
                        close={close}
                        record={key === 'modify' ? selectedRecord : undefined}
                        mutate={mutate}
                    />
                </Modal>
            ) : (
                <ModalConfirm
                    isOpen={isOpenModal}
                    toggleModal={close}
                    confirmAndClose={() => {
                        handleDelete();
                        close();
                    }}
                />
            )}
        </div>
    );
}

export default Educations;
