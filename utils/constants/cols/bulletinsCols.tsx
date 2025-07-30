import { BulletinsResponseType } from '@/types/response/bulletins';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Popover, TableColumnsType } from 'antd';
import { File, Pen, Settings, Trash } from 'lucide-react';

interface params {
    openModalConfirm: (selectedBulletin: BulletinsResponseType) => void;
    openModalForm: (selectedBulletin: BulletinsResponseType) => void;
}
export const useBulletinsCols = ({
    openModalConfirm,
    openModalForm,
}: params): TableColumnsType<BulletinsResponseType> => {
    const { t, lang } = useTranslationCustom();

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
            title: t.bulletins.form.title_en,
            key: 'title_en',
            width: 200,
            render: (record: BulletinsResponseType) => (
                <div className="line-clamp-3">
                    {getLocalizedName(record?.title_en, record?.title_zh, record?.title_vn, lang)}
                </div>
            ),
        },
        {
            title: t.bulletins.form.content_en,
            key: 'content_en',
            width: 500,
            render: (record: BulletinsResponseType) => (
                <div className="line-clamp-3">
                    {' '}
                    {getLocalizedName(
                        record?.content_en,
                        record?.content_zh,
                        record?.content_vn,
                        lang,
                    )}
                </div>
            ),
        },

        {
            title: t.bulletins.form.global_label,
            dataIndex: ['is_global'],
            key: 'is_global',
            width: 200,
            render: (text: boolean) => <div className="line-clamp-3">{text ? 'yes' : 'no'}</div>,
        },
        {
            title: t.bulletins.form.global_label,
            dataIndex: ['is_pinned'],
            key: 'is_pinned',
            width: 200,
            render: (text: boolean) => (
                <div className="line-clamp-3">{text ? 'pinned' : 'not-pin'}</div>
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
                                <File className="size-[14px] !text-blue-500" />
                                <p className="text-blue-500">{item.file_name}</p>
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
            render: (_, record: BulletinsResponseType) => {
                return (
                    <div className="flex items-center gap-2">
                        <Popover
                            trigger="click"
                            content={
                                <div className="flex flex-col gap-2">
                                    <Button
                                        icon={<Pen className="size-4 !text-blue-700" />}
                                        onClick={() => openModalForm(record)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        icon={<Trash className="size-4 !text-red-700" />}
                                        onClick={() => openModalConfirm(record)}
                                    >
                                        Delete
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
