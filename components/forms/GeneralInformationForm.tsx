import { FormInput, FormSelect } from '../formsComponent';
import { NationResponseType } from '@/types/response/nation';
import { EducationResponseType } from '@/types/response/education';
import { Control } from 'react-hook-form';
import type { RcFile } from 'antd/es/upload';
import CustomImageUpload from '../ui/CustomImageUpload';
import { useMemberDataPhoto } from '@/apis/useSwr/photo';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks';
/* eslint-disable @typescript-eslint/no-explicit-any */
interface GeneralInformationFormProps {
    control: Control<any>;
    errors: Record<string, { message?: string }>;
    nations: NationResponseType[];
    isLoadingNations: boolean;
    educations: EducationResponseType[];
    isLoadingEducations: boolean;
    t: Record<string, any>;
    onUploadSuccess: (file: RcFile | null) => void;
}

function GeneralInformationForm({
    control,
    errors,
    nations,
    isLoadingNations,
    educations,
    isLoadingEducations,
    t,
    onUploadSuccess,
    employee_modify, // thêm prop này để truyền card_number
}: GeneralInformationFormProps & { employee_modify?: { card_number?: string } }) {
    const { lang } = useTranslationCustom();
    // Lấy ảnh từ API nếu có card_number
    const card_number = employee_modify?.card_number || '';
    const { photos } = useMemberDataPhoto({ card_number });
    const initialImage = photos ? `data:image/jpeg;base64,${photos}` : undefined;
    return (
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
                    placeholder="Enter your full name other"
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
                        nations?.map((item: NationResponseType) => ({
                            value: item.id,
                            label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                        })) || []
                    }
                    loading={isLoadingNations}
                />
                <FormSelect
                    control={control}
                    name="education"
                    label={t.profile_form.education}
                    size="large"
                    placeholder="Select an education"
                    options={
                        educations?.map((item: EducationResponseType) => ({
                            value: item.id,
                            label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
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
                <CustomImageUpload onUploadSuccess={onUploadSuccess} initialImage={initialImage} />
            </div>
        </div>
    );
}

export default GeneralInformationForm;
