import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormInput, FormSelect } from '../formsComponent';
import { useNations } from '@/apis/useSwr/nation';
import { EthnicResponseType } from '@/types/response/ethnic';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ethnicService } from '@/apis/services/ethnic';
const schema = yup
    .object({
        name: yup.string().required(),
        nation_id: yup.number().required(),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

interface EthnicFormProps {
    record?: EthnicResponseType;
    close: () => void;
    mutate: () => void;
}
function EthnicForm({ record, close, mutate }: EthnicFormProps) {
    const { t } = useTranslationCustom();
    const { nations, isLoading } = useNations();
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
                name: record?.name,
                nation_id: record.nation_id,
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
                await ethnicService.modify(modifyData);
            } else {
                await ethnicService.add(data);
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
                name="name"
                label={t.department_form.name_en}
                size="large"
                error={errors.name?.message}
                required
            />

            <FormSelect
                control={control}
                name="nation_id"
                label={t.department_form.belonging_to}
                size="large"
                options={nations?.map((item) => ({
                    label: item.name_en,
                    value: item.id,
                }))}
                loading={isLoading}
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

export default EthnicForm;
