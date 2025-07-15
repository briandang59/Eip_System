import { FormInput, FormTextArea, FormSelect } from '../formsComponent';
import { ProvincesResponseType } from '@/types/response/provinces';
import { DistrictsResponseType } from '@/types/response/districts';
import { WardsResponseType } from '@/types/response/wards';
import { Control } from 'react-hook-form';

interface ContactInformationFormProps {
    control: Control<any>;
    errors: Record<string, { message?: string }>;
    nation: number;
    NATION_VN: number;
    provinces: ProvincesResponseType[];
    isLoadingProvinces: boolean;
    districts: DistrictsResponseType[];
    isLoadingDistricts: boolean;
    wards: WardsResponseType[];
    isLoadingWards: boolean;
    t: Record<string, any>;
}

function ContactInformationForm({
    control,
    errors,
    nation,
    NATION_VN,
    provinces,
    isLoadingProvinces,
    districts,
    isLoadingDistricts,
    wards,
    isLoadingWards,
    t,
}: ContactInformationFormProps) {
    return (
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
                            provinces?.map((item: ProvinceResponseType) => ({
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
                            districts?.map((item: DistrictResponseType) => ({
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
                            wards?.map((item: WardResponseType) => ({
                                value: item.code,
                                label: item.name,
                            })) || []
                        }
                        loading={isLoadingWards}
                    />
                </div>
            )}
        </div>
    );
}

export default ContactInformationForm;
