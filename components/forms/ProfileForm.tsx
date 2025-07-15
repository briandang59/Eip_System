import { Button, Collapse, CollapseProps, Form } from 'antd';
import {
    FormDatePicker,
    FormDateRangePicker,
    FormInput,
    FormSelect,
    FormTextArea,
} from '../formsComponent';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UploadCloud } from 'lucide-react';
import { useNations } from '@/apis/useSwr/nation';
import { useEducations } from '@/apis/useSwr/educations';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { useUnits } from '@/apis/useSwr/units';
import { useLanguages } from '@/apis/useSwr/languages';
import { useShifts } from '@/apis/useSwr/shift';
import { useUnitType } from '@/apis/useSwr/unitType';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useJobTitle } from '@/apis/useSwr/jobTitle';
import { useVisaType } from '@/apis/useSwr/visaType';
import { useCheckCardNumber } from '@/apis/useSwr/checkCardNumber';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { toast } from 'sonner';

function ProfileForm() {
    const { nations, isLoading: isLoadingNations } = useNations();
    const { educations, isLoading: isLoadingEducations } = useEducations();
    const { workPlaces, isLoading: isLoadingWorkplace } = useWorkPlaces();
    const { units, isLoading: isLoadingUnit } = useUnits();
    const { languages, isLoading: isLoadingLanguage } = useLanguages();
    const { shifts, isLoading: isLoadingShifts } = useShifts();
    const { unitTypes, isLoading: isLoadingUnitType } = useUnitType();
    const { jobTitles, isLoading: isLoadingJobtitle } = useJobTitle();
    const { visaTypes, isLoading: isLoadingVisaType } = useVisaType();

    const { t } = useTranslationCustom();
    const schema = yup
        .object({
            card_number: yup.string().required(),
            fullname: yup.string().required(),
            fullname_other: yup.string().default(''),
            nation: yup.number().required(),
            education: yup.number().required(),
            gender: yup.string().required(),
            phone_vn: yup.string().default(''),
            phone_tw: yup.string().default(''),
            address: yup.string().default(''),
            cccd: yup.string().required(),
            place_of_birth: yup.string().default(''),
            place_of_issue: yup.string().default(''),
            date_of_issue: yup.string().default(''),
            date_of_birth: yup.string().default(''),
            marriage: yup.string().required(),
            number_of_children: yup.number().default(0),
            type_of_work: yup.number().required(),
            language: yup.number().required(),
            work_place: yup.number().required(),
            unit: yup.number().required(),
            job_title: yup.number().required(),
            description: yup.string().default(''),
            shift: yup.string().default(''),
            start_date_shift: yup.string().default(''),
            end_date_shift: yup.string().default(''),
            active_contract_date: yup.string().default(''),
            expired_contract_date: yup.string().default(''),
            join_company_date1: yup.string().required(),
            join_company_date2: yup.string().default(''),
            type_contract: yup.number().required(),
            passport_number: yup.string().default(''),
            date_of_passport: yup.string().default(''),
            date_of_passport_expired: yup.string().default(''),
            visa_number: yup.string().default(''),
            date_created_visa: yup.string().default(''),
            date_expired_visa: yup.string().default(''),
            work_permit_number: yup.string().default(''),
            work_permit_number_expired: yup.string().default(''),
            residence_time: yup.number().default(0),
            type_visa: yup.number().default(0),
            memo_visa: yup.string().default(''),
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
            card_number: '',
            fullname: '',
            fullname_other: '',
            nation: 1,
            education: 1,
            gender: 'male',
            phone_vn: '',
            phone_tw: '',
            address: '',
            cccd: '',
            place_of_birth: '',
            place_of_issue: '',
            date_of_issue: '',
            date_of_birth: '',
            marriage: '',
            number_of_children: 1,
            type_of_work: 1,
            language: 1,
            work_place: 1,
            unit: 1,
            job_title: 1,
            description: '',
            shift: '',
            start_date_shift: '',
            end_date_shift: '',
            active_contract_date: '',
            expired_contract_date: '',
            join_company_date1: '',
            join_company_date2: '',
            type_contract: 1,
            passport_number: '',
            date_of_passport: '',
            date_of_passport_expired: '',
            visa_number: '',
            date_created_visa: '',
            date_expired_visa: '',
            work_permit_number: '',
            work_permit_number_expired: '',
            residence_time: 1,
            type_visa: 1,
            memo_visa: '',
        },
    });
    const cardNumber = useWatch({ control, name: 'card_number' });

    const { checkCardNumber } = useCheckCardNumber({ card: cardNumber });

    useEffect(() => {
        if (checkCardNumber?.data) {
            toast.error(checkCardNumber.message);
        }
    }, [checkCardNumber]);
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: t.profile_form.general_information,
            children: (
                <div className="flex items-center gap-4">
                    <div className="grid grid-cols-2 gap-2 w-[60%]">
                        <FormInput
                            control={control}
                            name="card_number"
                            label={t.profile_form.card_number}
                            placeholder="Enter your card number"
                            size="large"
                            type="text"
                            required
                            error={errors.card_number?.message}
                        />
                        <FormInput
                            control={control}
                            name="fullname"
                            label={t.profile_form.fullname}
                            placeholder="Enter your full name"
                            size="large"
                            type="text"
                            required
                            error={errors.fullname?.message}
                        />
                        <FormInput
                            control={control}
                            name="fullname_other"
                            label={t.profile_form.fullname_other}
                            placeholder="Enter your full name orther"
                            size="large"
                            type="text"
                            error={errors.fullname_other?.message}
                        />
                        <FormSelect
                            control={control}
                            name="nation"
                            label={t.profile_form.nation}
                            size="large"
                            required
                            placeholder="Select a nation"
                            options={
                                nations?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en,
                                })) || []
                            }
                            loading={isLoadingNations}
                        />

                        <FormSelect
                            control={control}
                            name="education"
                            label={t.profile_form.education}
                            size="large"
                            placeholder="Select a education"
                            options={
                                educations?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en,
                                })) || []
                            }
                            loading={isLoadingEducations}
                        />

                        <FormSelect
                            control={control}
                            name="gender"
                            label={t.profile_form.gender}
                            size="large"
                            required
                            placeholder="Select a role"
                            options={[
                                { value: 'male', label: 'Nam' },
                                { value: 'female', label: 'Nữ' },
                            ]}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center w-[40%] space-y-3">
                        <label
                            htmlFor="imageUpload"
                            className="w-full h-[200px] border border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                        >
                            <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">
                                Click để tải ảnh lên
                            </p>
                            <p className="text-xs text-gray-400">Chỉ chấp nhận PNG, JPG, JPEG</p>
                        </label>

                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            className="!hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                console.log(file);
                            }}
                        />
                    </div>
                </div>
            ),
        },
        {
            key: '2',
            label: t.profile_form.contact_information,
            children: (
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        control={control}
                        name="phone_vn"
                        label={t.profile_form.phone_vn}
                        placeholder="Enter your vietnam phone"
                        size="large"
                        type="text"
                        error={errors.phone_vn?.message}
                    />
                    <FormInput
                        control={control}
                        name="phone_tw"
                        label={t.profile_form.phone_tw}
                        placeholder="Enter your taiwan phone"
                        size="large"
                        type="text"
                        error={errors.phone_tw?.message}
                    />
                    <div className="col-span-2">
                        <FormTextArea
                            control={control}
                            name="address"
                            label={t.profile_form.address}
                            placeholder="Enter your address"
                            size="large"
                        />
                    </div>
                </div>
            ),
        },
        {
            key: '3',
            label: t.profile_form.self_information,
            children: (
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                        <FormInput
                            control={control}
                            name="cccd"
                            label={t.profile_form.cccd_number}
                            placeholder="Enter your cccd"
                            size="large"
                            type="text"
                            required
                            error={errors.cccd?.message}
                        />
                        <FormInput
                            control={control}
                            name="place_of_issue"
                            label={t.profile_form.place_of_issuse}
                            placeholder="Enter your place of issue"
                            size="large"
                            type="text"
                            error={errors.place_of_issue?.message}
                        />
                        <FormInput
                            control={control}
                            name="date_of_issue"
                            label={t.profile_form.date_of_issue}
                            placeholder="Enter your date of issue"
                            size="large"
                            type="text"
                            error={errors.date_of_issue?.message}
                        />
                        <FormInput
                            control={control}
                            name="date_of_birth"
                            label={t.profile_form.birthday}
                            placeholder="Enter your birthday"
                            size="large"
                            type="text"
                            error={errors.date_of_birth?.message}
                        />
                        <FormInput
                            control={control}
                            name="place_of_birth"
                            label={t.profile_form.place_of_birth}
                            placeholder="Enter your place of birthday"
                            size="large"
                            type="text"
                            error={errors.place_of_birth?.message}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <FormSelect
                            control={control}
                            name="marriage"
                            label={t.profile_form.marriage}
                            size="large"
                            placeholder="Select a marriage"
                            options={[
                                { value: '1', label: 'Chưa kết hôn' },
                                { value: '2', label: 'Đã kết hôn' },
                            ]}
                        />
                        <FormInput
                            control={control}
                            name="number_of_children"
                            label={t.profile_form.number_of_children}
                            placeholder="Enter your number of children"
                            size="large"
                            type="text"
                            error={errors.number_of_children?.message}
                        />
                    </div>
                </div>
            ),
        },
        {
            key: '4',
            label: t.profile_form.work_information,
            children: (
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                        <FormSelect
                            control={control}
                            name="type_of_work"
                            label={t.profile_form.work_type}
                            size="large"
                            placeholder="Select a work type"
                            options={
                                unitTypes?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en,
                                })) || []
                            }
                            loading={isLoadingUnitType}
                        />
                        <FormSelect
                            control={control}
                            name="work_place"
                            label={t.profile_form.work_place}
                            size="large"
                            required
                            placeholder="Select a workplace"
                            options={
                                workPlaces?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en,
                                })) || []
                            }
                            loading={isLoadingWorkplace}
                        />
                        <FormSelect
                            control={control}
                            name="unit"
                            label={t.profile_form.unit}
                            size="large"
                            required
                            placeholder="Select a unit"
                            options={
                                units?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en ?? item.name_vn ?? item.name_zh,
                                })) || []
                            }
                            loading={isLoadingUnit}
                        />
                        <FormSelect
                            control={control}
                            name="job_title"
                            label={t.profile_form.job_title}
                            size="large"
                            placeholder="Select a job title"
                            options={
                                jobTitles?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en ?? item.name_vn ?? item.name_zh,
                                })) || []
                            }
                            loading={isLoadingJobtitle}
                        />
                        <FormSelect
                            control={control}
                            name="language"
                            label={t.profile_form.language}
                            size="large"
                            placeholder="Select a langguage"
                            mode="multiple"
                            allowClear
                            options={
                                languages?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en,
                                })) || []
                            }
                            loading={isLoadingLanguage}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <FormSelect
                            control={control}
                            name="shift"
                            label={t.profile_form.shift}
                            size="large"
                            placeholder="Select a shift"
                            options={
                                shifts?.map((item) => ({
                                    value: item.id,
                                    label: item.tag,
                                })) || []
                            }
                            loading={isLoadingShifts}
                        />

                        <div className="grid grid-cols-2 gap-2">
                            <FormDatePicker
                                control={control}
                                name="start_date_shift"
                                label={t.profile_form.from_date}
                                size="large"
                                placeholder="Chọn ngày bắt đầu"
                            />
                            <FormDatePicker
                                control={control}
                                name="end_date_shift"
                                label={t.profile_form.end_date}
                                size="large"
                                placeholder="Chọn ngày bắt đầu"
                            />
                        </div>
                        <FormTextArea
                            control={control}
                            name="description"
                            label={t.profile_form.description}
                            placeholder="Enter your description"
                            size="large"
                        />
                    </div>
                </div>
            ),
        },
        {
            key: '5',
            label: t.profile_form.contract_information,
            children: (
                <div className="grid grid-cols-2 gap-2">
                    <FormDatePicker
                        control={control}
                        name="active_contract_date"
                        label={t.profile_form.active_contract_date}
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="expired_contract_date"
                        label={t.profile_form.expired_contract_date}
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="join_company_date1"
                        label={t.profile_form.join_company_date}
                        required
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="join_company_date2"
                        label={t.profile_form.join_company_date2}
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormSelect
                        control={control}
                        name="type_contract"
                        label={t.profile_form.contract_type}
                        size="large"
                        placeholder="Select a contract type"
                        options={
                            shifts?.map((item) => ({
                                value: item.id,
                                label: item.tag,
                            })) || []
                        }
                        loading={isLoadingShifts}
                    />
                </div>
            ),
        },
        {
            key: '6',
            label: t.profile_form.visa_information,
            children: (
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        control={control}
                        name="passport_number"
                        label={t.profile_form.passport_number}
                        placeholder="Enter your passport number"
                        size="large"
                        type="text"
                        error={errors.passport_number?.message}
                    />
                    <FormInput
                        control={control}
                        name="work_permit_number"
                        label={t.profile_form.work_permit_number}
                        placeholder="Enter your work permit number"
                        size="large"
                        type="text"
                        error={errors.work_permit_number?.message}
                    />
                    <FormDatePicker
                        control={control}
                        name="date_of_passport"
                        label={t.profile_form.date_of_passport}
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="work_permit_number_expired"
                        label={t.profile_form.expired_work_date}
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="date_of_passport_expired"
                        label={t.profile_form.expired_date_passport}
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormInput
                        control={control}
                        name="residence_time"
                        label={t.profile_form.residence_time}
                        placeholder="Enter your residence time"
                        size="large"
                        type="number"
                        error={errors.residence_time?.message}
                    />
                    <FormInput
                        control={control}
                        name="visa_number"
                        label={t.profile_form.visa_number}
                        placeholder="Enter your visa number"
                        size="large"
                        type="text"
                        error={errors.visa_number?.message}
                    />
                    <FormSelect
                        control={control}
                        name="type_visa"
                        label={t.profile_form.visa_type}
                        size="large"
                        placeholder="Select a visa type"
                        options={
                            visaTypes?.map((item) => ({
                                value: item.id,
                                label: item.name,
                            })) || []
                        }
                        loading={isLoadingVisaType}
                    />
                    <FormDatePicker
                        control={control}
                        name="date_created_visa"
                        label={t.profile_form.date_create_visa}
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="date_expired_visa"
                        label={t.profile_form.expired_date_visa}
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormTextArea
                        control={control}
                        name="memo_visa"
                        label={t.profile_form.memo_visa}
                        placeholder="Enter your memo visa"
                        size="large"
                    />
                </div>
            ),
        },
    ];
    const onSubmit = async (data: FormData) => {
        console.log(data);
    };
    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Collapse
                items={items}
                bordered={false}
                defaultActiveKey={['1', '2', '3', '4', '5', '6']}
            />
            <Form.Item>
                <div className="flex items-center gap-2 justify-end">
                    <Button size="large">{t.profile_form.cancel}</Button>
                    <Button size="large" type="primary" htmlType="submit">
                        {t.profile_form.save_info}
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default ProfileForm;
