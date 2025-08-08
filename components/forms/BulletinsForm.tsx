import { Button, Form } from 'antd';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';
import { FormDatePicker, FormDateRangePicker, FormInput, FormSelect } from '../formsComponent';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import DragAndDropUpload from '../common/DragAndDropUpLoad';
import { useEffect, useMemo, useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { bulletinsService } from '@/apis/services/bulletins';
import { BulletinsResponseType } from '@/types/response/bulletins';
import { useAttachmentsStore } from '@/stores/useAttachmentsStore';
import { yupResolver } from '@hookform/resolvers/yup';

import { OutputData } from '@editorjs/editorjs';
import { useUnits } from '@/apis/useSwr/units';
import { useEmployees } from '@/apis/useSwr/employees';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import EditorBulletinSection from '../skeletons/EditorBulletinSection';
import dayjs from 'dayjs';

// Extend Window interface to include our custom property
declare global {
    interface Window {
        forceSaveBulletinContent?: () => void;
    }
}

const schema = yup
    .object({
        title_vn: yup.string().required(),
        title_en: yup.string().required(),
        title_zh: yup.string().required(),
        date_range: yup.array().of(yup.string()).length(2).required(),
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

// Helper function to check if content has meaningful data
const hasContent = (content: OutputData): boolean => {
    return (
        content?.blocks?.some(
            (block) =>
                block.data?.text?.trim() ||
                block.data?.items?.some((item: any) => item?.trim()) ||
                block.data?.caption?.trim() ||
                block.data?.text?.trim(),
        ) || false
    );
};

function BulletinsForm({ close, bulletin, mutate }: BulletinsFormProps) {
    const { t, lang } = useTranslationCustom();
    const [files, setFiles] = useState<RcFile[]>([]);
    const { workPlaces, isLoading: isLoadingWorkPlace } = useWorkPlaces();
    const { setAttachments, attachments } = useAttachmentsStore();
    const [step, setStep] = useState<number>(1);
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
        formState: { errors, isValid },
        watch,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    // Watch form values for validation
    const watchedValues = watch();

    useEffect(() => {
        if (bulletin) {
            // Edit mode - fill with existing data
            reset({
                title_vn: bulletin.title_vn,
                title_en: bulletin.title_en,
                title_zh: bulletin.title_zh,
                date_range: [bulletin.start_date, bulletin.end_date],
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
        } else {
            // Create mode - reset everything to empty
            reset({
                title_vn: '',
                title_en: '',
                title_zh: '',
                date_range: [],
                work_places: [],
                departments: [],
                target_employee: [],
                is_global: '',
                is_pinned: '',
            });
            setContentEN({ blocks: [] });
            setContentZH({ blocks: [] });
            setContentVN({ blocks: [] });
            setAttachments([]);
            setFiles([]);
            setStep(1);
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

    // Check if step 1 is complete
    const isStep1Complete = useMemo(() => {
        const requiredFields = [
            'title_vn',
            'title_en',
            'title_zh',
            'date_range',
            'work_places',
            'is_global',
            'is_pinned',
        ];

        const hasAllRequiredFields = requiredFields.every((field) => {
            const value = watchedValues[field as keyof FormData];
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return value && value.toString().trim() !== '';
        });

        return hasAllRequiredFields && isValid;
    }, [watchedValues, isValid]);

    // Check if step 2 is complete
    const isStep2Complete = useMemo(() => {
        return hasContent(contentEN) || hasContent(contentZH) || hasContent(contentVN);
    }, [contentEN, contentZH, contentVN]);

    const handleNextStep = () => {
        if (!isStep1Complete) {
            toast.error('Please complete all required fields in step 1');
            return;
        }
        setStep(2);
    };

    const onSubmit = async (data: FormData) => {
        try {
            // Force save all pending content before submission
            if (typeof window !== 'undefined' && window.forceSaveBulletinContent) {
                console.log('Force saving all content before submission...');
                window.forceSaveBulletinContent();
            }

            console.log('Content before submission:', {
                contentEN: contentEN,
                contentZH: contentZH,
                contentVN: contentVN,
            });

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
                start_date: dayjs(data.date_range?.[0]).format('YYYY-MM-DD') || '',
                end_date: dayjs(data.date_range?.[1]).format('YYYY-MM-DD') || '',
            };

            console.log('Submitting data:', newData);

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

            // Reset everything after successful submission
            reset({
                title_vn: '',
                title_en: '',
                title_zh: '',
                date_range: [],
                work_places: [],
                departments: [],
                target_employee: [],
                is_global: '',
                is_pinned: '',
            });
            setContentEN({ blocks: [] });
            setContentZH({ blocks: [] });
            setContentVN({ blocks: [] });
            setAttachments([]);
            setFiles([]);
            setStep(1);
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
            {step === 1 && (
                <div className="flex flex-col gap-2">
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
                        <FormDateRangePicker
                            control={control}
                            name="date_range"
                            label={t.bulletins.form.date_range}
                            required
                            size="large"
                        />
                    </div>

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
                    <div className="flex items-center justify-end">
                        <Button type="primary" onClick={handleNextStep} disabled={!isStep1Complete}>
                            {t.bulletins.form.next}
                        </Button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="flex flex-col gap-2">
                    <EditorBulletinSection
                        contentEN={contentEN}
                        contentZH={contentZH}
                        contentVN={contentVN}
                        setContentEN={setContentEN}
                        setContentZH={setContentZH}
                        setContentVN={setContentVN}
                    />
                    <div className="col-span-2">
                        <Form.Item>
                            <div className="flex justify-end gap-2">
                                <Button
                                    onClick={() => {
                                        setStep(1);
                                    }}
                                    htmlType="button"
                                >
                                    {t.bulletins.form.previous}
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={!isStep2Complete}
                                >
                                    {t.bulletins.form.submit}
                                </Button>
                            </div>
                        </Form.Item>
                    </div>
                </div>
            )}
        </Form>
    );
}

export default BulletinsForm;
