import { Button, Form } from 'antd';
import { FormInput } from '../formsComponent';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import * as yup from 'yup';
import { EducationResponseType } from '@/types/response/education';
import { educationService } from '@/apis/services/education';
import { toast } from 'sonner';
const schema = yup
    .object({
        name_en: yup.string().required(),
        name_zh: yup.string().required(),
        name_vn: yup.string().required(),
        level: yup.number().required(),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

interface EducationFormProps {
    record?: EducationResponseType;
    close: () => void;
    mutate: () => void;
}
function EducationForm({ record, close, mutate }: EducationFormProps) {
    const { t } = useTranslationCustom();
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
                level: record.level,
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
                await educationService.modify(modifyData);
            } else {
                await educationService.add(data);
            }
            toast.success(`${t.common.forms.successed}`);
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
                name="level"
                label={t.education_form.level}
                size="large"
                type="number"
                error={errors.level?.message}
                required
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

export default EducationForm;
