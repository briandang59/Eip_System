import { Button, Input, Modal, Select } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';
import { useState } from 'react';
import { useJobTitle } from '@/apis/useSwr/jobTitle';
import { JobTitleResponseType } from '@/types/response/jobTitle';
import { useJobTitleCols } from '@/utils/constants/cols/jobTitleCols';
import ModalConfirm from '../common/ModalConfirm';
import JobtitleForm from '../forms/JobtitleForm';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';

function JobTitles() {
    const { t } = useTranslationCustom();
    const [search, setSearch] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<JobTitleResponseType>();
    const [key, setKey] = useState<string>('');

    const openModal = (key: string, record?: JobTitleResponseType) => {
        setKey(key);
        setSelectedRecord(record);
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedRecord(undefined);
        setKey('');
    };
    const typeOptions = [
        { label: 'Product', value: 1 },
        { label: 'Office', value: 2 },
    ];
    const [classId, setClassId] = useState<number>(typeOptions[0].value);

    const {
        jobTitles,
        isLoading: isLoadingJobTitles,
        mutate,
    } = useJobTitle({ classid: classId }, { search });
    const jobTitleCols = useJobTitleCols({ open: openModal });
    const { exportBasic } = useExportToExcel(jobTitleCols, 'JobTitles', 'JobTitles');
    const handleExportExcel = () => {
        if (!jobTitles || jobTitles.length === 0) return;
        exportBasic(jobTitles);
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
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.utils.type}</span>
                    <Select
                        placeholder={t.utils.search}
                        style={{ width: 200 }}
                        allowClear
                        options={typeOptions}
                        onChange={(value) => setClassId(value)}
                        value={classId}
                        loading={isLoadingJobTitles}
                    />
                </div>
            </div>
            <GenericTable<JobTitleResponseType>
                columns={jobTitleCols}
                dataSource={jobTitles || []}
                rowKey="id"
                isLoading={isLoadingJobTitles}
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
                <Modal centered width={500} footer={null} onCancel={closeModal} open={isOpenModal}>
                    <JobtitleForm
                        close={closeModal}
                        mutate={mutate}
                        record={key === 'modify' ? selectedRecord : undefined}
                    />
                </Modal>
            ) : (
                <ModalConfirm
                    isOpen={isOpenModal}
                    toggleModal={closeModal}
                    confirmAndClose={() => {
                        closeModal();
                    }}
                />
            )}
        </div>
    );
}

export default JobTitles;
