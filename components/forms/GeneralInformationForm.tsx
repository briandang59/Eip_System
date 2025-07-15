import { UploadCloud } from 'lucide-react';
import { FormInput, FormSelect } from '../formsComponent';
import { NationResponseType } from '@/types/response/nation';
import { EducationResponseType } from '@/types/response/education';
import { Control } from 'react-hook-form';

interface GeneralInformationFormProps {
    control: Control<any>;
    errors: Record<string, { message?: string }>;
    nations: NationResponseType[];
    isLoadingNations: boolean;
    educations: EducationResponseType[];
    isLoadingEducations: boolean;
    t: Record<string, any>;
}

function GeneralInformationForm({
    control,
    errors,
    nations,
    isLoadingNations,
    educations,
    isLoadingEducations,
    t,
}: GeneralInformationFormProps) {
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
                        nations?.map((item: NationResponseType) => ({
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
                        educations?.map((item: EducationResponseType) => ({
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
                    <p className="text-sm text-gray-600 font-medium">Click để tải ảnh lên</p>
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
    );
}

export default GeneralInformationForm;
