import { FactoryInspectionAttendance } from '@/types/response/factoryInspectionAttendance';
import { useTranslationCustom } from '@/utils/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';
import { FormInput, FormSelect } from '../formsComponent';
import { useEffect } from 'react';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useFactoryInspectionShift } from '@/apis/useSwr/shiftFactoryInspectionList';
import dayjs from 'dayjs';
import { factoryInspectionWorkdayService } from '@/apis/services/factoryInspectionWorkday';
import { FactoryInspectionWorkdayEditRequest } from '@/types/requests/factoryInspectionWorkday';
interface EditAttendanceFormProps {
    record: FactoryInspectionAttendance;
    close: () => void;
}
function EditAttendanceForm({ record, close }: EditAttendanceFormProps) {
    const { t, lang } = useTranslationCustom();
    const { workPlaces, isLoading: isLoadingWorkplace } = useWorkPlaces();
    const { factoryInspectionShifts, isLoading: isLoadingFactoryInspectionShifts } =
        useFactoryInspectionShift();
    const schema = yup
        .object({
            card_number: yup.string().required(),
            full_name: yup.string().nullable().default(''),
            work_place_id: yup.number().required(),
            date: yup.string().required(),
            shift: yup.string().required(),
            DT: yup.number().nullable().default(0),
            VS: yup.number().nullable().default(0),
            G200: yup.number().nullable().default(0),
            G210: yup.number().nullable().default(0),
            GC: yup.number().nullable().default(0),
            Gdem: yup.number().nullable().default(0),
            KP: yup.number().nullable().default(0),
            T1: yup.string().nullable().default(''),
            T2: yup.string().nullable().default(''),
            Tcom: yup.number().nullable().default(0),
            A: yup.number().nullable().default(0),
            B: yup.number().nullable().default(0),
            C: yup.number().nullable().default(0),
            DB: yup.number().nullable().default(0),
            CV: yup.number().nullable().default(0),
            NLE: yup.number().nullable().default(0),
            C150: yup.number().nullable().default(0),
            C200: yup.number().nullable().default(0),
            C300: yup.number().nullable().default(0),
            C390: yup.number().nullable().default(0),
        })
        .required();
    type FormData = yup.InferType<typeof schema>;
    const { control, handleSubmit, reset } = useForm<FormData>({
        resolver: yupResolver(schema),
    });
    useEffect(() => {
        if (record) {
            const detail = record?.details[0];
            reset({
                card_number: record?.card_number,
                full_name: record?.fullname,
                work_place_id: detail?.work_place_id,
                date: detail?.date,
                shift: detail.shift.tag,
                T1: dayjs(detail.workday.T1.time).format('HH:mm') ?? '',
                T2: dayjs(detail.workday.T2.time).format('HH:mm') ?? '',
                GC: detail.workday.GC ?? 0,
                NLE: detail.workday.nle ?? 0,
                C150: detail.workday.overtime.c150 ?? 0,
                C200: detail.workday.overtime.c200 ?? 0,
                C300: detail.workday.overtime.c300 ?? 0,
                A: detail.workday.leave_hours.A ?? 0,
                B: detail.workday.leave_hours.B ?? 0,
                C: detail.workday.leave_hours.C ?? 0,
                DB: detail.workday.leave_hours.DB ?? 0,
                CV: detail.workday.leave_hours.CV ?? 0,
                KP: detail.workday.KP ?? 0,
                DT: detail.workday.DT ?? 0,
                VS: detail.workday.VS ?? 0,
                Gdem: detail.workday.GDem ?? 0,
                G200: detail.workday.G200 ?? 0,
                G210: detail.workday.G210 ?? 0,
                Tcom: detail.workday.Tcom ?? 0,
            });
        }
    }, [record]);
    const onSubmit = async (data: FormData) => {
        try {
            console.log('data', data);
            const payload: FactoryInspectionWorkdayEditRequest = {
                ...data,
                DT: data.DT ?? undefined,
                VS: data.VS ?? undefined,
                G200: data.G200 ?? undefined,
                G210: data.G210 ?? undefined,
                GC: data.GC ?? undefined,
                Gdem: data.Gdem ?? undefined,
                KP: data.KP ?? undefined,
                Tcom: data.Tcom ?? undefined,
                A: data.A ?? undefined,
                B: data.B ?? undefined,
                C: data.C ?? undefined,
                DB: data.DB ?? undefined,
                CV: data.CV ?? undefined,
                NLE: data.NLE ?? undefined,
                C150: data.C150 ?? undefined,
                C200: data.C200 ?? undefined,
                C300: data.C300 ?? undefined,
                C390: data.C390 ?? undefined,
            };
            await factoryInspectionWorkdayService.modify(payload).then(() => {
                close();
                toast.success(t.common.forms.successed);
            });
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    return (
        <Form layout="vertical" className="flex flex-col gap-4" onFinish={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-4 gap-4">
                <FormInput
                    control={control}
                    name="card_number"
                    label={t.edit_attendance_factory_inspection.card_number}
                    size="large"
                    required
                    disabled
                />
                <FormInput
                    control={control}
                    name="full_name"
                    label={t.edit_attendance_factory_inspection.fullname}
                    size="large"
                    required
                    disabled
                />
                <FormSelect
                    control={control}
                    name="work_place_id"
                    label={t.edit_attendance_factory_inspection.workplace}
                    options={workPlaces.map((item) => ({
                        label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                        value: item.id,
                    }))}
                    loading={isLoadingWorkplace}
                    size="large"
                    required
                    disabled
                />
            </div>
            <p className="text-[18px] font-bold text-green-700">
                {t.edit_attendance_factory_inspection.shift_and_time}
            </p>

            <div className="grid grid-cols-4 gap-4">
                <FormSelect
                    control={control}
                    name="shift"
                    label={t.edit_attendance_factory_inspection.shift}
                    options={factoryInspectionShifts?.map((item) => ({
                        label: `${item.tag} (${item.start_time} - ${item.end_time})`,
                        value: item.tag,
                    }))}
                    loading={isLoadingFactoryInspectionShifts}
                    size="large"
                />
                <FormInput
                    control={control}
                    name="date"
                    label={t.edit_attendance_factory_inspection.date}
                    size="large"
                    required
                    disabled
                />
                <FormInput control={control} name="T1" label={'T1 (HH:mm)'} size="large" />
                <FormInput control={control} name="T2" label={'T2 (HH:mm)'} size="large" />
            </div>
            <p className="text-[18px] font-bold text-green-700">
                {t.edit_attendance_factory_inspection.attendance_hours}
            </p>

            <div className="mt-4 grid grid-cols-6 gap-4">
                <FormInput control={control} name="GC" label={'GC'} size="large" type="number" />
                <FormInput control={control} name="NLE" label={'NLE'} size="large" type="number" />
                <FormInput control={control} name="DT" label={'DT'} size="large" type="number" />
                <FormInput control={control} name="VS" label={'VS'} size="large" type="number" />
                <FormInput
                    control={control}
                    name="Tcom"
                    label={'Tcom'}
                    size="large"
                    type="number"
                />
            </div>
            <p className="text-[18px] font-bold text-green-700">
                {t.edit_attendance_factory_inspection.overtime_hours}
            </p>
            <div className="grid grid-cols-6 gap-4">
                <FormInput control={control} name="C150" label={'150'} size="large" type="number" />
                <FormInput control={control} name="C200" label={'200'} size="large" type="number" />
                <FormInput control={control} name="C300" label={'300'} size="large" type="number" />
                <FormInput
                    control={control}
                    name="Gdem"
                    label={'Gdem'}
                    size="large"
                    type="number"
                />
                <FormInput
                    control={control}
                    name="G200"
                    label={'G200'}
                    size="large"
                    type="number"
                />
                <FormInput
                    control={control}
                    name="G210"
                    label={'G210'}
                    size="large"
                    type="number"
                />
            </div>
            <p className="text-[18px] font-bold text-green-700">
                {t.edit_attendance_factory_inspection.leave_hours}
            </p>
            <div className="grid grid-cols-6 gap-4">
                <FormInput control={control} name="A" label={'A'} size="large" type="number" />
                <FormInput control={control} name="KP" label={'KP'} size="large" type="number" />
                <FormInput control={control} name="B" label={'B'} size="large" type="number" />
                <FormInput control={control} name="C" label={'C'} size="large" type="number" />
                <FormInput control={control} name="DB" label={'DB'} size="large" type="number" />
                <FormInput control={control} name="CV" label={'CV'} size="large" type="number" />
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

export default EditAttendanceForm;
