import { Button, Input } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';

import { useState } from 'react';

import { useLanguages } from '@/apis/useSwr/languages';
import { LanguageResponseType } from '@/types/response/languages';
import { useLanguageCols } from '@/utils/constants/cols/languageCols';

function Languages() {
    const { t } = useTranslationCustom();
    const languageCols = useLanguageCols();
    const [search, setSearch] = useState('');

    const { languages, isLoading: isLoadingLanguages } = useLanguages(undefined, { search });

    return (
        <div>
            <div className="flex flex-wrap items-end gap-2 mb-4">
                <Button icon={<PlusOutlined />}>{t.utils.add}</Button>
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
        </div>
    );
}

export default Languages;
