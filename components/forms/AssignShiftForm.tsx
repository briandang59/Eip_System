import { Button, Form } from 'antd';
import { FormDatePicker, FormSelect, FormTextArea } from '../formsComponent';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useShifts } from '@/apis/useSwr/shift';
import { toast } from 'sonner';
import { ShiftCreateRequestType } from '@/types/requests/shift';
import { shiftService } from '@/apis/services/shift';
import dayjs from 'dayjs';

interface AssignShiftProps {
    mutate: () => void;
    close: () => void;
    card_number: string;
}
function AssignShiftForm({ mutate, close, card_number }: AssignShiftProps) {
    const { t } = useTranslationCustom();
    const { shifts, isLoading: isLoadingShift } = useShifts();
    const schema = yup
        .object({
            shift_id: yup.number().required(),
            start: yup.string().required(),
            end: yup.string().required(),
            memo: yup.string().default(''),
        })
        .required();
    type FormData = yup.InferType<typeof schema>;
    const { control, handleSubmit } = useForm<FormData>({
        resolver: yupResolver(schema),
    });
    const onSubmit = async (data: FormData) => {
        try {
            const newData: ShiftCreateRequestType = {
                card_numbers: [card_number],
                end: dayjs(data.end).format('YYYY-MM-DD'),
                start: dayjs(data.start).format('YYYY-MM-DD'),
                shift_id: data.shift_id,
                note: data.memo,
            };
            await shiftService.add(newData);
            mutate();
            close();
            toast.success(t.resign_form.success);
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
            <div className="col-span-2">
                <FormSelect
                    control={control}
                    name="shift_id"
                    label={t.assign_shift.shift_type}
                    required
                    options={
                        shifts.map((item) => ({
                            value: item.id,
                            label: `${item.tag} - (${item.start_time}-${item.end_time})`,
                        })) || []
                    }
                    loading={isLoadingShift}
                    placeholder="Please select"
                    size="large"
                />
            </div>

            <FormDatePicker
                control={control}
                name="start"
                label={t.assign_shift.start_date}
                required
                size="large"
            />
            <FormDatePicker
                control={control}
                name="end"
                label={t.assign_shift.end_date}
                required
                size="large"
            />

            <div className="col-span-2">
                <FormTextArea
                    control={control}
                    name="memo"
                    label={t.assign_shift.note}
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

export default AssignShiftForm;
