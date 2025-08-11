import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { FormDatePicker, FormSelect } from '../formsComponent';
import { ContractTypeListResponseType } from '@/types/response/contractTypeList';
import { useTranslationCustom } from '@/utils/hooks';
/* eslint-disable @typescript-eslint/no-explicit-any */
interface ContractInformationFormProps {
    control: any;
    errors: any;
    contractTypeList: ContractTypeListResponseType[];
    isLoadingContractTypeList: boolean;
    t: any;
}

function ContractInformationForm({
    control,
    contractTypeList,
    isLoadingContractTypeList,
    t,
}: ContractInformationFormProps) {
    const { lang } = useTranslationCustom();
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
                    contractTypeList?.map((item) => ({
                        value: item.id,
                        label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                    })) || []
                }
                loading={isLoadingContractTypeList}
            />
        </div>
    );
}

export default ContractInformationForm;
