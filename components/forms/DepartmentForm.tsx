'use client';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormInput, FormSelect } from '../formsComponent';
import { toast } from 'sonner';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { useEmployeeClass } from '@/apis/useSwr/employeeClass';
import { CategoryResponseType } from '@/types/response/category';

const schema = yup
    .object({
        name_en: yup.string().required(),
        name_zh: yup.string().required(),
        name_vn: yup.string().required(),
        code: yup.string().required(),
        belong_to_workplace: yup.array(yup.number()).required(),
        class_id: yup.number().required(),
        category_id: yup.number().required(),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

interface DepartmentFormProps {
    close: () => void;
    categories: CategoryResponseType[];
}
function DepartmentForm({ close, categories }: DepartmentFormProps) {
    const { t } = useTranslationCustom();
    const { workPlaces, isLoading: isLoadingWorkplace } = useWorkPlaces();
    const { employeeClasses, isLoading: isLoadingEmployeeClass } = useEmployeeClass();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name_en: '',
            name_zh: '',
            name_vn: '',
            code: '',
            belong_to_workplace: [],
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            console.log(data);
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    return (
        <Form
            className="grid grid-cols-2 gap-2 space-y-2"
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
        >
            <FormInput
                control={control}
                name="name_en"
                label={t.department_form.name_en}
                size="large"
                error={errors.name_en?.message}
                required
            />
            <FormInput
                control={control}
                name="name_zh"
                label={t.department_form.name_zh}
                size="large"
                error={errors.name_zh?.message}
                required
            />
            <FormInput
                control={control}
                name="name_vn"
                label={t.department_form.name_vn}
                size="large"
                error={errors.name_vn?.message}
                required
            />
            <FormInput
                control={control}
                name="code"
                label={t.department_form.code}
                size="large"
                error={errors.code?.message}
                required
            />
            <FormSelect
                control={control}
                name="belong_to_workplace"
                label={t.department_form.belonging_to}
                size="large"
                mode="multiple"
                options={
                    (workPlaces &&
                        workPlaces.map((item) => ({
                            label: item.name_en || item.name_vn || item.name_zh,
                            value: item.id,
                        }))) ||
                    []
                }
                loading={isLoadingWorkplace}
                required
            />
            <FormSelect
                control={control}
                name="class_id"
                label={t.department_form.class_name}
                size="large"
                options={
                    (employeeClasses &&
                        employeeClasses.map((item) => ({
                            label: item.name_en || item.name_vn || item.name_zh,
                            value: item.id,
                        }))) ||
                    []
                }
                required
                loading={isLoadingEmployeeClass}
            />
            <FormSelect
                control={control}
                name="category_id"
                label={t.department_form.category}
                size="large"
                options={
                    categories.map((item) => ({
                        label: item.name_en || item.name_vn || item.name_zh,
                        value: item.id,
                    })) || []
                }
                required
            />
            <div className="col-span-2">
                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={close} htmlType="button">
                            {t.department_form.cancel}
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {t.department_form.submit}
                        </Button>
                    </div>
                </Form.Item>
            </div>
        </Form>
    );
}

export default DepartmentForm;
