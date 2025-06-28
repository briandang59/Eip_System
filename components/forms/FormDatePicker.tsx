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
}

export default function FormDatePicker<T extends FieldValues>({
    control,
    name,
    label,
    required,
    ...props
}: FormDatePickerProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                <FormField label={label} error={error} required={required}>
                    <DatePicker
                        {...field}
                        {...props}
                        value={value ? dayjs(value) : null}
                        onChange={(date) => onChange(date?.toISOString())}
                        status={error ? 'error' : ''}
                        className="w-full"
                    />
                </FormField>
            )}
        />
    );
}
