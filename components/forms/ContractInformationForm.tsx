import { FormDatePicker, FormSelect } from '../formsComponent';
/* eslint-disable @typescript-eslint/no-explicit-any */
interface ContractInformationFormProps {
    control: any;
    errors: any;
    shifts: any[];
    isLoadingShifts: boolean;
    t: any;
}

function ContractInformationForm({
    control,
    shifts,
    isLoadingShifts,
    t,
}: ContractInformationFormProps) {
    return (
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
    );
}

export default ContractInformationForm;
