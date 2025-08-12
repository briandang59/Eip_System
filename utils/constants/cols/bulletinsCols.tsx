import { BulletinsResponseType } from '@/types/response/bulletins';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { renderEditorJsContent } from '@/utils/functions/renderEditorJsToHtml';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Popover, TableColumnsType } from 'antd';
import { File, Pen, Settings, Trash, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface params {
    openModalConfirm: (selectedBulletin: BulletinsResponseType) => void;
    openModalForm: (selectedBulletin: BulletinsResponseType) => void;
}
export const useBulletinsCols = ({
    openModalConfirm,
    openModalForm,
}: params): TableColumnsType<BulletinsResponseType> => {
    const { t, lang } = useTranslationCustom();
    const router = useRouter();

    return [
        {
            title: 'Stt',
            width: 60,
            dataIndex: 'stt',
            key: 'stt',
            fixed: 'left',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t.bulletins.title,
            key: 'title',
            width: 200,
            render: (record: BulletinsResponseType) => (
                <div className="line-clamp-3">
                    {getLocalizedName(record?.title_en, record?.title_zh, record?.title_vn, lang)}
                </div>
            ),
        },
        {
            title: t.bulletins.content,
            key: 'content',
            width: 500,
            render: (record: BulletinsResponseType) => {
                const content = getLocalizedName(
                    record?.content_en,
                    record?.content_zh,
                    record?.content_vn,
                    lang,
                );
                return (
                    <div className="line-clamp-3">
                        {content && (
                            <div
                                className="line-clamp-3 editor-content"
                                dangerouslySetInnerHTML={renderEditorJsContent(JSON.parse(content))}
                            />
                        )}
                    </div>
                );
            },
        },
        {
            title: t.bulletins.is_global,
            dataIndex: ['is_global'],
            key: 'is_global',
            width: 200,
            render: (text: boolean) => (
                <div className="line-clamp-3">{text ? t.bulletins.no : t.bulletins.yes}</div>
            ),
        },
        {
            title: t.bulletins.is_pinned,
            dataIndex: ['is_pinned'],
            key: 'is_pinned',
            width: 200,
            render: (text: boolean) => (
                <div className="line-clamp-3">{text ? t.bulletins.yes : t.bulletins.no}</div>
            ),
        },
        {
            title: t.bulletins.attachments,
            key: 'attachments',
            width: 200,
            render: (record: BulletinsResponseType) => (
                <div className="line-clamp-3">
                    {Array.isArray(record?.attachments) &&
                        record.attachments.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-[20px] flex items-center justify-center">
                                    <File className="size-[14px] !text-blue-500" />
                                </div>
                                <p className="text-blue-500 line-clamp-1 text-sm">
                                    {item.file_name}
                                </p>
                            </div>
                        ))}
                </div>
            ),
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
            width: 40,
            fixed: 'right',
            render: (_, record: BulletinsResponseType) => {
                return (
                    <div className="flex items-center gap-2">
                        <Popover
                            trigger="click"
                            content={
                                <div className="flex flex-col gap-2">
                                    <Button
                                        icon={<Eye className="size-4 !text-blue-700" />}
                                        onClick={() => router.push(`/bulletins/${record.id}`)}
                                    >
                                        {t.common.forms.view}
                                    </Button>
                                    <Button
                                        icon={<Pen className="size-4 !text-blue-700" />}
                                        onClick={() => openModalForm(record)}
                                    >
                                        {t.common.forms.edit}
                                    </Button>
                                    <Button
                                        icon={<Trash className="size-4 !text-red-700" />}
                                        onClick={() => openModalConfirm(record)}
                                    >
                                        {t.common.forms.delete}
                                    </Button>
                                </div>
                            }
                        >
                            <Button icon={<Settings className="size-4 !text-green-700" />}></Button>
                        </Popover>
                    </div>
                );
            },
        },
    ];
};
