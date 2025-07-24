import { Button, Form } from 'antd';
import { FormDatePicker, FormInput } from '../formsComponent';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import * as yup from 'yup';

import { toast } from 'sonner';
import { HolidayResponseType } from '@/types/response/holiday';
import { holidayService } from '@/apis/services/holiday';
import dayjs from 'dayjs';
const schema = yup
    .object({
        name_en: yup.string().required(),
        name_zh: yup.string().required(),
        name_vn: yup.string().required(),
        date: yup.string().required(),
    })
    .required();

type FormData = Omit<yup.InferType<typeof schema>, 'date'> & { date: any };

interface HolidayFormProps {
    record?: HolidayResponseType;
    close: () => void;
    mutate: () => void;
}
function HolidayForm({ record, close, mutate }: HolidayFormProps) {
    const { t } = useTranslationCustom();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name_en: '',
            name_zh: '',
            name_vn: '',
            date: undefined,
        },
    });
    useEffect(() => {
        if (record) {
            reset({
                name_en: record?.name_en,
                name_zh: record?.name_zh,
                name_vn: record?.name_vn,
                date: record?.date ? dayjs(record.date) : undefined,
            });
        } else {
            reset({
                name_en: '',
                name_zh: '',
                name_vn: '',
                date: undefined,
            });
        }
    }, [reset, record]);

    const onSubmit = async (data: FormData) => {
        try {
            if (!data.date) {
                toast.error('Date is required');
                return;
            }
            const submitData = {
                ...data,
                date: dayjs(data.date).format('YYYY-MM-DD'),
            };
            if (record) {
                await holidayService.modify({ ...submitData, id: record.id });
            } else {
                await holidayService.add(submitData);
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
            <FormDatePicker
                control={control}
                name="date"
                label={t.assign_shift.start_date}
                required
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

export default HolidayForm;
