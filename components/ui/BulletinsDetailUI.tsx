import { bulletinsService } from '@/apis/services/bulletins';
import { BulletinsResponseType } from '@/types/response/bulletins';
import { downloadBase64File } from '@/utils/functions/downloadBase64File';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { renderEditorJsToHtml } from '@/utils/functions/renderEditorJsToHtml';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Calendar, File } from 'lucide-react';
import { toast } from 'sonner';

interface BulletinsDetailUIProps {
    bulletinsDetail: BulletinsResponseType;
    viewType?: 'modal' | 'page';
}
function BulletinsDetailUI({ bulletinsDetail, viewType = 'page' }: BulletinsDetailUIProps) {
    const { lang, t } = useTranslationCustom();

    const handleDownload = async (name: string) => {
        try {
            const blob = await bulletinsService.download(name);
            downloadBase64File(blob.base64, blob.filename, blob.mimeType);
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    const content = getLocalizedName(
        bulletinsDetail?.content_en,
        bulletinsDetail?.content_zh,
        bulletinsDetail?.content_vn,
        lang,
    );
    return (
        <div
            className={`${viewType === 'modal' ? 'min-h-[500px]' : 'shadow-md border-gray-200 min-h-[500px] min-w-[1200px]  border'} flex flex-col justify-between gap-2 mb-4 p-4 rounded-lg bg-white `}
        >
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 pb-4 border-b border-gray-300">
                    <h1 className="text-[24px] font-bold">
                        {getLocalizedName(
                            bulletinsDetail?.title_en ?? '',
                            bulletinsDetail?.title_zh ?? '',
                            bulletinsDetail?.title_vn ?? '',
                            lang,
                        )}
                    </h1>
                    <div className="flex items-center gap-2">
                        <Calendar className="size-[16px] !text-blue-600" />
                        <p>
                            {bulletinsDetail?.start_date} - {bulletinsDetail?.end_date}
                        </p>
                    </div>
                </div>
                {content && (
                    <div dangerouslySetInnerHTML={renderEditorJsToHtml(JSON.parse(content))} />
                )}
            </div>
            <div className="flex flex-col p-2 border-t border-t-gray-200">
                <h2 className="text-[18px] font-medium">{t.bulletins.attachments}</h2>
                <div className="flex items-center gap-2 mt-4">
                    {bulletinsDetail?.attachments?.map((item) => (
                        <button
                            key={item.id}
                            className="flex items-center w-fit gap-2 border border-green-700 p-4 rounded-lg cursor-pointer hover:bg-green-100"
                            onClick={() => handleDownload(item.file_name)}
                        >
                            <File className="!text-green-700" />
                            <p className="text-green-700">{item.file_name}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BulletinsDetailUI;
