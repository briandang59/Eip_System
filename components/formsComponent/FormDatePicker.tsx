'use client';

import { DatePicker, DatePickerProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import FormField from './FormField';
import dayjs from 'dayjs';

interface FormDatePickerProps<T extends FieldValues> extends Omit<DatePickerProps, 'name'> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    required?: boolean;
    showTime?: boolean;
}

export default function FormDatePicker<T extends FieldValues>({
    control,
    name,
    label,
    required,
    showTime = false,
    ...props
}: FormDatePickerProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                <FormField label={label} required={required} error={error}>
                    <DatePicker
                        {...field}
                        {...props}
                        value={value ? dayjs(value) : null}
                        onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : '')}
                        showTime={showTime ? { format: 'HH:mm:ss' } : undefined}
                        format={showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
                        status={error ? 'error' : ''}
                        className="w-full"
                    />
                </FormField>
            )}
        />
    );
}
