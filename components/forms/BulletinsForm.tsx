import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';
import { FormDatePicker, FormInput, FormSelect, FormTextArea } from '../formsComponent';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import DragAndDropUpload from '../common/DragAndDropUpLoad';
import { useEffect, useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { bulletinsService } from '@/apis/services/bulletins';
import { plainTextToMarkdown } from '@/utils/functions/plainTextToMarkdown';
import { BulletinsResponseType } from '@/types/response/bulletins';
import { useAttachmentsStore } from '@/stores/useAttachmentsStore';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup
    .object({
        title_vn: yup.string().required(),
        title_en: yup.string().required(),
        title_zh: yup.string().required(),
        content_vn: yup.string().required(),
        content_en: yup.string().required(),
        content_zh: yup.string().required(),
        start_date: yup.string().required(),
        end_date: yup.string().required(),
        work_places: yup.string().required(),
        is_global: yup.string().required(),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

interface BulletinsFormProps {
    close: () => void;
    bulletin?: BulletinsResponseType;
}
function BulletinsForm({ close, bulletin }: BulletinsFormProps) {
    const { t } = useTranslationCustom();
    const [files, setFiles] = useState<RcFile[]>([]);
    const { workPlaces, isLoading: isLoadingWorkPlace } = useWorkPlaces();
    const { setAttachments, attachments } = useAttachmentsStore();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (bulletin) {
            reset({
                title_vn: bulletin.title_vn,
                title_en: bulletin.title_en,
                title_zh: bulletin.title_zh,
                content_vn: bulletin.content_vn,
                content_en: bulletin.content_en,
                content_zh: bulletin.content_zh,
                start_date: bulletin.start_date,
                end_date: bulletin.end_date,
                work_places: bulletin.work_places,
                is_global: String(bulletin.is_global),
            });
            setAttachments(bulletin.attachments || []);
        }
    }, [reset, bulletin, setAttachments]);

    const onSubmit = async (data: FormData) => {
        try {
            const newData = {
                ...data,
                content_vn: plainTextToMarkdown(data.content_vn),
                content_en: plainTextToMarkdown(data.content_en),
                content_zh: plainTextToMarkdown(data.content_zh),
                is_global: data.is_global === 'true',
                is_pinned: false,
                files: files,
            };
            if (bulletin) {
                const modifydBulletin = {
                    ...newData,
                    files: files,
                };
                await bulletinsService.modify(modifydBulletin, bulletin.id);
            } else {
                await bulletinsService.add(newData);
            }
            toast.success(t.bulletins.form.success);
            reset();
            close();
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const isGlobalOptions = [
        { label: t.bulletins.form.is_global, value: 'true' },
        { label: t.bulletins.form.is_not_global, value: 'false' },
    ];
    return (
        <Form
            className="flex flex-col gap-2 space-y-2"
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
        >
            <FormInput
                control={control}
                name="title_en"
                label={t.bulletins.form.title_en}
                size="large"
                error={errors.title_en?.message}
                required
            />
            <FormInput
                control={control}
                name="title_zh"
                label={t.bulletins.form.title_zh}
                size="large"
                error={errors.title_zh?.message}
                required
            />
            <FormInput
                control={control}
                name="title_vn"
                label={t.bulletins.form.title_vn}
                size="large"
                error={errors.title_vn?.message}
                required
            />
            <div className="grid grid-cols-2 gap-2">
                <FormSelect
                    control={control}
                    name="work_places"
                    label={t.bulletins.form.workplace}
                    size="large"
                    options={workPlaces?.map((item) => ({
                        label: item.name_en,
                        value: item.id,
                    }))}
                    loading={isLoadingWorkPlace}
                    required
                />
                <FormSelect
                    control={control}
                    name="is_global"
                    label={t.bulletins.form.global_label}
                    size="large"
                    options={isGlobalOptions}
                    required
                />
                <FormDatePicker
                    control={control}
                    name="start_date"
                    label={t.bulletins.form.start_date}
                    required
                    size="large"
                />
                <FormDatePicker
                    control={control}
                    name="end_date"
                    label={t.bulletins.form.end_date}
                    required
                    size="large"
                />
            </div>
            <FormTextArea
                control={control}
                name="content_en"
                label={t.bulletins.form.content_en}
                size="large"
                required
                rows={6}
            />
            <FormTextArea
                control={control}
                name="content_zh"
                label={t.bulletins.form.content_zh}
                size="large"
                required
                rows={6}
            />
            <FormTextArea
                control={control}
                name="content_vn"
                label={t.bulletins.form.content_vn}
                size="large"
                required
                rows={6}
            />
            <DragAndDropUpload setFileListOutside={setFiles} />
            <div className="flex flex-col gap-2">
                {attachments.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold">{t.bulletins.attachments}</p>
                        <div className="flex flex-wrap gap-2">
                            {attachments.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2 bg-gray-100 p-2 rounded"
                                >
                                    <span>{item.file_name}</span>
                                    <Button type="link">{t.bulletins.form.cancel}</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="col-span-2">
                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={close} htmlType="button">
                            {t.department_form.cancel}
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {t.department_form.submit}
                        </Button>
                    </div>
                </Form.Item>
            </div>
        </Form>
    );
}

export default BulletinsForm;
