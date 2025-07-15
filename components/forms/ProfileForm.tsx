import { Button, Collapse, CollapseProps, Form } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
import GeneralInformationForm from './GeneralInformationForm';
import ContactInformationForm from './ContactInformationForm';
import SelfInformationForm from './SelfInformationForm';
import WorkInformationForm from './WorkInformationForm';
import ContractInformationForm from './ContractInformationForm';
import InsuranceInformationForm from './InsuranceInformationForm';
import VisaInformationForm from './VisaInformationForm';
import { DistrictsResponseType } from '@/types/response/districts';

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
                <GeneralInformationForm
                    control={control}
                    errors={errors}
                    nations={nations || []}
                    isLoadingNations={isLoadingNations}
                    educations={educations || []}
                    isLoadingEducations={isLoadingEducations}
                    t={t}
                />
            ),
        },
        {
            key: '2',
            label: t.profile_form.contact_information,
            children: (
                <ContactInformationForm
                    control={control}
                    errors={errors}
                    nation={nation}
                    NATION_VN={NATION_VN}
                    provinces={provinces || []}
                    isLoadingProvinces={isLoadingProvinces}
                    districts={(districts || []) as DistrictsResponseType[]}
                    isLoadingDistricts={isLoadingDistricts}
                    wards={wards || []}
                    isLoadingWards={isLoadingWards}
                    t={t}
                />
            ),
        },
        {
            key: '3',
            label: t.profile_form.self_information,
            children: (
                <SelfInformationForm
                    control={control}
                    errors={errors}
                    gender_state={gender_state}
                    ethnics={ethnics || []}
                    isLoadingEthnics={isLoadingEthnics}
                    t={t}
                />
            ),
        },
        {
            key: '4',
            label: t.profile_form.work_information,
            children: (
                <WorkInformationForm
                    control={control}
                    errors={errors}
                    unitTypes={unitTypes || []}
                    isLoadingUnitType={isLoadingUnitType}
                    workPlaces={workPlaces || []}
                    isLoadingWorkplace={isLoadingWorkplace}
                    units={units || []}
                    isLoadingUnit={isLoadingUnit}
                    jobTitles={jobTitles || []}
                    isLoadingJobtitle={isLoadingJobtitle}
                    languages={languages || []}
                    isLoadingLanguage={isLoadingLanguage}
                    shifts={shifts}
                    isLoadingShifts={isLoadingShifts}
                    t={t}
                />
            ),
        },
        {
            key: '5',
            label: t.profile_form.contract_information,
            children: (
                <ContractInformationForm
                    control={control}
                    errors={errors}
                    shifts={shifts}
                    isLoadingShifts={isLoadingShifts}
                    t={t}
                />
            ),
        },
        {
            key: '6',
            label: t.profile_form.insurance_information,
            children: (
                <InsuranceInformationForm
                    control={control}
                    errors={errors}
                    isLoadingVisaType={isLoadingVisaType}
                    t={t}
                />
            ),
        },
        {
            key: '7',
            label: t.profile_form.visa_information,
            children: (
                <VisaInformationForm
                    control={control}
                    errors={errors}
                    visaTypes={visaTypes || []}
                    isLoadingVisaType={isLoadingVisaType}
                    t={t}
                />
            ),
        },
    ];

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Collapse
                items={items}
                bordered={false}
                defaultActiveKey={['1', '2', '3', '4', '5', '6', '7']}
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
