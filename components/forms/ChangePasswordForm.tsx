'use client';
import { Button, Form } from 'antd';
import { FormInput } from '@/components/formsComponent';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { authService } from '@/apis/services/authService';
import { toast } from 'sonner';

function ChangePasswordForm() {
    const { t } = useTranslationCustom();
    const schema = yup
        .object({
            old_password: yup.string().required('Old password is required'),
            new_password: yup.string().required('New password is required'),
            confirm_password: yup
                .string()
                .required('Confirm password is required')
                .oneOf([yup.ref('new_password')], 'Passwords do not match'),
        })
        .required();

    type FormData = yup.InferType<typeof schema>;
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            old_password: '',
            new_password: '',
            confirm_password: '',
        },
    });
    const onSubmit = async (data: FormData) => {
        const new_data = {
            old_password: data.old_password,
            new_password: data.new_password,
        };
        try {
            const res = await authService.changePassword(new_data);

            if (Number(res.code) === 200) {
                toast.success(t.form.change_password_success);
                reset();
            } else {
                toast.error(t.form.change_password_failed);
            }
        } catch {
            toast.error(t.form.change_password_failed);
        }
    };
    return (
        <div className="flex items-center justify-center mt-10">
            <Form
                layout="vertical"
                className="w-full"
                onFinish={handleSubmit(onSubmit)}
                style={{
                    width: '500px',
                    border: '1px solid #ccc',
                    padding: '20px',
                    borderRadius: '10px',
                }}
            >
                <h2 className="text-[20px] font-bold">{t.settings.change_password.title}</h2>
                <FormInput
                    control={control}
                    name="old_password"
                    label={t.form.old_password}
                    placeholder="Enter your username"
                    size="large"
                    type="password"
                    required
                    error={errors.old_password?.message}
                />
                <FormInput
                    control={control}
                    name="new_password"
                    label={t.form.new_password}
                    type="password"
                    placeholder="Enter your password"
                    size="large"
                    required
                    error={errors.new_password?.message}
                />
                <FormInput
                    control={control}
                    name="confirm_password"
                    label={t.form.confirm_password}
                    type="password"
                    placeholder="Enter your password"
                    size="large"
                    required
                    error={errors.new_password?.message}
                />
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        size="large"
                    >
                        {t.form.save}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ChangePasswordForm;
