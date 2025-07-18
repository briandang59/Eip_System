import { Button, Form } from 'antd';
import { FormDatePicker, FormSelect, FormTextArea } from '../formsComponent';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { useUnits } from '@/apis/useSwr/units';
import { useJobTitle } from '@/apis/useSwr/jobTitle';
import { useEmployeeClass } from '@/apis/useSwr/employeeClass';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { toast } from 'sonner';
import { PromoteRequestType } from '@/types/requests/promote';
import { promoteService } from '@/apis/services/promote';
import dayjs from 'dayjs';

interface ProfileFormProps {
    card_number: string;
    uuid: string;
    close: () => void;
    mutate: () => void;
}
function PromoteForm({ card_number, uuid, close, mutate }: ProfileFormProps) {
    const { t, lang } = useTranslationCustom();
    const { workPlaces, isLoading: isLoadingWorkplaces } = useWorkPlaces();
    const { units, isLoading: isLoadingUnits } = useUnits();
    const { jobTitles, isLoading: isLoadingJobTitles } = useJobTitle();
    const { employeeClasses, isLoading: isLoadingEmployeeClasses } = useEmployeeClass();
    const schema = yup
        .object({
            class_id: yup.number().required(),
            work_place_id: yup.number().required(),
            unit_id: yup.number().required(),
            jobtitle_id: yup.number().required(),
            effect_date: yup.string().required(),
            memo: yup.string().default(''),
        })
        .required();
    type FormData = yup.InferType<typeof schema>;
    const { control, handleSubmit } = useForm<FormData>({
        resolver: yupResolver(schema),
    });
    const onSubmit = async (data: FormData) => {
        try {
            const newData: PromoteRequestType = {
                card_number: card_number,
                class_id: data.class_id,
                effect_date: dayjs(data.effect_date).format('YYYY-MM-DD'),
                job_title_id: data.jobtitle_id,
                unit_id: data.unit_id,
                uuid: uuid,
                work_place_id: data.work_place_id,
                memo: data.memo,
            };
            await promoteService.add(newData);
            toast.success(t.resign_form.success);
            mutate();
            close();
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    return (
        <Form
            layout="vertical"
            className="w-full grid grid-cols-2 gap-2"
            onFinish={handleSubmit(onSubmit)}
        >
            <FormSelect
                control={control}
                name="class_id"
                label={t.promote_form.position}
                required
                options={
                    employeeClasses?.map((item) => ({
                        label: `${getLocalizedName(item?.name_en, item?.name_zh, item?.name_vn, lang)}`,
                        value: item.id,
                    })) || []
                }
                loading={isLoadingEmployeeClasses}
                placeholder="Please select"
                size="large"
            />
            <FormSelect
                control={control}
                name="work_place_id"
                label={t.promote_form.work_place}
                required
                options={
                    workPlaces?.map((item) => ({
                        label: `${getLocalizedName(item?.name_en, item?.name_zh, item?.name_vn, lang)}`,
                        value: item.id,
                    })) || []
                }
                loading={isLoadingWorkplaces}
                placeholder="Please select"
                size="large"
            />

            <FormSelect
                control={control}
                name="unit_id"
                label={t.promote_form.unit}
                required
                options={
                    units?.map((item) => ({
                        label: `${getLocalizedName(item?.name_en, item?.name_zh, item?.name_vn, lang)}`,
                        value: item.id,
                    })) || []
                }
                loading={isLoadingUnits}
                placeholder="Please select"
                size="large"
            />

            <FormSelect
                control={control}
                name="jobtitle_id"
                label={t.promote_form.promotion_title}
                required
                options={
                    jobTitles?.map((item) => ({
                        label: `${getLocalizedName(item?.name_en, item?.name_zh, item?.name_vn, lang)}`,
                        value: item.id,
                    })) || []
                }
                loading={isLoadingJobTitles}
                placeholder="Please select"
                size="large"
            />

            <FormDatePicker
                control={control}
                name="effect_date"
                label={t.promote_form.effect_date}
                required
                size="large"
            />

            <div className="col-span-2">
                <FormTextArea
                    control={control}
                    name="memo"
                    label={t.promote_form.memo}
                    placeholder="Enter memo"
                    size="large"
                />
            </div>
            <div className="col-span-2 flex items-center justify-end">
                <Form.Item>
                    <div className="flex items-center gap-2">
                        <Button htmlType="button" onClick={close}>
                            {t.resign_form.cancel}
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {t.resign_form.submit}
                        </Button>
                    </div>
                </Form.Item>
            </div>
        </Form>
    );
}

export default PromoteForm;
