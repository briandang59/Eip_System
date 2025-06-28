'use client';
import { Input, InputProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import FormField from './FormField';

interface FormInputProps<T extends FieldValues> extends Omit<InputProps, 'name'> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    required?: boolean;
}

export default function FormInput<T extends FieldValues>({
    control,
    name,
    label,
    required,
    ...props
}: FormInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <FormField label={label} error={error} required={required}>
                    <Input {...field} {...props} status={error ? 'error' : ''} />
                </FormField>
            )}
        />
    );
}
