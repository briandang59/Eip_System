import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';
import { FormInput, FormSelect, FormTextArea } from '../formsComponent';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { dormitoryService } from '@/apis/services/dormitory';
import { DormitoriesResponseType } from '@/types/response/dormitories';
import { useEffect } from 'react';
const schema = yup
    .object({
        name_en: yup.string().required(),
        name_zh: yup.string().required(),
        name_vn: yup.string().required(),
        code: yup.string().required(),
        work_place_id: yup.number().required(),
        capacity: yup.number().required(),
        note: yup.string().required(),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

interface DormitoriesFormProps {
    close: () => void;
    mutate: () => void;
    record?: DormitoriesResponseType;
}
function DormitoriesForm({ close, mutate, record }: DormitoriesFormProps) {
    const { t } = useTranslationCustom();
    const { workPlaces, isLoading: isLoadingWorkplace } = useWorkPlaces();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name_en: '',
            name_zh: '',
            name_vn: '',
            code: '',
        },
    });
    useEffect(() => {
        if (record) {
            reset({
                name_en: record.name_en,
                name_vn: record.name_vn,
                name_zh: record.name_zh,
                code: record.code,
                capacity: record.capacity,
                note: record.note,
                work_place_id: record.work_place_id,
            });
        }
    }, [reset, record]);

    const onSubmit = async (data: FormData) => {
        try {
            if (record?.id) {
                const modifyData = {
                    ...data,
                    id: record?.id,
                };
                await dormitoryService.modify(modifyData);
                toast.success('successed');
            } else {
                await dormitoryService.add(data);
                toast.success('successed');
            }

            mutate();
            close();
            reset();
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
            <FormSelect
                control={control}
                name="work_place_id"
                label={t.department_form.belonging_to}
                size="large"
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
            <FormInput
                control={control}
                name="capacity"
                label={t.dormitory_form.capacity}
                size="large"
                error={errors.code?.message}
                required
                type="number"
            />
            <FormInput
                control={control}
                name="code"
                label={t.department_form.code}
                size="large"
                error={errors.code?.message}
                required
            />
            <FormTextArea
                control={control}
                name="note"
                label={t.dormitory_form.note}
                size="large"
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

export default DormitoriesForm;
