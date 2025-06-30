'use client';
import { Form } from 'antd';
import { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldProps {
    label?: string;
    error?: FieldError;
    required?: boolean;
    children: ReactNode;
}

export default function FormField({ label, error, required, children }: FormFieldProps) {
    const requiredLabel = required ? (
        <span className="flex items-center gap-1">
            <span className="text-red-500">*</span>
            {label}
        </span>
    ) : (
        label
    );

    return (
        <Form.Item
            label={requiredLabel}
            validateStatus={error ? 'error' : ''}
            help={error?.message}
            className="mb-4"
            colon={false}
        >
            {children}
        </Form.Item>
    );
}
