'use client';
import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormInput } from '@/components/forms';
import { Lock, User } from 'lucide-react';

const schema = yup
    .object({
        username: yup.string().required('Username is required'),
        password: yup.string().required('Password is required'),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

function LoginPage() {
    const { control, handleSubmit } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
    };

    return (
        <Form layout="vertical" className="w-full" onFinish={handleSubmit(onSubmit)}>
            <FormInput
                control={control}
                name="username"
                label="Username"
                required
                placeholder="Enter your username"
                prefix={<User className="w-4 h-4" />}
                size="large"
            />
            <FormInput
                control={control}
                name="password"
                label="Password"
                required
                type="password"
                placeholder="Enter your password"
                prefix={<Lock className="w-4 h-4" />}
                size="large"
            />

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    size="large"
                >
                    Sign in
                </Button>
            </Form.Item>
        </Form>
    );
}

export default LoginPage;
