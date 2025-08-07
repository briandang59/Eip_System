import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormInput } from '../formsComponent';
import { AttendanceV2Type } from '@/types/response/attendance';
import { toast } from 'sonner';
import { overtimeService } from '@/apis/services/overtime';
import { useEmployees } from '@/apis/useSwr/employees';
import { useOvertime } from '@/apis/useSwr/overtime';
import { Trash } from 'lucide-react';
import dayjs from 'dayjs';

interface OvertimeProps {
    attendance: AttendanceV2Type;
    mutate: () => void;
    close: () => void;
}
function Overtime({ attendance, mutate, close }: OvertimeProps) {
    const { t } = useTranslationCustom();
    
    const { employees } = useEmployees({ card_number: attendance.card_number });
    const overtimeParams = {
        start_time: `${attendance.details[0].date} 00:00:00`,
        end_time: `${attendance.details[0].date} 23:59:59`,
        ...(employees?.[0]?.work_place_id && {
            place_id: employees[0].work_place_id ?? 0,
            uuid: employees[0].uuid,
            unit_id: employees[0].unit?.id ?? 0,
        }),
    };

    const { overtimes, mutate: overtimeMutate } = useOvertime(overtimeParams);

    const schema = yup
        .object({
            hours: yup.number().required('Hours is required'),
        })
        .required();

    type FormData = yup.InferType<typeof schema>;
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            hours: 0,
        },
    });
    const handleDelete = async (id: number) => {
        await overtimeService
            .delete(id)
            .then((res) => {
                if (res) {
                    toast.success(t.overtime.success);
                    overtimeMutate();
                }
            })
            .catch((err) => toast.error(`${err}`));
    };
    const onSubmit = async (data: FormData) => {
        try {
            if (!employees?.length) return;
            const newData = {
                uuid: employees[0].uuid,
                start_time: `${attendance.details[0].date} 00:00:00`,
                end_time: `${attendance.details[0].date} 23:59:59`,
                hour: data.hours,
                reason: '',
            };
            await overtimeService
                .add([newData])
                .then((res) => {
                    if (res) {
                        toast.success(t.overtime.success);
                        reset();
                        mutate();
                        close();
                    }
                })
                .catch((err) => toast.error(`${err}`));
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    return (
        <Form onFinish={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <p className="text-[16px] font-bold">
                    {t.overtime.date}:{' '}
                    <span className="text-green-700">{attendance?.details[0]?.date}</span>
                </p>
                <p className="text-[16px] font-bold">
                    {t.overtime.employee}:{' '}
                    <span className="text-green-700">{attendance?.fullname}</span>
                </p>
                <p className="text-[16px] font-bold">
                    {t.overtime.card_number}:{' '}
                    <span className="text-green-700">{attendance?.card_number}</span>
                </p>
                <p className="text-[16px] font-bold">
                    {t.overtime.department}:{' '}
                    <span className="text-green-700">{attendance?.unit.name_en}</span>
                </p>
            </div>
            <FormInput
                control={control}
                name="hours"
                label="Overtime"
                placeholder="Enter your username"
                size="large"
                type="number"
                required
                error={errors.hours?.message}
            />
            <ul className="flex flex-col gap-4 my-4">
                {overtimes?.map((item, index) => (
                    <li key={index}>
                        <div className="p-2 rounded-[10px] border border-green-700 flex justify-between gap-2 bg-green-100">
                            <p className="font-bold">{t.overtime.date}:</p>
                            {dayjs(item.start_time).format('YYYY-MM-DD')}
                            <p className="font-bold">{t.overtime.overtime_hours}:</p>
                            {item.hours}
                            <button
                                className="flex items-center justify-center cursor-pointer"
                                type="button"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash strokeWidth={1.5} className="w-4 h-4 text-red-600" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <Form.Item>
                <div className="flex justify-end gap-2">
                    <Button htmlType="button" onClick={close}>
                        {t.common.forms.cancel}
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {t.common.forms.submit}
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default Overtime;
