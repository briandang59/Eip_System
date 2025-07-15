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
import { useProvinces } from '@/apis/useSwr/provinces';
import { useWards } from '@/apis/useSwr/wards';
import { useDistricts } from '@/apis/useSwr/districts';
import { employeeService } from '@/apis/services/employee';
import { useEthnics } from '@/apis/useSwr/ethnic';

function ProfileForm() {
    const { t } = useTranslationCustom();
    const schema = yup
        .object({
            card_number: yup.string().required(),
            fullname: yup.string().required(),
            fullname_other: yup.string().default(''),
            nation: yup.number().required(),
            education: yup.number().default(0),
            gender: yup.string().required(),
            phone_vn: yup.string().default(''),
            phone_tw: yup.string().default(''),
            address: yup.string().default(''),
            provinces_id: yup.string().default(''),
            districts_id: yup.string().default(''),
            wards_id: yup.string().default(''),
            cccd: yup.string().required(),
            place_of_birth: yup.string().default(''),
            place_of_issue: yup.string().default(''),
            date_of_issue: yup.string().default(''),
            date_of_birth: yup.string().default(''),
            ethnics: yup.number().default(0),
            marriage: yup.string().required(),
            number_of_children: yup.number().default(0),
            type_of_work: yup.number().default(0),
            language: yup.array().of(yup.number()).default([]),
            work_place: yup.number().required(),
            unit: yup.number().required(),
            job_title: yup.number().default(0),
            description: yup.string().default(''),
            shift: yup.number().default(0),
            start_date_shift: yup.string().default(''),
            end_date_shift: yup.string().default(''),
            active_contract_date: yup.string().default(''),
            expired_contract_date: yup.string().default(''),
            join_company_date1: yup.string().required(),
            join_company_date2: yup.string().default(''),
            type_contract: yup.number().default(0),
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
            join_insurance_date: yup.string().default(''),
            withholding_date: yup.string().default(''),
            refusal_insurance: yup.string().default(''),
            refusal_reason: yup.string().default(''),
            pregnancy: yup.string().default(''),
            start_date_pregnant: yup.string().default(''),
            end_date_pregnant: yup.string().default(''),
            has_child: yup.string().default(''),
            start_date_take_care_child: yup.string().default(''),
            end_date_take_care_child: yup.string().default(''),
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
    });
    const cardNumber = useWatch({ control, name: 'card_number' });
    const nation = useWatch({ control, name: 'nation' });
    const place_id = useWatch({ control, name: 'work_place' });
    const provinces_id = useWatch({ control, name: 'provinces_id' });
    const district_id = useWatch({ control, name: 'districts_id' });
    const gender_state = useWatch({ control, name: 'gender' });

    const NATION_VN = 3;

    const { checkCardNumber } = useCheckCardNumber({ card: cardNumber });
    const { nations, isLoading: isLoadingNations } = useNations();
    const { educations, isLoading: isLoadingEducations } = useEducations();
    const { workPlaces, isLoading: isLoadingWorkplace } = useWorkPlaces();
    const { units, isLoading: isLoadingUnit } = useUnits({ place_id: place_id });
    const { languages, isLoading: isLoadingLanguage } = useLanguages();
    const { shifts, isLoading: isLoadingShifts } = useShifts();
    const { unitTypes, isLoading: isLoadingUnitType } = useUnitType();
    const { jobTitles, isLoading: isLoadingJobtitle } = useJobTitle();
    const { visaTypes, isLoading: isLoadingVisaType } = useVisaType();
    const { provinces, isLoading: isLoadingProvinces } = useProvinces();
    const { districts, isLoading: isLoadingDistricts } = useDistricts({ province: provinces_id });
    const { wards, isLoading: isLoadingWards } = useWards({ district: district_id });
    const { ethnics, isLoading: isLoadingEthnics } = useEthnics();
    useEffect(() => {
        if (checkCardNumber?.data) {
            toast.error(checkCardNumber.message);
        }
    }, [checkCardNumber]);
    const onSubmit = async (data: FormData) => {
        console.log(data);
        try {
            const newData = {
                fullname: data.fullname,
                work_place_id: data.work_place,
                employee: {
                    card_number: data.card_number,
                    fullname: data.fullname,
                    fullname_other: data.fullname_other,
                    gender: data.gender === 'male' ? true : false,
                    national_id: data.nation,
                    education_id: data.education,
                    phone_vientnam: data.phone_vn,
                    phone_taiwan: data.phone_tw,
                    id_card_number: data.cccd,
                    id_card_issue_by: data.place_of_issue,
                    id_card_issue_date: data.date_of_issue,
                    ethnic_id: data.ethnics,
                    place_of_birth: data.place_of_birth,
                    marriage_status: data.marriage === 'marriged' ? 'on' : null,
                    is_pregnant_woman: false,
                    is_taking_care_children: true,
                    has_children: data.number_of_children,
                    class_id: data.job_title,
                    join_company_date1: data.join_company_date1,
                    join_company_date2: data.join_company_date2,
                    vn_address: {
                        province_id: data.provinces_id,
                        district_id: data.districts_id,
                        ward_id: data.wards_id,
                    },
                    unit_id: data.unit,
                    job_title_id: data.job_title,
                    work_description: data.description,
                    active: true,
                    province: null,
                    birthday: data.date_of_birth,
                },
                languages: (data.language ?? []).filter(
                    (lang): lang is number => typeof lang === 'number',
                ),
                insurance: {
                    join_date: data.join_insurance_date,
                    initial_deduction_date: data.withholding_date,
                    refusal_insurance: data.refusal_insurance === 'yes' ? true : false,
                    refusal_reason: data.refusal_reason,
                },
                contract: {
                    effect_date: data.active_contract_date,
                    expir_date: data.expired_contract_date,
                    type_id: data.type_contract,
                },
                visa: {
                    passport_number: data.passport_number,
                    passport_issue_date: data.date_of_passport,
                    passport_expiration_date: data.date_of_passport_expired,
                    work_permit_number: data.work_permit_number,
                    work_permit_expiration_date: data.work_permit_number_expired,
                    visa_number: data.visa_number,
                    visa_type_id: data.type_visa,
                    visa_expiration_date: data.date_expired_visa,
                    visa_effective_date: data.date_created_visa,
                    visa_duration_stay: data.residence_time,
                    visa_note: data.memo_visa,
                },
                shift: {
                    shift_id: data.shift,
                    start: data.start_date_shift,
                    end: data.end_date_shift,
                },
                has_child: {
                    start_date: null,
                    end_date: null,
                },
                pregnancy: {
                    start_date: null,
                    end_date: null,
                },
            };

            console.log(newData);
            // await employeeService.add(newData).then((res) => {
            //     if (res) {
            //         toast.success('success');
            //     }
            // });
        } catch (error) {
            toast.error(`${error}`);
        }
    };
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
                                { value: 'male', label: t.profile_form.male },
                                { value: 'female', label: t.profile_form.female },
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
                    {nation !== NATION_VN ? (
                        <div className="col-span-2">
                            <FormTextArea
                                control={control}
                                name="address"
                                label={t.profile_form.address}
                                placeholder="Enter your address"
                                size="large"
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 col-span-2 gap-2">
                            <FormSelect
                                control={control}
                                name="provinces_id"
                                label={t.profile_form.provinces}
                                size="large"
                                required
                                placeholder="Select a nation"
                                options={
                                    provinces?.map((item) => ({
                                        value: item.code,
                                        label: item.name,
                                    })) || []
                                }
                                loading={isLoadingProvinces}
                            />
                            <FormSelect
                                control={control}
                                name="districts_id"
                                label={t.profile_form.districts}
                                size="large"
                                required
                                placeholder="Select a nation"
                                options={
                                    districts?.map((item) => ({
                                        value: item.code,
                                        label: item.name,
                                    })) || []
                                }
                                loading={isLoadingDistricts}
                            />
                            <FormSelect
                                control={control}
                                name="wards_id"
                                label={t.profile_form.wards}
                                size="large"
                                required
                                placeholder="Select a nation"
                                options={
                                    wards?.map((item) => ({
                                        value: item.code,
                                        label: item.name,
                                    })) || []
                                }
                                loading={isLoadingWards}
                            />
                        </div>
                    )}
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
                        <FormDatePicker
                            control={control}
                            name="date_of_issue"
                            label={t.profile_form.date_of_issue}
                            placeholder="Enter your date of issue"
                            size="large"
                            type="text"
                        />
                        <FormDatePicker
                            control={control}
                            name="date_of_birth"
                            label={t.profile_form.birthday}
                            placeholder="Enter your birthday"
                            size="large"
                            type="text"
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
                                { value: 'not_marriaged', label: t.profile_form.no },
                                { value: 'marriaged', label: t.profile_form.yes },
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
                        <FormSelect
                            control={control}
                            name="ethnics"
                            label={t.profile_form.ethnics}
                            size="large"
                            placeholder="Select a education"
                            options={
                                ethnics?.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                })) || []
                            }
                            loading={isLoadingEthnics}
                        />
                        {gender_state === 'female' ? (
                            <div className="flex flex-col gap-2">
                                <FormSelect
                                    control={control}
                                    name="pregnancy"
                                    label={t.profile_form.pregnancy_status}
                                    size="large"
                                    placeholder="Select a marriage"
                                    options={[
                                        { value: 'yes', label: t.profile_form.yes },
                                        { value: 'no', label: t.profile_form.no },
                                    ]}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <FormDatePicker
                                        control={control}
                                        name="start_date_pregnant"
                                        label={t.profile_form.start_pregnant_date}
                                        placeholder="Enter your date of issue"
                                        size="large"
                                        type="text"
                                    />
                                    <FormDatePicker
                                        control={control}
                                        name="end_date_pregnant"
                                        label={t.profile_form.end_pregnant_date}
                                        placeholder="Enter your date of issue"
                                        size="large"
                                        type="text"
                                    />
                                </div>
                                <FormSelect
                                    control={control}
                                    name="has_child"
                                    label={t.profile_form.take_care_child_status}
                                    size="large"
                                    placeholder="Select a marriage"
                                    options={[
                                        { value: 'yes', label: t.profile_form.yes },
                                        { value: 'no', label: t.profile_form.no },
                                    ]}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <FormDatePicker
                                        control={control}
                                        name="start_date_take_care_child"
                                        label={t.profile_form.start_pregnant_date}
                                        placeholder="Enter your date of issue"
                                        size="large"
                                        type="text"
                                    />
                                    <FormDatePicker
                                        control={control}
                                        name="end_date_take_care_child"
                                        label={t.profile_form.end_pregnant_date}
                                        placeholder="Enter your date of issue"
                                        size="large"
                                        type="text"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <FormSelect
                                    control={control}
                                    name="has_child"
                                    label={t.profile_form.take_care_child_status}
                                    size="large"
                                    placeholder="Select a marriage"
                                    options={[
                                        { value: 'yes', label: t.profile_form.yes },
                                        { value: 'no', label: t.profile_form.no },
                                    ]}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <FormDatePicker
                                        control={control}
                                        name="start_date_take_care_child"
                                        label={t.profile_form.start_pregnant_date}
                                        placeholder="Enter your date of issue"
                                        size="large"
                                        type="text"
                                    />
                                    <FormDatePicker
                                        control={control}
                                        name="end_date_take_care_child"
                                        label={t.profile_form.end_pregnant_date}
                                        placeholder="Enter your date of issue"
                                        size="large"
                                        type="text"
                                    />
                                </div>
                            </div>
                        )}
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
            label: t.profile_form.insurance_information,
            children: (
                <div className="grid grid-cols-2 gap-2">
                    <FormDatePicker
                        control={control}
                        name="join_insurance_date"
                        label={t.profile_form.join_insurance_date}
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="withholding_date"
                        label={t.profile_form.withholding_date}
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormSelect
                        control={control}
                        name="refusal_insurance"
                        label={t.profile_form.refusal_insurance}
                        size="large"
                        placeholder="Select a visa type"
                        options={[
                            { value: 'yes', label: t.profile_form.yes },
                            { value: 'no', label: t.profile_form.no },
                        ]}
                        loading={isLoadingVisaType}
                    />
                    <FormTextArea
                        control={control}
                        name="refusal_reason"
                        label={t.profile_form.refusal_reason}
                        placeholder="Enter your memo visa"
                        size="large"
                    />
                </div>
            ),
        },
        {
            key: '7',
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

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Collapse
                items={items}
                bordered={false}
                defaultActiveKey={['1', '2', '3', '4', '5', '6']}
            />
            <Form.Item>
                <div className="flex items-center gap-2 justify-end mt-4">
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
