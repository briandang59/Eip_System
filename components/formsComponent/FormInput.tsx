'use client';
import { Form, Input, InputProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

export interface FormInputProps<T extends FieldValues> extends Omit<InputProps, 'name'> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    required?: boolean;
    error?: string;
}

export function FormInput<T extends FieldValues>({
    control,
    name,
    label,
    required,
    error,
    ...rest
}: FormInputProps<T>) {
    return (
        <Form.Item
            label={label}
            required={required}
            validateStatus={error ? 'error' : undefined}
            help={error}
        >
            <Controller
                control={control}
                name={name}
                render={({ field, fieldState }) => (
                    <Input {...field} {...rest} status={fieldState.error ? 'error' : undefined} />
                )}
            />
        </Form.Item>
    );
}

export default FormInput;
