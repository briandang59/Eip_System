import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormInput, FormTextArea } from '../formsComponent';
import { toast } from 'sonner';
import { fabricManagementTypeServices } from '@/apis/services/fabricManagementType';
import { FabricManagementTypeResponseType } from '@/types/response/fabricManagementType';
import { useEffect } from 'react';
const schema = yup
    .object({
        fabric_code: yup.string().required(),
        customer_id: yup.string().nullable().default(null),
        fabric_name: yup.string().nullable().default(null),
        fabric_width: yup.number().nullable().default(null),
        fabric_weight: yup.number().nullable().default(null),
        warp_density: yup.number().nullable().default(null),
        weft_density: yup.number().nullable().default(null),
        machine_warp_density: yup.number().nullable().default(null),
        machine_weft_density: yup.number().nullable().default(null),
        raw_fabric_warp_density: yup.number().nullable().default(null),
        raw_fabric_weft_density: yup.number().nullable().default(null),
        raw_fabric_spec: yup.string().nullable().default(null),
        finished_product_spec: yup.string().nullable().default(null),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

interface FabricManagementTypeFormProps {
    close: () => void;
    mutate: () => void;
    record?: FabricManagementTypeResponseType;
    setSelectedRecord?: (record: FabricManagementTypeResponseType) => void;
}
function FabricManagementTypeForm({
    close,
    mutate,
    record,
    setSelectedRecord,
}: FabricManagementTypeFormProps) {
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
                customer_id: record.customer_id,
                fabric_code: record.fabric_code,
                fabric_name: record.fabric_name,
                fabric_width: record.fabric_width,
                fabric_weight: record.fabric_weight,
                warp_density: record.warp_density,
                weft_density: record.weft_density,
                machine_warp_density: record.machine_warp_density,
                machine_weft_density: record.machine_weft_density,
                raw_fabric_warp_density: record.raw_fabric_warp_density,
                raw_fabric_weft_density: record.raw_fabric_weft_density,
                raw_fabric_spec: record.raw_fabric_spec,
                finished_product_spec: record.finished_product_spec,
            });
        } else {
            reset();
        }
    }, [record, reset]);
    const onSubmit = async (data: FormData) => {
        try {
            if (record && setSelectedRecord) {
                await fabricManagementTypeServices.modify(data, record.fabric_code);
                setSelectedRecord(record);
            } else {
                await fabricManagementTypeServices.add(data);
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
            <div className="grid grid-cols-3 gap-2 mb-8">
                <FormInput
                    control={control}
                    name="fabric_code"
                    label={t.fabric_management_type.form.fabric_code}
                    size="large"
                    error={errors.fabric_code?.message}
                    required
                />
                <FormInput
                    control={control}
                    name="customer_id"
                    label={t.fabric_management_type.form.customer}
                    size="large"
                    error={errors.customer_id?.message}
                    type="number"
                />
                <FormInput
                    control={control}
                    name="fabric_name"
                    label={t.fabric_management_type.form.fabric_name}
                    size="large"
                    error={errors.fabric_name?.message}
                />
                <FormInput
                    control={control}
                    name="fabric_width"
                    label={t.fabric_management_type.form.fabric_width}
                    size="large"
                    error={errors.fabric_width?.message}
                    type="number"
                />
                <FormInput
                    control={control}
                    name="fabric_weight"
                    label={t.fabric_management_type.form.fabric_weight}
                    size="large"
                    error={errors.fabric_weight?.message}
                    type="number"
                />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-8">
                <FormInput
                    control={control}
                    name="warp_density"
                    label={t.fabric_management_type.form.warp_density}
                    size="large"
                    error={errors.warp_density?.message}
                />
                <FormInput
                    control={control}
                    name="weft_density"
                    label={t.fabric_management_type.form.weft_density}
                    size="large"
                    error={errors.weft_density?.message}
                />
                <FormInput
                    control={control}
                    name="machine_warp_density"
                    label={t.fabric_management_type.form.machine_warp_density}
                    size="large"
                    error={errors.machine_warp_density?.message}
                />
                <FormInput
                    control={control}
                    name="machine_weft_density"
                    label={t.fabric_management_type.form.machine_weft_density}
                    size="large"
                    error={errors.machine_weft_density?.message}
                />
                <FormInput
                    control={control}
                    name="raw_fabric_warp_density"
                    label={t.fabric_management_type.form.raw_fabric_warp_density}
                    size="large"
                    error={errors.raw_fabric_warp_density?.message}
                />
                <FormInput
                    control={control}
                    name="raw_fabric_weft_density"
                    label={t.fabric_management_type.form.raw_fabric_weft_density}
                    size="large"
                    error={errors.raw_fabric_weft_density?.message}
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <FormTextArea
                    control={control}
                    name="raw_fabric_spec"
                    label={t.fabric_management_type.form.raw_fabric_spec}
                    size="large"
                />
                <FormTextArea
                    control={control}
                    name="finished_product_spec"
                    label={t.fabric_management_type.form.finished_product_spec}
                    size="large"
                />
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

export default FabricManagementTypeForm;
