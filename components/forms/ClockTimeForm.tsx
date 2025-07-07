'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Radio } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormDatePicker, FormInput, FormSelect, FormTextArea } from '../formsComponent';
// import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { AttendanceV2Type } from '@/types/response/attendance';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { generateShiftDates } from '@/utils/functions/generateDateByShift';
import { toast } from 'sonner';
import { useAttendanceModifyReasonList } from '@/apis/useSwr/attendanceModifyReasonList';
import { attendanceService } from '@/apis/services/attendance';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

interface Params {
    attendance: AttendanceV2Type | null;
    mutate: () => void;
    close: () => void;
}

/* 1. Schema ― có thể đổi message i18n khi cần */
const schema = yup
    .object({
        card_number: yup.string().required(),
        reason_id: yup.number().required(),
        reason_text: yup.string().nullable().default(''),
        clockin: yup.string().required(),
        clockout: yup.string().required(),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

function ClockTimeForm({ attendance, mutate, close }: Params) {
    const { t } = useTranslationCustom();
    const { reasonList, isLoading: isLoadingReasonList } = useAttendanceModifyReasonList();
    const [selectedRemoveOption, setSelectedRemoveOption] = useState<number | null>(null);
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            card_number: '',
            reason_id: undefined,
            reason_text: '',
            clockin: '',
            clockout: '',
        },
    });

    useEffect(() => {
        if (!attendance) return;
        const detail = attendance?.details?.[0];
        if (detail.shift === null) return;
        const { startDate, endDate } = generateShiftDates(
            detail.date,
            detail.shift.start_time,
            detail.shift.end_time,
        );
        reset({
            card_number: attendance.card_number,
            reason_id: 1,
            reason_text: '',
            clockin: detail?.attendance?.[0]?.T1?.time
                ? dayjs(detail.attendance[0].T1.time).format('YYYY-MM-DD HH:mm:ss')
                : dayjs(`${startDate} ${detail.shift.start_time}`, 'YYYY-MM-DD HH:mm').format(
                      'YYYY-MM-DD HH:mm:ss',
                  ),
            clockout: detail?.attendance?.[0]?.T2?.time
                ? dayjs(detail.attendance[0].T2.time).format('YYYY-MM-DD HH:mm:ss')
                : dayjs(`${endDate} ${detail.shift.end_time}`, 'YYYY-MM-DD HH:mm').format(
                      'YYYY-MM-DD HH:mm:ss',
                  ),
        });
    }, [attendance?.card_number, reset, attendance]);

    const onSubmit = async (data: FormData) => {
        if (!attendance) return;
        const detail = attendance?.details[0];
        if (detail?.attendance[0]?.id && detail.shift) {
            const updateData = {
                id: detail?.attendance[0]?.id,
                modify_reason_id: data.reason_id,
                shift_id: detail.shift.id,
                erase_clockin: selectedRemoveOption === 1,
                erase_clockout: selectedRemoveOption === 1 || selectedRemoveOption === 2,
                clockin_time: data.clockin,
                clockout_time: data.clockout,
                date: detail?.date,
            };
            await attendanceService
                .update(updateData)
                .then((res) => {
                    if (res) {
                        toast.success(t.edit_clock.success);
                        reset();
                        mutate();
                        setSelectedRemoveOption(null);
                        close();
                    }
                })
                .catch((err) => toast.error(`${err}`));
        } else {
            const newData = {
                card_number: data.card_number,
                reason_id: data.reason_id,
                reason_text: data.reason_text,
                clockin_time: data.clockin,
                clockout_time: data.clockout,
                date: detail?.date,
            };

            await attendanceService
                .add(newData)
                .then((res) => {
                    if (res) {
                        toast.success(t.edit_clock.success);
                        reset();
                        mutate();
                        setSelectedRemoveOption(null);
                        close();
                    }
                })
                .catch((err) => toast.error(`${err}`));
        }

        try {
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <Form
            className="grid grid-cols-2 gap-2"
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
        >
            <FormInput
                control={control}
                name="card_number"
                label={t.edit_clock.card_number}
                placeholder="Enter your card number"
                required
                error={errors.card_number?.message}
                disabled
            />

            <FormSelect
                control={control}
                name="reason_id"
                label={t.edit_clock.reason_type}
                required
                options={reasonList?.map((item) => ({
                    value: item.id,
                    label: item.reason_en,
                }))}
                placeholder="Chọn loại nghỉ phép"
                loading={isLoadingReasonList}
            />

            <div className="col-span-2">
                <FormTextArea
                    control={control}
                    name="reason_text"
                    label={t.edit_clock.description}
                    placeholder="Nhập lý do"
                    // error={errors.reason_text?.message}
                />
            </div>

            <FormDatePicker
                control={control}
                name="clockin"
                label={t.edit_clock.clockin}
                required
                showTime
            />

            <FormDatePicker
                control={control}
                name="clockout"
                label={t.edit_clock.clockout}
                required
                showTime
            />

            {attendance?.details[0]?.attendance[0]?.id && (
                <div className="p-2 rounded-[10px] border border-red-600 bg-red-50 h-[100px] col-span-2 mb-4">
                    <h3 className="font-bold text-red-600 mb-4">{t.edit_clock.delete_title}</h3>
                    <Radio.Group
                        value={selectedRemoveOption}
                        options={[
                            { value: 1, label: t.edit_clock.both },
                            { value: 2, label: t.edit_clock.only_clockout },
                        ]}
                        onChange={(e) => setSelectedRemoveOption(e.target.value)}
                    />
                </div>
            )}
            <div className="col-span-2">
                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button htmlType="button" onClick={close}>
                            {t.edit_clock.cancel}
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {t.edit_clock.submit}
                        </Button>
                    </div>
                </Form.Item>
            </div>
        </Form>
    );
}

export default ClockTimeForm;
