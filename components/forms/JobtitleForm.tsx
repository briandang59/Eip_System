import { Button, Form } from 'antd';
import { FormInput, FormSelect } from '../formsComponent';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import * as yup from 'yup';

import { toast } from 'sonner';
import { JobTitleResponseType } from '@/types/response/jobTitle';
import { jobtitleService } from '@/apis/services/jobtitle';
import { useEmployeeClass } from '@/apis/useSwr/employeeClass';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
const schema = yup
    .object({
        name_en: yup.string().required(),
        name_zh: yup.string().required(),
        name_vn: yup.string().required(),
        class_id: yup.number().required(),
        code: yup.string().required(),
        order: yup.string().required(),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

interface JobtitleFormProps {
    record?: JobTitleResponseType;
    close: () => void;
    mutate: () => void;
}
function JobtitleForm({ record, close, mutate }: JobtitleFormProps) {
    const { t, lang } = useTranslationCustom();
    const { employeeClasses, isLoading: isLoadingEmployeeClasses } = useEmployeeClass();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });
    useEffect(() => {
        if (record) {
            reset({
                name_en: record?.name_en,
                name_zh: record?.name_zh,
                name_vn: record?.name_vn,
                class_id: record?.employee_class,
                code: record?.code,
                order: record?.order.toString(),
            });
        }
    }, [reset, record]);

    const onSubmit = async (data: FormData) => {
        try {
            if (record) {
                const modifyData = {
                    ...data,
                    id: record?.id,
                };
                await jobtitleService.modify(modifyData);
            } else {
                await jobtitleService.add(data);
            }
            toast.success('successed');
            mutate();
            reset();
            close();
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <Form
            className="flex flex-col gap-2 space-y-2"
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
        >
            <FormInput
                control={control}
                name="name_en"
                label={t.education_form.name_en}
                size="large"
                error={errors.name_en?.message}
                required
            />
            <FormInput
                control={control}
                name="name_zh"
                label={t.education_form.name_zh}
                size="large"
                error={errors.name_zh?.message}
                required
            />
            <FormInput
                control={control}
                name="name_vn"
                label={t.education_form.name_vn}
                size="large"
                error={errors.name_vn?.message}
                required
            />
            <FormInput
                control={control}
                name="code"
                label={t.jobtitle.code}
                size="large"
                error={errors.code?.message}
                required
            />
            <FormInput
                control={control}
                name="order"
                label={t.jobtitle.order}
                size="large"
                error={errors.order?.message}
                required
            />
            <FormSelect
                control={control}
                name="class_id"
                label={t.jobtitle.class}
                required
                options={
                    employeeClasses?.map((item) => ({
                        label: `${getLocalizedName(item?.name_en, item?.name_zh, item?.name_vn, lang)}`,
                        value: item.id,
                    })) || []
                }
                loading={isLoadingEmployeeClasses}
                placeholder="Please select"
                size="large"
            />
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

export default JobtitleForm;
