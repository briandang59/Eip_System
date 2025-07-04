import { Button, Form } from 'antd';
import { FormInput } from '../formsComponent';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import * as yup from 'yup';
import { toast } from 'sonner';
import { roleService } from '@/apis/services/role';
import { RoleITResponseType } from '@/types/response/roleIT';
import { useEffect } from 'react';

interface params {
    mutate: () => void;
    role?: RoleITResponseType | null;
    toggleModal: (key: string) => void;
}
function RoleForm({ mutate, role, toggleModal }: params) {
    const { t } = useTranslationCustom();

    const schema = yup
        .object({
            tag: yup.string().required('Tag is required'),
            description: yup.string().nullable().default(''),
        })
        .required();

    type FormData = yup.InferType<typeof schema>;
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            tag: '',
            description: '',
        },
    });
    useEffect(() => {
        if (role) {
            setValue('tag', role.tag);
            setValue('description', role.description);
        }
    }, [role, setValue]);
    const onSubmit = async (data: FormData) => {
        try {
            if (role) {
                const updateData = {
                    ...data,
                    id: role.id,
                };
                await roleService.update(updateData).then((res) => {
                    if (res) {
                        toast.success(t.role_and_permission.success);
                        reset();
                        mutate();
                        toggleModal('edit_role');
                    }
                });
            } else {
                const newData = {
                    ...data,
                };
                await roleService.add(newData).then((res) => {
                    if (res) {
                        toast.success(t.role_and_permission.success);
                        reset();
                        mutate();
                        toggleModal('add_role');
                    }
                });
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    return (
        <Form layout="vertical" className="w-full" onFinish={handleSubmit(onSubmit)}>
            <FormInput
                control={control}
                name="tag"
                label={t.role_and_permission.tag}
                placeholder="Enter your tag"
                size="large"
                required
                error={errors.tag?.message}
            />
            <FormInput
                control={control}
                name="description"
                label={t.role_and_permission.description}
                placeholder="Enter your description"
                size="large"
                error={errors.description?.message}
            />
            <Form.Item>
                <Button type="primary" className="w-full" htmlType="submit">
                    {t.common.forms.submit}
                </Button>
            </Form.Item>
        </Form>
    );
}

export default RoleForm;
