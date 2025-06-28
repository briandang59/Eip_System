'use client';
import { Select, SelectProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import FormField from './FormField';

interface FormSelectProps<T extends FieldValues> extends Omit<SelectProps, 'name'> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    required?: boolean;
}

export default function FormSelect<T extends FieldValues>({
    control,
    name,
    label,
    required,
    ...props
}: FormSelectProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <FormField label={label} error={error} required={required}>
                    <Select
                        {...field}
                        {...props}
                        status={error ? 'error' : ''}
                        className="w-full"
                    />
                </FormField>
            )}
        />
    );
}
