'use client';
import { useEmployees } from '@/apis/useSwr/employees';
import { useRemainHours } from '@/apis/useSwr/remainHours';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Form, Input, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { FormDateRangePicker, FormSelect } from '../formsComponent';
import { useDayOffType } from '@/apis/useSwr/dayoffType';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { generateDayOffRequests } from '@/utils/functions/generateDayOffRequest';
import { toast } from 'sonner';
import { dayOffService } from '@/apis/services/dayOff';

interface TakeLeaveFormProps {
    card_number?: string;
    isOpen: boolean;
    close: () => void;
    mutate?: () => void;
}

interface FormValueProps {
    type: number;
    range_date: string[];
    subtitute?: string;
    hours_A: number;
    hours_B: number;
    hours_C: number;
    hours_D: number;
}

function TakeLeaveForm({ card_number, isOpen, close, mutate }: TakeLeaveFormProps) {
    const { t, lang } = useTranslationCustom();
    const schema: yup.ObjectSchema<FormValueProps> = yup
        .object({
            range_date: yup
                .array()
                .of(yup.string().required())
                .length(2, t.take_leave.required_range_date)
                .required(),
            type: yup.number().required('Hãy chọn loại nghỉ'),
            subtitute: yup.string().optional(),
            hours_A: yup.number().required().min(0),
            hours_B: yup.number().required().min(0),
            hours_C: yup.number().required().min(0),
            hours_D: yup.number().required().min(0),
        })
        .required();
    const { control, handleSubmit, reset, setValue } = useForm<FormValueProps>({
        resolver: yupResolver(schema),
        defaultValues: {
            type: 0,
            subtitute: undefined,
            hours_A: 0,
            hours_B: 0,
            hours_C: 0,
            hours_D: 0,
        },
    });

    const [inputValue, setInputValue] = useState<string>('');
    const [card, setCard] = useState<string>('');

    const debouncedUpdate = useMemo(
        () =>
            debounce((value: string) => {
                setCard(value.trim());
            }, 500), // 500 ms
        [],
    );
    useEffect(() => {
        if (card_number) {
            setInputValue(card_number);
            setCard(card_number);
        }
    }, [card_number]);

    useEffect(() => {
        if (!isOpen) {
            debouncedUpdate.cancel();
            setCard('');
            setInputValue('');
            setValue('hours_A', 0);
            setValue('hours_B', 0);
            setValue('hours_C', 0);
            setValue('hours_D', 0);
            setValue('type', 0);
            setValue('subtitute', undefined);
        }
    }, [isOpen, debouncedUpdate, setValue]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setInputValue(val);
            debouncedUpdate(val);
        },
        [debouncedUpdate],
    );

    useEffect(() => {
        return () => debouncedUpdate.cancel();
    }, [debouncedUpdate]);

    const { employees, isLoading: employeeLoading } = useEmployees({
        card_number: card.toUpperCase(),
    });
    const { remainHours, isLoading: remainHourLoading } = useRemainHours({
        uuid: (employees && employees[0]?.uuid) || card,
    });
    const { dayoffTypes, isLoading: isLoadingDayOffType } = useDayOffType({
        nation: employees && employees[0]?.nation.name_en,
    });

    const filterDayOffType = dayoffTypes?.filter(
        (item) => item.id !== 1 && item.id !== 2 && item.id !== 3,
    );

    const hoursOptions = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 4,
            label: '4',
        },
        {
            value: 5,
            label: '5',
        },
        {
            value: 8,
            label: '8',
        },
        {
            value: 10,
            label: '10',
        },
    ];

    const onSubmit = async (data: FormValueProps) => {
        if (data && employees) {
            const records = generateDayOffRequests(data, employees[0].uuid);
            const LIMIT_HOURS = 10;
            const dateKey = (ts: string) => ts.split(' ')[0];

            const totalHoursByDate = records.reduce<Record<string, number>>((acc, rec) => {
                const key = dateKey(rec.start); // "2025‑07‑11"
                acc[key] = (acc[key] || 0) + rec.hours;
                return acc;
            }, {});

            // Kiểm tra ngày nào vượt giới hạn
            const exceededDates = Object.entries(totalHoursByDate).filter(
                ([, hours]) => hours > LIMIT_HOURS,
            );

            if (exceededDates.length) {
                toast.error(t.take_leave.err_2);
                return;
            }

            await dayOffService
                .add(records)
                .then((res) => {
                    if (res) {
                        toast.success(t.take_leave.success);
                        reset();
                        close();
                        if (mutate) mutate();
                    }
                })
                .catch(() => toast.error(t.take_leave.error));
        }
    };
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{t.take_leave.title}</h1>

            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2 text-green-700">
                    {t.take_leave.info}
                </h3>

                {employeeLoading ? (
                    <div className="h-[150px] flex items-center justify-center">
                        <Spin />
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <h4 className="text-[14px] font-medium">{t.take_leave.card_number}</h4>
                            <div className="w-[150px]">
                                <Input
                                    value={card_number || inputValue}
                                    onChange={handleChange}
                                    disabled={!!card_number}
                                    allowClear
                                />
                            </div>
                        </div>

                        <div className="col-span-1">
                            <h4 className="text-[14px] font-medium">{t.take_leave.full_name}</h4>
                            <p className="text-[14px]">
                                {(card && employees?.[0]?.fullname) ?? ''}
                            </p>
                        </div>
                        <div className="col-span-1">
                            <h4 className="text-[14px] font-medium">{t.take_leave.sex}</h4>
                            <p className="text-[14px]">
                                {card && employees?.[0]?.gender ? 'Male' : 'Female'}
                            </p>
                        </div>
                        <div className="col-span-1">
                            <h4 className="text-[14px] font-medium">{t.take_leave.nation}</h4>
                            <p className="text-[14px]">
                                {(card && employees?.[0]?.nation.name_en) ?? ''}
                            </p>
                        </div>
                        <div className="col-span-1">
                            <h4 className="text-[14px] font-medium">{t.take_leave.unit}</h4>
                            <p className="text-[14px]">
                                {(card && employees?.[0]?.unit.name_en) ?? ''}
                            </p>
                        </div>
                        <div className="col-span-1">
                            <h4 className="text-[14px] font-medium">{t.take_leave.job_title}</h4>
                            <p className="text-[14px]">
                                {(card && employees?.[0]?.job_title.name_en) ?? ''}
                            </p>
                        </div>
                    </div>
                )}

                <h3 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2 text-green-700">
                    {t.take_leave.leave_hours}
                </h3>
                {remainHourLoading ? (
                    <div className="h-[150px] flex items-center justify-center">
                        <Spin />
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 flex flex-col gap-2">
                            <h4 className="text-[14px] font-medium">{t.take_leave.year}</h4>
                            <p className="text-[14px">{new Date().getFullYear()}</p>
                        </div>
                        <div className="col-span-1 flex flex-col gap-2">
                            <h4 className="text-[14px] font-medium">{t.take_leave.used_hours}</h4>
                            <p className="text-[14px]">{remainHours?.this_year.used.hours ?? 0}</p>
                        </div>
                        <div className="col-span-1 flex flex-col gap-2">
                            <h4 className="text-[14px] font-medium">{t.take_leave.remain_hours}</h4>
                            <p className="text-[14px]">
                                {remainHours?.this_year.remain.hours ?? 0}
                            </p>
                        </div>
                        <div className="col-span-1 flex flex-col gap-2">
                            <h4 className="text-[14px] font-medium">
                                {t.take_leave.available_hours}
                            </h4>
                            <p className="text-[14px]">
                                {remainHours?.this_year.available.hours ?? 0}
                            </p>
                        </div>
                    </div>
                )}
                <h3 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2 text-green-700">
                    {t.take_leave.infor_take_leave}
                </h3>
                <Form layout="vertical" className="w-full" onFinish={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-4 gap-4">
                        <FormDateRangePicker
                            control={control}
                            name="range_date"
                            label="Khoảng thời gian"
                            required
                            allowClear
                            format="DD/MM/YYYY"
                            className="col-span-1"
                        />
                        <FormSelect
                            control={control}
                            name="type"
                            label="Loại nghỉ phép"
                            options={
                                filterDayOffType?.map((item) => ({
                                    value: item.id,
                                    label: `${item.code} - ${getLocalizedName(
                                        item.name_en,
                                        item.name_zh,
                                        item.name_vn,
                                        lang,
                                    )}`,
                                })) ?? []
                            }
                            placeholder="Chọn loại nghỉ phép"
                            loading={isLoadingDayOffType}
                        />

                        <FormSelect
                            control={control}
                            name="subtitute"
                            label="Thay thế"
                            options={[]}
                            placeholder="Chọn một hoặc nhiều vai trò"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <FormSelect
                            control={control}
                            name="hours_A"
                            label="Giờ nghỉ phép A"
                            defaultValue={0}
                            options={hoursOptions}
                            placeholder="Chọn một hoặc nhiều vai trò"
                        />
                        <FormSelect
                            control={control}
                            name="hours_B"
                            label="Giờ nghỉ phép B"
                            defaultValue={0}
                            options={hoursOptions}
                            placeholder="Chọn một hoặc nhiều vai trò"
                        />
                        <FormSelect
                            control={control}
                            name="hours_C"
                            label="Giờ nghỉ phép C"
                            defaultValue={0}
                            options={hoursOptions}
                            placeholder="Chọn một hoặc nhiều vai trò"
                        />
                        <FormSelect
                            control={control}
                            name="hours_D"
                            label="Giờ nghỉ phép D"
                            defaultValue={0}
                            options={hoursOptions}
                            placeholder="Chọn một hoặc nhiều vai trò"
                        />
                    </div>
                    <Form.Item>
                        <div className="flex items-center gap-2 justify-end">
                            <Button
                                htmlType="button"
                                onClick={() => {
                                    close();
                                    reset();
                                }}
                            >
                                {t.take_leave.cancel}
                            </Button>
                            <Button htmlType="submit" type="primary">
                                {t.take_leave.confirm}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default TakeLeaveForm;
