import { FormDatePicker, FormSelect, FormTextArea } from '../formsComponent';

interface InsuranceInformationFormProps {
    control: any;
    errors: any;
    isLoadingVisaType: boolean;
    t: any;
}

function InsuranceInformationForm({
    control,
    errors,
    isLoadingVisaType,
    t,
}: InsuranceInformationFormProps) {
    return (
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
    );
}

export default InsuranceInformationForm;
