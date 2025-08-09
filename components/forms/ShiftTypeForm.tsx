import { ShiftType } from '@/types/response/shiftType';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormInput, FormSelect } from '../formsComponent';
import FormTimePicker from '../formsComponent/FormTimePicker';
import { useShiftPeriod } from '@/apis/useSwr/shiftPeriod';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { toast } from 'sonner';
import { shiftListTypeService } from '@/apis/services/shiftType';
const schema = yup
    .object({
        class_name: yup.string().required(),
        clockin_time: yup.string().required(),
        clockout_time: yup.string().required(),
        break_start: yup.string().required(),
        break_end: yup.string().required(),
        location: yup.string().required(),
        weekend: yup.string().required(),
        period_id: yup.number().required(),
        allow_auto_overtime: yup.string().oneOf(['true', 'false']).required(),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

interface ShifTypeFormProps {
    close: () => void;
    mutate: () => void;
    record?: ShiftType;
}
function ShifTypeForm({ close, mutate, record }: ShifTypeFormProps) {
    const { t, lang } = useTranslationCustom();
    const { shiftPeriod, isLoading: isLoadingShiftPeriod } = useShiftPeriod();
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
                class_name: record.tag || '',
                clockin_time: record.start_time || '',
                clockout_time: record.end_time || '',
                break_start: record.break_time?.start || '',
                break_end: record.break_time?.end || '',
                location: record.location || '',
                weekend: '',
                period_id: record.period_id?.id || undefined,
                allow_auto_overtime: record.allow_auto_overtime ? 'true' : 'false',
            });
        } else {
            reset({
                class_name: '',
                clockin_time: '',
                clockout_time: '',
                break_start: '',
                break_end: '',
                location: '',
                weekend: '',
                period_id: undefined,
                allow_auto_overtime: 'false',
            });
        }
    }, [reset, record]);
    const locationOptions = [
        {
            value: 'VN',
            label: 'VN',
        },
        {
            value: 'TW',
            label: 'TW',
        },
    ];
    const allowOvertime = [
        {
            value: 'true',
            label: 'yes',
        },
        {
            value: 'false',
            label: 'no',
        },
    ];
    const onSubmit = async (data: FormData) => {
        try {
            const submitData = {
                ...data,
                allow_auto_overtime: data.allow_auto_overtime === 'true',
            };
            if (record) {
                await shiftListTypeService.modify({ ...submitData, id: record.id });
            } else {
                await shiftListTypeService.add(submitData);
            }
            toast.success(`${t.common.forms.successed}`);
            mutate();
            close();
            reset();
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <Form
            className="grid grid-cols-2 gap-2 space-y-2"
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
        >
            <div className="col-span-2">
                <FormInput
                    control={control}
                    name="class_name"
                    label={t.shift_type_form.class_name}
                    size="large"
                    error={errors.class_name?.message}
                    required
                />
            </div>
            <FormTimePicker
                control={control}
                name="clockin_time"
                label={t.shift_type_form.clockin_time}
                required
                size="large"
            />
            <FormTimePicker
                control={control}
                name="clockout_time"
                label={t.shift_type_form.clockout_time}
                required
                size="large"
            />
            <FormTimePicker
                control={control}
                name="break_start"
                label={t.shift_type_form.break_start}
                required
                size="large"
            />
            <FormTimePicker
                control={control}
                name="break_end"
                label={t.shift_type_form.break_end}
                required
                size="large"
            />

            <div className="col-span-2 grid grid-cols-3 gap-2">
                <FormSelect
                    control={control}
                    name="period_id"
                    label={t.shift_type_form.period}
                    size="large"
                    options={
                        shiftPeriod?.map((item) => ({
                            label: `${getLocalizedName(item?.name_en, item?.name_zh, item?.name_vn, lang)}`,
                            value: item.id,
                        })) || []
                    }
                    loading={isLoadingShiftPeriod}
                    required
                />
                <FormSelect
                    control={control}
                    name="location"
                    label={t.shift_type_form.location}
                    size="large"
                    options={locationOptions}
                    required
                />
                <FormSelect
                    control={control}
                    name="allow_auto_overtime"
                    label={t.shift_type_form.allow_auto_overtime}
                    size="large"
                    options={allowOvertime}
                    required
                />
            </div>

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

export default ShifTypeForm;
