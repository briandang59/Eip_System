import { useTranslationCustom } from '@/utils/hooks';
import { OutputData } from '@editorjs/editorjs';
import dynamic from 'next/dynamic';

const EditorComponent = dynamic(() => import('@/components/common/EditorComponent'), {
    ssr: false,
});
interface EditorBulletinSectionProps {
    contentEN: OutputData;
    contentZH: OutputData;
    contentVN: OutputData;
    setContentEN: (data: OutputData) => void;
    setContentZH: (data: OutputData) => void;
    setContentVN: (data: OutputData) => void;
}
function EditorBulletinSection({
    contentEN,
    contentZH,
    contentVN,
    setContentEN,
    setContentZH,
    setContentVN,
}: EditorBulletinSectionProps) {
    const { t } = useTranslationCustom();
    return (
        <div className="flex flex-col gap-4">
            <EditorComponent
                data={contentEN}
                onChange={(data) => {
                    setContentEN(data);
                }}
                label={t.bulletins.form.content_en}
            />
            <EditorComponent
                data={contentZH}
                onChange={(data) => {
                    setContentZH(data);
                }}
                label={t.bulletins.form.content_zh}
            />
            <EditorComponent
                data={contentVN}
                onChange={(data) => {
                    setContentVN(data);
                }}
                label={t.bulletins.form.content_vn}
            />
        </div>
    );
}

export default EditorBulletinSection;
