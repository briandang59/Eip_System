import { FormInput, FormDatePicker, FormSelect, FormTextArea } from '../formsComponent';

interface VisaInformationFormProps {
    control: any;
    errors: any;
    visaTypes: any[];
    isLoadingVisaType: boolean;
    t: any;
}

function VisaInformationForm({
    control,
    errors,
    visaTypes,
    isLoadingVisaType,
    t,
}: VisaInformationFormProps) {
    return (
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
    );
}

export default VisaInformationForm;
