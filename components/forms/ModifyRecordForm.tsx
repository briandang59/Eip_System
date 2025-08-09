import { Button, Form } from 'antd';
import { FormDatePicker, FormTextArea } from '../formsComponent';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import * as yup from 'yup';

import { toast } from 'sonner';
import dayjs from 'dayjs';
import { CareerHistoryResponseType } from '@/types/response/dailyCareerRecord';
import { employeeRecordService } from '@/apis/services/employeeRecord';
const schema = yup
    .object({
        event_date: yup.mixed().required(),
        memo: yup.string().required(),
    })
    .required();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormData = Omit<yup.InferType<typeof schema>, 'event_date'> & { event_date: any };

interface ModifyRecordFormProps {
    record?: CareerHistoryResponseType;
    close: () => void;
    mutate: () => void;
}
export function ModifyRecordForm({ record, close, mutate }: ModifyRecordFormProps) {
    const { t } = useTranslationCustom();
    const { control, handleSubmit, reset } = useForm<FormData>({
        resolver: yupResolver(schema),
    });
    useEffect(() => {
        if (record) {
            reset({
                event_date: record?.event_date ? dayjs(record.event_date) : null,
                memo: record?.memo,
            });
        } else {
            reset({
                event_date: null,
                memo: '',
            });
        }
    }, [reset, record]);

    const onSubmit = async (data: FormData) => {
        try {
            if (!data.event_date) {
                toast.error('Date is required');
                return;
            }
            const submitData = {
                ...data,
                event_date: dayjs(data.event_date).format('YYYY-MM-DD'),
            };
            if (record) {
                await employeeRecordService.modify(submitData, record.id);
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
            <FormDatePicker
                control={control}
                name="event_date"
                label={t.assign_shift.start_date}
                required
                size="large"
            />
            <FormTextArea
                control={control}
                name="memo"
                label={t.education_form.name_vn}
                size="large"
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
