'use client';
import { Button, Form, message } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormInput } from '@/components/formsComponent';
import { Lock, User } from 'lucide-react';
import { routes } from '@/utils/constants/common/routes';
import { useRouter } from 'next/navigation';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { authService } from '@/apis/services/authService';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { AuthSignInRequest } from '@/types/response/auth';
import { AUTH_COOKIE } from '@/apis/fetcher';

const schema = yup
    .object({
        account: yup.string().required('Account is required'),
        password: yup.string().required('Password is required'),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

function LoginForm() {
    const router = useRouter();
    const { t } = useTranslationCustom();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            account: '',
            password: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        // try {
        //     setIsLoading(true);
        //     const response = await authService.signin(data as AuthSignInRequest);
        //     if (response.token) {
        //         Cookies.set(AUTH_COOKIE, response.token);
        //         localStorage.setItem('user_info', JSON.stringify(response.user_info));
        //         localStorage.setItem('roles', JSON.stringify(response.roles));
        //         localStorage.setItem('permission_map', JSON.stringify(response.permission_map));
        //         message.success(t.form.login_success);
        //         router.push(routes.home);
        //     } else {
        //         message.error(t.form.login_failed);
        //     }
        // } catch (error: any) {
        //     console.error('Login error:', error);
        //     if (error.status === 401) {
        //         message.error(t.form.login_failed_message);
        //         setError('account', { message: t.form.login_failed_message });
        //         setError('password', { message: t.form.login_failed_message });
        //     } else if (error.message) {
        //         message.error(error.message);
        //     } else {
        //         message.error(t.form.login_failed);
        //     }
        // } finally {
        //     setIsLoading(false);
        // }
        message.success(t.form.login_success);
    };

    return (
        <Form layout="vertical" className="w-full" onFinish={handleSubmit(onSubmit)}>
            <FormInput
                control={control}
                name="account"
                label={t.form.login.account}
                required
                placeholder="Enter your username"
                prefix={<User className="w-4 h-4" />}
                size="large"
                error={errors.account?.message}
            />
            <FormInput
                control={control}
                name="password"
                label={t.form.login.password}
                required
                type="password"
                placeholder="Enter your password"
                prefix={<Lock className="w-4 h-4" />}
                size="large"
                error={errors.password?.message}
            />

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    size="large"
                    loading={isLoading}
                >
                    {t.form.login.login}
                </Button>
            </Form.Item>
        </Form>
    );
}

export default LoginForm;
