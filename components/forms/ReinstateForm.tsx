import { Button, Form } from 'antd';
import { FormDatePicker, FormTextArea } from '../formsComponent';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

import { toast } from 'sonner';
import { reinstateService } from '@/apis/services/reinstate';

interface ReinstateFormProps {
    card_number: string;
    mutate: () => void;
    close: () => void;
}
function ReinstateForm({ card_number, mutate, close }: ReinstateFormProps) {
    const schema = yup
        .object({
            effect_date: yup.string().required(),
            memo: yup.string().default(''),
        })
        .required();
    type FormData = yup.InferType<typeof schema>;
    const { control, handleSubmit } = useForm<FormData>({
        resolver: yupResolver(schema),
    });
    const { t } = useTranslationCustom();

    const onSubmit = async (data: FormData) => {
        try {
            const newData = {
                ...data,
                card_number,
            };
            await reinstateService.add(newData);
            toast.success(t.resign_form.success);
            mutate();
            close();
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <Form
            layout="vertical"
            className="w-full flex flex-col gap-2"
            onFinish={handleSubmit(onSubmit)}
        >
            <FormDatePicker
                control={control}
                name="effect_date"
                label={t.reinstate_form.effect_date}
                required
                size="large"
            />

            <FormTextArea
                control={control}
                name="memo"
                label={t.reinstate_form.memo}
                placeholder="Enter memo"
                size="large"
            />
            <div className="col-span-2 flex items-center justify-end">
                <Form.Item>
                    <div className="flex items-center gap-2">
                        <Button htmlType="button" onClick={close}>
                            {t.resign_form.cancel}
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {t.resign_form.submit}
                        </Button>
                    </div>
                </Form.Item>
            </div>
        </Form>
    );
}

export default ReinstateForm;
