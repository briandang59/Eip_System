import { BulletinsResponseType } from '@/types/response/bulletins';
import { routes } from '@/utils/constants/common/routes';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { renderEditorJsToHtml } from '@/utils/functions/renderEditorJsToHtml';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Calendar, File, Pin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BulletinUIProps {
    record: BulletinsResponseType;
    width?: string;
    height?: string;
    viewType?: 'redirect' | 'modal';
    setSelectedBulletin?: (bulletin: BulletinsResponseType) => void;
}
function BulletinUI({
    record,
    width = 'min-w-4xl',
    height,
    viewType = 'redirect',
    setSelectedBulletin,
}: BulletinUIProps) {
    const router = useRouter();
    const handleRedirect = () => {
        if (viewType) router.replace(`${routes.bulletins.root}/${record.id}`);
        if (viewType === 'modal' && setSelectedBulletin) {
            setSelectedBulletin(record);
        }
    };
    const isPinned = record?.is_pinned;
    const { lang, t } = useTranslationCustom();
    const content = getLocalizedName(
        record?.content_en,
        record?.content_zh,
        record?.content_vn,
        lang,
    );
    return (
        <div
            className={`p-4 rounded-[10px] border bg-white border-gray-200 shadow-md h-[200px] flex flex-col gap-2 cursor-pointer hover:border-green-600 duration-300 ${width} ${height}`}
            onClick={() => handleRedirect()}
        >
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-[20px] font-bold">
                    {getLocalizedName(record?.title_en, record?.title_zh, record?.title_vn, lang)}
                </h3>
                {isPinned ? (
                    <button className="rounded-full bg-gradient-to-r from-green-500 to-green-700 p-[4px_10px] cursor-pointer flex items-center gap-2">
                        <Pin className="size-[14px] !text-white" />{' '}
                        <p className="font-medium text-white text-[12px]">{t.bulletins.pinned}</p>
                    </button>
                ) : null}
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="size-[14px] !text-blue-600" />
                <p>
                    {record?.start_date} - {record?.end_date}
                </p>
            </div>
            {content && (
                <div
                    className="text-gray-600 line-clamp-4"
                    dangerouslySetInnerHTML={renderEditorJsToHtml(JSON.parse(content))}
                />
            )}

            {record?.attachments?.length > 0 && (
                <div className="flex items-center gap-2">
                    <File className="size-[14px] !text-green-600" />
                    <p className="text-green-700">
                        {t.bulletins.attachments} ({record?.attachments?.length}){' '}
                    </p>
                </div>
            )}
        </div>
    );
}

export default BulletinUI;
