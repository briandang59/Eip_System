import { Button, Form } from 'antd';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';
import { FormDatePicker, FormInput, FormSelect } from '../formsComponent';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import DragAndDropUpload from '../common/DragAndDropUpLoad';
import { useEffect, useMemo, useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { bulletinsService } from '@/apis/services/bulletins';
import { BulletinsResponseType } from '@/types/response/bulletins';
import { useAttachmentsStore } from '@/stores/useAttachmentsStore';
import { yupResolver } from '@hookform/resolvers/yup';

const EditorComponent = dynamic(() => import('@/components/common/EditorComponent'), {
    ssr: false,
});
import { OutputData } from '@editorjs/editorjs';
import dynamic from 'next/dynamic';
import { useUnits } from '@/apis/useSwr/units';
import { useEmployees } from '@/apis/useSwr/employees';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';

const schema = yup
    .object({
        title_vn: yup.string().required(),
        title_en: yup.string().required(),
        title_zh: yup.string().required(),
        start_date: yup.string().required(),
        end_date: yup.string().required(),
        work_places: yup.array(yup.number()).required(),
        departments: yup.array(yup.number()).nullable().default([]),
        target_employee: yup.array(yup.string()).nullable().default([]),
        is_global: yup.string().required(),
        is_pinned: yup.string().required(),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

interface BulletinsFormProps {
    close: () => void;
    bulletin?: BulletinsResponseType;
    mutate: () => void;
}
function BulletinsForm({ close, bulletin, mutate }: BulletinsFormProps) {
    const { t, lang } = useTranslationCustom();
    const [files, setFiles] = useState<RcFile[]>([]);
    const { workPlaces, isLoading: isLoadingWorkPlace } = useWorkPlaces();
    const { setAttachments, attachments } = useAttachmentsStore();
    const [contentZH, setContentZH] = useState<OutputData>({
        blocks: [],
    });
    const [contentEN, setContentEN] = useState<OutputData>({
        blocks: [],
    });

    const [contentVN, setContentVN] = useState<OutputData>({
        blocks: [],
    });

    const [searchEmployee, setSearchEmployee] = useState<string>('');
    const [searchUnit, setSearchUnit] = useState<string>('');

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
                start_date: bulletin.start_date,
                end_date: bulletin.end_date,
                work_places: bulletin.work_places || [],
                departments: bulletin.departments || [],
                target_employee: bulletin.target_employee || [],
                is_global: String(bulletin.is_global),
                is_pinned: String(bulletin.is_pinned),
            });
            setContentEN(JSON.parse(bulletin.content_en));
            setContentZH(JSON.parse(bulletin.content_zh));
            setContentVN(JSON.parse(bulletin.content_vn));
            setAttachments(bulletin.attachments || []);
        }
    }, [reset, bulletin, setAttachments]);

    const workplace_ids =
        useWatch({
            name: 'work_places',
            control,
        }) || [];

    const stringWorkplaces = useMemo(() => {
        return workplace_ids?.length ? workplace_ids.join(',') : '0';
    }, [workplace_ids]);

    const { units, isLoading: isLoadingUnits } = useUnits(
        { place_ids: stringWorkplaces },
        { search: searchUnit },
    );
    const { employees, isLoading: isLoadingEmployees } = useEmployees({
        place_ids: stringWorkplaces,
        card_number: searchEmployee,
    });

    const onSubmit = async (data: FormData) => {
        try {
            const newData = {
                ...data,
                content_vn: JSON.stringify(contentVN),
                content_en: JSON.stringify(contentEN),
                content_zh: JSON.stringify(contentZH),
                is_global: data.is_global === 'true',
                is_pinned: data.is_pinned === 'true',
                files: files,
                work_places: (data.work_places || []).filter(
                    (id): id is number => typeof id === 'number',
                ),
                departments: (data.departments ?? []).filter(
                    (d): d is number => typeof d === 'number',
                ),
                target_employee: (data.target_employee ?? []).filter(
                    (id): id is string => typeof id === 'string',
                ),
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
            mutate();
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const isGlobalOptions = [
        { label: t.bulletins.form.is_global, value: 'true' },
        { label: t.bulletins.form.is_not_global, value: 'false' },
    ];
    const isPinnedOptions = [
        { label: t.bulletins.yes, value: 'true' },
        { label: t.bulletins.no, value: 'false' },
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
            <div className="grid grid-cols-3 gap-2">
                <FormSelect
                    control={control}
                    name="work_places"
                    label={t.bulletins.form.workplace}
                    size="large"
                    options={workPlaces?.map((item) => ({
                        label: item.name_en,
                        value: item.id,
                    }))}
                    mode="multiple"
                    loading={isLoadingWorkPlace}
                    required
                    showSearch
                />
                <FormSelect
                    control={control}
                    name="departments"
                    label={t.bulletins.form.departments}
                    size="large"
                    options={units?.map((item) => ({
                        label: `${item.code} - ${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                        value: item.id,
                    }))}
                    mode="multiple"
                    loading={isLoadingUnits}
                    showSearch
                    onSearch={(e) => setSearchUnit(e)}
                />
                <FormSelect
                    control={control}
                    name="target_employee"
                    label={t.bulletins.form.target_user}
                    size="large"
                    options={employees?.map((item) => ({
                        label: `${item.card_number} - ${item.fullname}`,
                        value: item.uuid,
                    }))}
                    mode="multiple"
                    loading={isLoadingEmployees}
                    showSearch
                    onSearch={(e) => setSearchEmployee(e)}
                />
                <FormSelect
                    control={control}
                    name="is_global"
                    label={t.bulletins.form.global_label}
                    size="large"
                    options={isGlobalOptions}
                    required
                />
                <FormSelect
                    control={control}
                    name="is_pinned"
                    label={t.bulletins.is_pinned}
                    size="large"
                    options={isPinnedOptions}
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
