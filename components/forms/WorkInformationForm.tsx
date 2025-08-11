import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { FormSelect, FormTextArea, FormDatePicker } from '../formsComponent';
import { useTranslationCustom } from '@/utils/hooks';
import { ShiftType } from '@/types/response/shiftType';
import { EmployeeClassResponseType } from '@/types/response/employeeClass';
/* eslint-disable @typescript-eslint/no-explicit-any */
interface WorkInformationFormProps {
    control: any;
    errors: any;
    workPlaces: any[];
    isLoadingWorkplace: boolean;
    units: any[];
    isLoadingUnit: boolean;
    jobTitles: any[];
    isLoadingJobtitle: boolean;
    languages: any[];
    isLoadingLanguage: boolean;
    shifts: ShiftType[];
    isLoadingShifts: boolean;
    t: any;
    employeeClass: EmployeeClassResponseType[];
    isLoadingEmployeeClass: boolean;
}

function WorkInformationForm({
    control,
    workPlaces,
    isLoadingWorkplace,
    units,
    isLoadingUnit,
    jobTitles,
    isLoadingJobtitle,
    languages,
    isLoadingLanguage,
    shifts,
    isLoadingShifts,
    t,
    employeeClass,
    isLoadingEmployeeClass,
}: WorkInformationFormProps) {
    const { lang } = useTranslationCustom();
    return (
        <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
                <FormSelect
                    control={control}
                    name="type_of_work"
                    label={t.profile_form.work_type}
                    size="large"
                    placeholder="Select a work type"
                    options={
                        employeeClass?.map((item) => ({
                            value: item.id,
                            label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                        })) || []
                    }
                    loading={isLoadingEmployeeClass}
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
                            label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
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
                            label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
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
                            label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
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
                            label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
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
                            label: `${item.tag} (${item.start_time} - ${item.end_time})`,
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
    );
}

export default WorkInformationForm;
