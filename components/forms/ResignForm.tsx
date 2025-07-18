import { Button, Form } from 'antd';
import { FormDatePicker, FormSelect, FormTextArea } from '../formsComponent';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useReasonResign } from '@/apis/useSwr/reasonResign';
import { useResignType } from '@/apis/useSwr/resignType';
import { useEffect, useState } from 'react';
import { ReasonDetailType } from '@/types/response/reasonResign';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { toast } from 'sonner';
import { ResignRequestType } from '@/types/requests/resign';
import { resignService } from '@/apis/services/resign';
import dayjs from 'dayjs';

interface ResignFormProps {
    card_number: string;
    mutate: () => void;
    close: () => void;
}
function ResignForm({ card_number, mutate, close }: ResignFormProps) {
    const schema = yup
        .object({
            resign_type_id: yup.number().required(),
            quit_date: yup.string().required(),
            resign_reason: yup.number().default(null),
            resign_reason_detail: yup.number().default(null),
            memo: yup.string().default(null),
        })
        .required();
    type FormData = yup.InferType<typeof schema>;
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });
    const { t, lang } = useTranslationCustom();
    const { reasonResigns, isLoading: isLoadingReasonResign } = useReasonResign();
    const { resignTypes, isLoading: isLoadingResignType } = useResignType();
    const classIdReason = useWatch({ control, name: 'resign_reason' });
    const [reasonDetails, setReasonDetails] = useState<ReasonDetailType[]>([]);
    useEffect(() => {
        if (classIdReason) {
            const data = reasonResigns?.find((item) => item.class_id === classIdReason);
            if (data) {
                setReasonDetails(data?.reason_list ?? []);
            }
        }
    }, [classIdReason]);
    const onSubmit = async (data: FormData) => {
        try {
            const newData: ResignRequestType = {
                card_number: card_number,
                effect_date: dayjs(data.quit_date).format('YYYY-MM-DD'),
                resign_type_id: data?.resign_type_id,
                memo: data.memo,
                resign_reason_id: data?.resign_reason,
            };
            await resignService.add(newData).then((res) => {
                if (res) {
                    toast.success('success');
                    mutate();
                    close();
                }
            });
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <Form
            layout="vertical"
            className="w-full grid grid-cols-2 gap-2"
            onFinish={handleSubmit(onSubmit)}
        >
            <FormSelect
                control={control}
                name="resign_type_id"
                label={t.resign_form.resign_type}
                required
                options={
                    resignTypes.map((item) => ({
                        label: `${getLocalizedName(item?.name_en, item?.name_zh, item?.name_vn, lang)}`,
                        value: item.id,
                    })) || []
                }
                loading={isLoadingResignType}
                placeholder="Please select"
                size="large"
            />

            <FormDatePicker
                control={control}
                name="quit_date"
                label={t.resign_form.quit_date}
                required
                size="large"
            />
            <FormSelect
                control={control}
                name="resign_reason"
                label={t.resign_form.reason}
                options={
                    reasonResigns?.map((item) => ({
                        value: item.class_id,
                        label: item.class_name_vn,
                    })) || []
                }
                loading={isLoadingReasonResign}
                size="large"
                placeholder="Please select"
            />
            <FormSelect
                control={control}
                name="resign_reason_detail"
                label={t.resign_form.reason_detail}
                options={
                    reasonDetails.map((item) => ({
                        value: item?.id,
                        label: `${getLocalizedName(item?.name_en, item?.name_zh, item?.name_vn, lang)}`,
                    })) || []
                }
                placeholder="Please select"
                size="large"
            />

            <div className="col-span-2">
                <FormTextArea
                    control={control}
                    name="memo"
                    label={t.resign_form.memo}
                    placeholder="Enter memo"
                    size="large"
                />
            </div>
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

export default ResignForm;
