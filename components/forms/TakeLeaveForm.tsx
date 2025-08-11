'use client';
import { useEmployees } from '@/apis/useSwr/employees';
import { useRemainHours } from '@/apis/useSwr/remainHours';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Form, Input, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { FormDateRangePicker, FormSelect } from '../formsComponent';
import { useDayOffType } from '@/apis/useSwr/dayoffType';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { generateDayOffRequests } from '@/utils/functions/generateDayOffRequest';
import { toast } from 'sonner';
import { dayOffService } from '@/apis/services/dayOff';
import { TakeLeaveResponseType } from '@/types/response/takeLeave';
import { useDayoff } from '@/apis/useSwr/dayoff';
import { DayoffType } from '@/types/response/dayoff';
import { BVE, LIMIT_HOURS_BV, LIMIT_HOURS_NV, LT_BVE } from '@/utils/constants/vairables';

interface TakeLeaveFormProps {
    card_number?: string;
    isOpen: boolean;
    takeLeaveRecord?: TakeLeaveResponseType;
    close: () => void;
    mutate?: () => void;
    existingDayoffRecords?: TakeLeaveResponseType[];
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

function TakeLeaveForm({
    card_number,
    isOpen,
    close,
    mutate,
    takeLeaveRecord,
}: TakeLeaveFormProps) {
    const { t, lang } = useTranslationCustom();
    const schema: yup.ObjectSchema<FormValueProps> = yup
        .object({
            range_date: yup
                .array()
                .of(yup.string().required())
                .length(2, t.take_leave.required_range_date)
                .required(),
            type: yup.number().required(),
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
            }, 500),
        [],
    );

    const getHoursByCode = (code?: string, takeLeaveRecord?: TakeLeaveResponseType) => {
        const defaultValues = {
            hours_A: 0,
            hours_B: 0,
            hours_C: 0,
            hours_D: 0,
            type: 0,
        };

        if (!code || !takeLeaveRecord) return defaultValues;

        const hours = takeLeaveRecord.hours ?? 0;

        switch (code) {
            case 'A':
                return { ...defaultValues, hours_A: hours };
            case 'B':
                return { ...defaultValues, hours_B: hours };
            case 'C':
                return { ...defaultValues, hours_C: hours };
            case 'D':
            case 'E':
            case 'F':
            case 'G':
            case 'H':
            case 'I':
                return {
                    ...defaultValues,
                    hours_D: hours,
                    type: hours > 0 ? takeLeaveRecord.leave_type.id : undefined,
                };
            default:
                return defaultValues;
        }
    };

    useEffect(() => {
        if (takeLeaveRecord && takeLeaveRecord.leave_type?.code) {
            const formValues = getHoursByCode(takeLeaveRecord.leave_type.code, takeLeaveRecord);
            reset({
                ...formValues,
                range_date: [takeLeaveRecord.start, takeLeaveRecord.end],
            });
        } else {
            reset({
                hours_A: 0,
                hours_B: 0,
                hours_C: 0,
                hours_D: 0,
                type: 0,
            });
        }
    }, [takeLeaveRecord, reset]);
    const hours_D_watch = useWatch({ control, name: 'hours_D' });
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

    const hasValidCard = card && card.trim();

    const employeeParams = useMemo(() => {
        return hasValidCard ? { card_number: card.toUpperCase() } : undefined;
    }, [hasValidCard, card]);

    const { employees, isLoading: employeeLoading } = useEmployees(employeeParams);

    const remainHoursParams = useMemo(() => {
        return hasValidCard && employees?.length ? { uuid: employees[0]?.uuid || card } : undefined;
    }, [hasValidCard, employees, card]);

    const {
        remainHours,
        isLoading: remainHourLoading,
        mutate: mutateRemainHours,
    } = useRemainHours(remainHoursParams);

    const dayoffTypeParams = useMemo(() => {
        return hasValidCard && employees?.length
            ? { nation: employees[0]?.nation.name_en }
            : { nation: '' };
    }, [hasValidCard, employees]);

    const { dayoffTypes, isLoading: isLoadingDayOffType } = useDayOffType(dayoffTypeParams);

    const dayoffParams = useMemo(() => {
        if (!hasValidCard || !employees?.length) {
            return undefined;
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const params = {
            uuid: employees[0]?.uuid || '',
            work_place_id: employees[0]?.work_place_id || 0,
            start: startOfMonth.toISOString(),
            end: endOfMonth.toISOString(),
        };

        return params;
    }, [hasValidCard, employees]);

    const { dayoff } = useDayoff(dayoffParams);

    if (!hasValidCard) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">{t.take_leave.title}</h1>
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2 text-green-700">
                        {t.take_leave.info}
                    </h3>
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
                    </div>
                    <p className="text-gray-500">{t.take_leave.please_enter_card_number}</p>
                </div>
            </div>
        );
    }

    const filterDayOffType = dayoffTypes?.filter(
        (item) => item.id !== 1 && item.id !== 2 && item.id !== 3,
    );

    const hoursOptionsNV = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 4,
            label: '4',
        },

        {
            value: 8,
            label: '8',
        },
    ];

    const hoursOptionsBVE = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 5,
            label: '5',
        },
        {
            value: 10,
            label: '10',
        },
    ];

    const hoursOptions =
        employees?.[0]?.unit?.code === LT_BVE || employees?.[0]?.unit?.code === BVE
            ? hoursOptionsBVE
            : hoursOptionsNV;
    const onSubmit = async (data: FormValueProps) => {
        if (data && employees) {
            if (data.hours_B > 0) {
                const remainingHours = remainHours?.this_year.remain.hours ?? 0;
                if (remainingHours <= 0) {
                    toast.error(t.take_leave.err_insufficient_hours);
                    return;
                }
            }

            const records = generateDayOffRequests(data, employees[0].uuid);

            const dateKey = (ts: string) => {
                const date = new Date(ts);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const result = `${year}-${month}-${day}`;
                return result;
            };

            if (data.hours_B > 0) {
                const remainingHours = remainHours?.this_year.remain.hours ?? 0;

                // Check if requested hours exceed remaining hours
                const totalRequestedHours = records.reduce((total, record) => {
                    // Check if this is a type B leave request (type_id: 2)
                    if (record.type_id === 2) {
                        return total + record.hours;
                    }
                    return total;
                }, 0);

                if (totalRequestedHours > remainingHours) {
                    toast.error(t.take_leave.err_exceed_remaining);
                    return;
                }
            }

            const totalHoursByDate: Record<string, number> = {};

            if (dayoff) {
                dayoff.forEach((existingRecord: DayoffType) => {
                    if (takeLeaveRecord?.id && existingRecord.id === takeLeaveRecord.id) {
                        return;
                    }

                    const key = dateKey(existingRecord.start);
                    const existingHours = existingRecord.hours || 0;

                    totalHoursByDate[key] = (totalHoursByDate[key] || 0) + existingHours;
                });
            }

            records.forEach((rec) => {
                const key = dateKey(rec.start);

                totalHoursByDate[key] = (totalHoursByDate[key] || 0) + rec.hours;
            });
            let hoursLimit = 0;
            if (employees?.[0]?.unit?.code === LT_BVE || employees?.[0]?.unit?.code === BVE) {
                hoursLimit = LIMIT_HOURS_BV;
            } else {
                hoursLimit = LIMIT_HOURS_NV;
            }
            const exceededDates = Object.entries(totalHoursByDate).filter(([, hours]) => {
                return hours > hoursLimit;
            });

            if (exceededDates.length) {
                toast.error(t.take_leave.err_2);
                return;
            }

            if (takeLeaveRecord?.id) {
                const modifyData = {
                    ...records[0],
                    id: takeLeaveRecord.id,
                };
                await dayOffService
                    .modify(modifyData)
                    .then((res) => {
                        if (res) {
                            toast.success(t.take_leave.success);
                            reset();
                            close();
                            if (mutate) {
                                mutate();
                                mutateRemainHours();
                            }
                        }
                    })
                    .catch(() => toast.error(t.take_leave.error));
            } else {
                await dayOffService
                    .add(records)
                    .then((res) => {
                        if (res) {
                            toast.success(t.take_leave.success);
                            reset();
                            close();
                            if (mutate) {
                                mutate();
                                mutateRemainHours();
                            }
                        }
                    })
                    .catch(() => toast.error(t.take_leave.error));
            }
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
                                {card && employees?.[0]?.gender
                                    ? t.take_leave.male
                                    : t.take_leave.female}
                            </p>
                        </div>
                        <div className="col-span-1">
                            <h4 className="text-[14px] font-medium">{t.take_leave.nation}</h4>
                            <p className="text-[14px]">
                                {(() => {
                                    if (card && employees?.[0]?.nation) {
                                        return getLocalizedName(
                                            employees[0].nation.name_en,
                                            employees[0].nation.name_zh,
                                            employees[0].nation.name_vn,
                                            lang,
                                        );
                                    }
                                    return '';
                                })()}
                            </p>
                        </div>
                        <div className="col-span-1">
                            <h4 className="text-[14px] font-medium">{t.take_leave.unit}</h4>
                            <p className="text-[14px]">
                                {(() => {
                                    if (
                                        card &&
                                        employees &&
                                        employees.length > 0 &&
                                        employees[0].unit
                                    ) {
                                        return getLocalizedName(
                                            employees[0].unit.name_en,
                                            employees[0].unit.name_zh,
                                            employees[0].unit.name_vn,
                                            lang,
                                        );
                                    }
                                    return '';
                                })()}
                            </p>
                        </div>
                        <div className="col-span-1">
                            <h4 className="text-[14px] font-medium">{t.take_leave.job_title}</h4>
                            <p className="text-[14px]">
                                {(() => {
                                    if (card && employees?.[0]?.job_title) {
                                        return getLocalizedName(
                                            employees[0].job_title.name_en,
                                            employees[0].job_title.name_zh,
                                            employees[0].job_title.name_vn,
                                            lang,
                                        );
                                    }
                                    return '';
                                })()}
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
                {(remainHours?.this_year.remain.hours ?? 0) <= 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-yellow-800 text-sm">
                            {t.take_leave.err_insufficient_hours}
                        </p>
                    </div>
                )}

                <Form layout="vertical" className="w-full" onFinish={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-4 gap-4">
                        <FormDateRangePicker
                            control={control}
                            name="range_date"
                            label={t.take_leave.range_date}
                            required
                            allowClear
                            format="DD/MM/YYYY"
                            className="col-span-1"
                        />
                        {hours_D_watch > 0 ? (
                            <FormSelect
                                control={control}
                                name="type"
                                label={t.take_leave.type}
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
                                placeholder={t.take_leave.type}
                                loading={isLoadingDayOffType}
                            />
                        ) : null}
                        <FormSelect
                            control={control}
                            name="subtitute"
                            label={t.take_leave.subtitute}
                            options={[]}
                            placeholder={t.take_leave.subtitute}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <FormSelect
                            control={control}
                            name="hours_A"
                            label={t.take_leave.hours_A}
                            defaultValue={0}
                            options={hoursOptions}
                            placeholder={t.take_leave.hours_A}
                        />
                        <FormSelect
                            control={control}
                            name="hours_B"
                            label={`${t.take_leave.hours_B} (Còn lại: ${remainHours?.this_year.remain.hours ?? 0}h)`}
                            defaultValue={0}
                            options={hoursOptions}
                            placeholder={t.take_leave.hours_B}
                            disabled={(remainHours?.this_year.remain.hours ?? 0) <= 0}
                        />
                        <FormSelect
                            control={control}
                            name="hours_C"
                            label={t.take_leave.hours_C}
                            defaultValue={0}
                            options={hoursOptions}
                            placeholder={t.take_leave.hours_C}
                        />
                        <FormSelect
                            control={control}
                            name="hours_D"
                            label={t.take_leave.hours_D}
                            defaultValue={0}
                            options={hoursOptions}
                            placeholder={t.take_leave.hours_D}
                        />
                    </div>
                    <Form.Item>
                        <div className="flex items-center gap-2 justify-end mt-4">
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
