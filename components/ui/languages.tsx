import { Button, Input, Modal } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';

import { useState } from 'react';

import { useLanguages } from '@/apis/useSwr/languages';
import { LanguageResponseType } from '@/types/response/languages';
import { useLanguageCols } from '@/utils/constants/cols/languageCols';
import ModalConfirm from '../common/ModalConfirm';
import LanguageForm from '../forms/LanguageForm';
import { toast } from 'sonner';
import { languageService } from '@/apis/services/language';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';

function Languages() {
    const { t } = useTranslationCustom();
    const [search, setSearch] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [key, setKey] = useState<string>('');
    const [selectedRecord, setSelectedRecord] = useState<LanguageResponseType>();

    const open = (key: string, record?: LanguageResponseType) => {
        setKey(key);
        setSelectedRecord(record);
        setIsOpenModal(true);
    };

    const close = () => {
        setKey('');
        setSelectedRecord(undefined);
        setIsOpenModal(false);
    };

    const {
        languages,
        isLoading: isLoadingLanguages,
        mutate,
    } = useLanguages(undefined, { search });
    const languageCols = useLanguageCols({ open });
    const { exportBasic } = useExportToExcel(languageCols, 'Languages', 'Languages');
    const handleExportExcel = () => {
        if (!languages || languages.length === 0) return;
        exportBasic(languages);
    };

    const handlerDelete = async () => {
        try {
            if (selectedRecord) await languageService.delete(selectedRecord?.id);
            mutate();
            toast.success('successed');
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
            <GenericTable<LanguageResponseType>
                columns={languageCols}
                dataSource={languages || []}
                rowKey="id"
                isLoading={isLoadingLanguages}
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
                <Modal open={isOpenModal} centered footer={null} width={500} onCancel={close}>
                    <LanguageForm
                        close={close}
                        mutate={mutate}
                        record={key === 'modify' ? selectedRecord : undefined}
                    />
                </Modal>
            ) : (
                <ModalConfirm
                    isOpen={isOpenModal}
                    toggleModal={close}
                    confirmAndClose={() => {
                        handlerDelete();
                        close();
                    }}
                />
            )}
        </div>
    );
}

export default Languages;
