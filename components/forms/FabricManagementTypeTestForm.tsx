import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormDatePicker, FormInput, FormTextArea } from '../formsComponent';
import { toast } from 'sonner';
import { fabricManagementTypeTestServices } from '@/apis/services/fabricManagementTypeTest';
import { useEffect } from 'react';
import { FabricTypeTestResponseType } from '@/types/response/fabricTest';
const schema = yup
    .object({
        temperature: yup.number().required(),
        duration: yup.number().required(),
        pre_wash_weight: yup.number().required(),
        post_wash_weight: yup.number().required(),
        pre_wash_warp: yup.number().required(),
        post_wash_warp: yup.number().required(),
        pre_wash_weft: yup.number().required(),
        post_wash_weft: yup.number().required(),
        test_date: yup.string().required(),
        notes: yup.string().nullable().default(null),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

interface FabricManagementTypeTestFormProps {
    close: () => void;
    mutate: () => void;
    record?: FabricTypeTestResponseType;
    code: string;
}
function FabricManagementTypeTestForm({
    close,
    mutate,
    record,
    code,
}: FabricManagementTypeTestFormProps) {
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
                temperature: record?.temperature,
                duration: record?.duration,
                pre_wash_weight: record?.pre_wash_weight,
                post_wash_weight: record?.post_wash_weight,
                pre_wash_warp: record?.pre_wash_warp,
                post_wash_warp: record?.post_wash_warp,
                pre_wash_weft: record?.pre_wash_weft,
                post_wash_weft: record?.post_wash_weft,
                test_date: record?.test_date,
                notes: record?.notes,
            });
        } else {
            reset();
        }
    }, [record, reset]);
    const onSubmit = async (data: FormData) => {
        try {
            await fabricManagementTypeTestServices.add(data, code);
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
            <div className="grid grid-cols-3 gap-2 mb-8">
                <FormInput
                    control={control}
                    name="temperature"
                    label={t.fabric_management_type.form.temperature}
                    size="large"
                    error={errors.temperature?.message}
                    required
                />
                <FormInput
                    control={control}
                    name="duration"
                    label={t.fabric_management_type.form.duration}
                    size="large"
                    error={errors.duration?.message}
                    required
                    type="number"
                />
                <FormInput
                    control={control}
                    name="pre_wash_weight"
                    label={t.fabric_management_type.form.pre_wash_weight}
                    size="large"
                    error={errors.pre_wash_weight?.message}
                    required
                />
                <FormInput
                    control={control}
                    name="post_wash_weight"
                    label={t.fabric_management_type.form.post_wash_weight}
                    size="large"
                    error={errors.post_wash_weight?.message}
                    required
                    type="number"
                />
                <FormInput
                    control={control}
                    name="pre_wash_warp"
                    label={t.fabric_management_type.form.pre_wash_warp}
                    size="large"
                    error={errors.pre_wash_warp?.message}
                    required
                    type="number"
                />
                <FormInput
                    control={control}
                    name="post_wash_warp"
                    label={t.fabric_management_type.form.post_wash_warp}
                    size="large"
                    error={errors.post_wash_warp?.message}
                    required
                />
                <FormInput
                    control={control}
                    name="pre_wash_weft"
                    label={t.fabric_management_type.form.pre_wash_weft}
                    size="large"
                    error={errors.pre_wash_weft?.message}
                    required
                />
                <FormInput
                    control={control}
                    name="post_wash_weft"
                    label={t.fabric_management_type.form.post_wash_weft}
                    size="large"
                    error={errors.post_wash_weft?.message}
                    required
                />
                <FormDatePicker
                    control={control}
                    name="test_date"
                    label={t.fabric_management_type.form.test_date}
                    size="large"
                    required
                />
                <div className="col-span-3">
                    <FormTextArea
                        control={control}
                        name="notes"
                        label={t.fabric_management_type.form.notes}
                        size="large"
                    />
                </div>
            </div>

            <div className="col-span-2">
                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={() => {
                                reset();
                                close();
                            }}
                            htmlType="button"
                        >
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

export default FabricManagementTypeTestForm;
