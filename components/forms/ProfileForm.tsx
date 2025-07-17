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
import { useEffect, useState } from 'react';
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
import { CreateEmployeeRequest } from '@/types/requests/profileEmployee';
import { EmployeeResponseType } from '@/types/response/employees';
import { RcFile } from 'antd/es/upload';
/* eslint-disable @typescript-eslint/no-explicit-any */
interface ProfileFormProps {
    employee_modify?: EmployeeResponseType;
    mutate: () => void;
    close: () => void;
}
function ProfileForm({ employee_modify, mutate, close }: ProfileFormProps) {
    const { t } = useTranslationCustom();
    const [uploadedFile, setUploadedFile] = useState<RcFile | null>(null);
    const handleFileUploadSuccess = (file: RcFile | null) => {
        setUploadedFile(file);
    };
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

    useEffect(() => {
        if (employee_modify) {
            reset({
                card_number: employee_modify?.card_number || '',
                fullname: employee_modify?.fullname || '',
                fullname_other: employee_modify?.fullname_other || '',
                nation: employee_modify?.national_id || 0,
                education: employee_modify?.education_id || 0,
                gender: employee_modify?.gender ? 'male' : 'female',
                phone_vn: employee_modify?.phone_vietnam || '',
                phone_tw: employee_modify?.phone_taiwan || '',
                address: employee_modify?.address || '',
                provinces_id: employee_modify?.vn_address?.province_id || '',
                districts_id: employee_modify?.vn_address?.district_id || '',
                wards_id: employee_modify?.vn_address?.ward_id || '',
                cccd: employee_modify?.id_card_number || '',
                place_of_birth: employee_modify?.place_of_birth || '',
                place_of_issue: employee_modify?.id_card_issue_by || '',
                date_of_issue: employee_modify?.id_card_issue_date || '',
                date_of_birth: employee_modify?.birthday || '',
                ethnics: employee_modify?.ethnic_id || 0,
                marriage: employee_modify?.marriage_status === true ? 'yes' : 'no',
                number_of_children: employee_modify?.has_children || 0,
                type_of_work: employee_modify?.class?.id || 0,
                language: employee_modify?.speak_languages?.language_id
                    ? [employee_modify?.speak_languages?.language_id]
                    : [],
                work_place: employee_modify?.work_place_id || 0,
                unit: employee_modify?.unit?.id || 0,
                job_title: employee_modify?.job_title_id || 0,
                description: employee_modify?.work_description || '',
                shift: employee_modify?.shift?.id || 0,
                // start_date_shift: employee_modify?.shift?.start || '',
                // end_date_shift: employee_modify?.shift?.end || '',
                active_contract_date: employee_modify?.contract?.effect_date || '',
                expired_contract_date: employee_modify?.contract?.expir_date || '',
                join_company_date1: employee_modify?.join_company_date1 || '',
                join_company_date2: employee_modify?.join_company_date2 || '',
                type_contract: employee_modify?.contract?.type_id || 0,
                // passport_number: employee_modify?.visa?.passport_number || '',
                // date_of_passport: employee_modify?.visa?.passport_issue_date || '',
                // date_of_passport_expired: employee_modify?.visa?.passport_expiration_date || '',
                // visa_number: employee_modify?.visa?.visa_number || '',
                // date_created_visa: employee_modify?.visa?.visa_effective_date || '',
                // date_expired_visa: employee_modify?.visa?.visa_expiration_date || '',
                // work_permit_number: employee_modify?.visa?.work_permit_number || '',
                // work_permit_number_expired: employee_modify?.visa?.work_permit_expiration_date || '',
                // residence_time: employee_modify?.visa?.visa_duration_stay || 0,
                // type_visa: employee_modify?.visa?.visa_type_id || 0,
                // memo_visa: employee_modify?.visa?.visa_note || '',
                join_insurance_date: employee_modify?.insurance?.join_date || '',
                withholding_date: employee_modify?.insurance?.initial_deduction_date || '',
                refusal_insurance: employee_modify?.refusal_insurance ? 'yes' : 'no',
                refusal_reason: employee_modify?.refusal_insurance || '',
                pregnancy: employee_modify?.is_pregnant_woman ? 'yes' : 'no',
                start_date_pregnant: employee_modify?.pregnancy?.start_date || '',
                end_date_pregnant: employee_modify?.pregnancy?.end_date || '',
                has_child: employee_modify?.is_taking_care_children ? 'yes' : 'no',
                start_date_take_care_child: employee_modify?.take_care_of_child?.start_date || '',
                end_date_take_care_child: employee_modify?.take_care_of_child?.end_date || '',
            });
        }
    }, [employee_modify, reset]);

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
        // Helper: chuyển '' hoặc 0 thành null
        const toNull = (v: any) => (v === '' || v === 0 ? null : v);
        try {
            const newData: Partial<CreateEmployeeRequest> = {};

            if (toNull(data.fullname) !== null) {
                newData.fullname = toNull(data.fullname);
            }
            if (toNull(data.work_place) !== null) {
                newData.work_place_id = toNull(data.work_place);
            }

            const employee: any = {
                card_number: toNull(data.card_number),
                fullname: toNull(data.fullname),
                fullname_other: toNull(data.fullname_other),
                gender: data.gender === 'male' ? true : false,
                national_id: toNull(data.nation),
                education_id: toNull(data.education),
                phone_vientnam: toNull(data.phone_vn),
                phone_taiwan: toNull(data.phone_tw),
                id_card_number: toNull(data.cccd),
                id_card_issue_by: toNull(data.place_of_issue),
                id_card_issue_date: toNull(data.date_of_issue),
                ethnic_id: toNull(data.ethnics),
                place_of_birth: toNull(data.place_of_birth),
                marriage_status: data.marriage === 'married' ? 'on' : null,
                is_pregnant_woman: data.pregnancy === 'yes' ? true : false,
                is_taking_care_children: data.has_child === 'yes' ? true : false,
                has_children: toNull(data.number_of_children),
                class_id: toNull(data.job_title),
                join_company_date1: toNull(data.join_company_date1),
                join_company_date2: toNull(data.join_company_date2),
                vn_address: {
                    province_id: toNull(data.provinces_id),
                    district_id: toNull(data.districts_id),
                    ward_id: toNull(data.wards_id),
                },
                unit_id: toNull(data.unit),
                job_title_id: toNull(data.job_title),
                work_description: toNull(data.description),
                active: true,
                province: null,
                birthday: toNull(data.date_of_birth),
            };
            if (
                Object.values(employee).some((val) => val !== null) ||
                employee.active ||
                employee.is_taking_care_children ||
                employee.gender
            ) {
                newData.employee = employee;
            }

            const languages = {
                languages: (data.language ?? []).filter(
                    (lang): lang is number => typeof lang === 'number',
                ),
            };
            if (languages.languages.length > 0) {
                newData.languages = languages;
            }

            const insurance = {
                join_date: toNull(data.join_insurance_date),
                initial_deduction_date: toNull(data.withholding_date),
                refusal_insurance: data.refusal_insurance === 'yes' ? true : false,
                refusal_reason: toNull(data.refusal_reason),
            };
            if (
                Object.values(insurance).some((val) => val !== null) ||
                insurance.refusal_insurance
            ) {
                newData.insurance = insurance;
            }

            const contract = {
                effect_date: toNull(data.active_contract_date),
                expir_date: toNull(data.expired_contract_date),
                type_id: toNull(data.type_contract),
            };
            if (Object.values(contract).some((val) => val !== null)) {
                newData.contract = contract;
            }

            const visa = {
                passport_number: toNull(data.passport_number),
                passport_issue_date: toNull(data.date_of_passport),
                passport_expiration_date: toNull(data.date_of_passport_expired),
                work_permit_number: toNull(data.work_permit_number),
                work_permit_expiration_date: toNull(data.work_permit_number_expired),
                visa_number: toNull(data.visa_number),
                visa_type_id: toNull(data.type_visa),
                visa_expiration_date: toNull(data.date_expired_visa),
                visa_effective_date: toNull(data.date_created_visa),
                visa_duration_stay: toNull(data.residence_time),
                visa_note: toNull(data.memo_visa),
            };
            if (Object.values(visa).some((val) => val !== null)) {
                newData.visa = visa;
            }

            const shift = {
                shift_id: toNull(data.shift),
                start: toNull(data.start_date_shift),
                end: toNull(data.end_date_shift),
            };
            if (Object.values(shift).some((val) => val !== null)) {
                newData.shift = shift;
            }

            const has_child = {
                start_date: toNull(data.start_date_take_care_child),
                end_date: toNull(data.end_date_take_care_child),
            };
            if (Object.values(has_child).some((val) => val !== null)) {
                newData.has_child = has_child;
            }

            const pregnancy = {
                start_date: toNull(data.start_date_pregnant),
                end_date: toNull(data.end_date_pregnant),
            };
            if (Object.values(pregnancy).some((val) => val !== null)) {
                newData.pregnancy = pregnancy;
            }

            if (employee_modify?.card_number) {
                await employeeService.update(newData);
                if (uploadedFile && data.card_number) {
                    console.log('uploadedFile', uploadedFile);
                    await employeeService.upload_image(data.card_number, uploadedFile);
                }
                toast.success('Employee updated successfully.');
                reset();
                setUploadedFile(null);
            } else {
                if (!data.card_number) {
                    toast.error('Card number is required to add an employee.');
                    return;
                }
                await employeeService.add(newData);
                if (uploadedFile) {
                    await employeeService.upload_image(data.card_number, uploadedFile);
                }
                toast.success('Employee added successfully.');
                reset();
                setUploadedFile(null);
            }

            mutate();
            close();
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
                    onUploadSuccess={handleFileUploadSuccess}
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
