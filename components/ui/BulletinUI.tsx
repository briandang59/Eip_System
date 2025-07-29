import { BulletinsResponseType } from '@/types/response/bulletins';
import { routes } from '@/utils/constants/common/routes';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Calendar, Pin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BulletinUIProps {
    record: BulletinsResponseType;
}
function BulletinUI({ record }: BulletinUIProps) {
    const router = useRouter();
    const handleRedirect = () => {
        router.replace(`${routes.bulletins.root}/${record.id}`);
    };
    const isPinned = record?.is_pinned;
    const { lang, t } = useTranslationCustom();
    return (
        <div
            className="p-4 min-w-4xl rounded-[10px] border border-gray-200 shadow-md h-[200px] flex flex-col gap-2 cursor-pointer hover:border-green-600 duration-300"
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
                ) : (
                    <button className="rounded-full border border-gray-200 p-[4px_10px] cursor-pointer flex items-center gap-2">
                        <Pin className="size-[14px] !text-black" />{' '}
                        <p className="font-medium text-black text-[12px]">{t.bulletins.pin}</p>
                    </button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="size-[14px] !text-blue-600" />
                <p>
                    {record?.start_date} - {record?.end_date}
                </p>
            </div>
            <p className="text-gray-600 line-clamp-4">
                {getLocalizedName(record?.content_en, record?.content_zh, record?.content_vn, lang)}
            </p>
        </div>
    );
}

export default BulletinUI;
