import { FormInput, FormSelect, FormDatePicker } from '../formsComponent';
/* eslint-disable @typescript-eslint/no-explicit-any */
interface SelfInformationFormProps {
    control: any;
    errors: any;
    gender_state: string;
    ethnics: any[];
    isLoadingEthnics: boolean;
    t: any;
}

function SelfInformationForm({
    control,
    errors,
    gender_state,
    ethnics,
    isLoadingEthnics,
    t,
}: SelfInformationFormProps) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
                <FormInput
                    control={control}
                    name="cccd"
                    label={t.profile_form.cccd_number}
                    placeholder="Enter your cccd"
                    size="large"
                    type="text"
                    required
                    error={errors.cccd?.message}
                />
                <FormInput
                    control={control}
                    name="place_of_issue"
                    label={t.profile_form.place_of_issuse}
                    placeholder="Enter your place of issue"
                    size="large"
                    type="text"
                    error={errors.place_of_issue?.message}
                />
                <FormDatePicker
                    control={control}
                    name="date_of_issue"
                    label={t.profile_form.date_of_issue}
                    placeholder="Enter your date of issue"
                    size="large"
                    type="text"
                />
                <FormDatePicker
                    control={control}
                    name="date_of_birth"
                    label={t.profile_form.birthday}
                    placeholder="Enter your birthday"
                    size="large"
                    type="text"
                />
                <FormInput
                    control={control}
                    name="place_of_birth"
                    label={t.profile_form.place_of_birth}
                    placeholder="Enter your place of birthday"
                    size="large"
                    type="text"
                    error={errors.place_of_birth?.message}
                />
            </div>
            <div className="flex flex-col gap-2">
                <FormSelect
                    control={control}
                    name="marriage"
                    label={t.profile_form.marriage}
                    size="large"
                    placeholder="Select a marriage"
                    options={[
                        { value: 'not_marriaged', label: t.profile_form.no },
                        { value: 'marriaged', label: t.profile_form.yes },
                    ]}
                    required
                />
                <FormInput
                    control={control}
                    name="number_of_children"
                    label={t.profile_form.number_of_children}
                    placeholder="Enter your number of children"
                    size="large"
                    type="text"
                    error={errors.number_of_children?.message}
                />
                <FormSelect
                    control={control}
                    name="ethnics"
                    label={t.profile_form.ethnics}
                    size="large"
                    placeholder="Select a education"
                    options={
                        ethnics?.map((item) => ({
                            value: item.id,
                            label: item.name,
                        })) || []
                    }
                    loading={isLoadingEthnics}
                />
                {gender_state === 'female' ? (
                    <div className="flex flex-col gap-2">
                        <FormSelect
                            control={control}
                            name="pregnancy"
                            label={t.profile_form.pregnancy_status}
                            size="large"
                            placeholder="Select a marriage"
                            options={[
                                { value: 'yes', label: t.profile_form.yes },
                                { value: 'no', label: t.profile_form.no },
                            ]}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <FormDatePicker
                                control={control}
                                name="start_date_pregnant"
                                label={t.profile_form.start_pregnant_date}
                                placeholder="Enter your date of issue"
                                size="large"
                                type="text"
                            />
                            <FormDatePicker
                                control={control}
                                name="end_date_pregnant"
                                label={t.profile_form.end_pregnant_date}
                                placeholder="Enter your date of issue"
                                size="large"
                                type="text"
                            />
                        </div>
                        <FormSelect
                            control={control}
                            name="has_child"
                            label={t.profile_form.take_care_child_status}
                            size="large"
                            placeholder="Select a marriage"
                            options={[
                                { value: 'yes', label: t.profile_form.yes },
                                { value: 'no', label: t.profile_form.no },
                            ]}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <FormDatePicker
                                control={control}
                                name="start_date_take_care_child"
                                label={t.profile_form.start_pregnant_date}
                                placeholder="Enter your date of issue"
                                size="large"
                                type="text"
                            />
                            <FormDatePicker
                                control={control}
                                name="end_date_take_care_child"
                                label={t.profile_form.end_pregnant_date}
                                placeholder="Enter your date of issue"
                                size="large"
                                type="text"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <FormSelect
                            control={control}
                            name="has_child"
                            label={t.profile_form.take_care_child_status}
                            size="large"
                            placeholder="Select a marriage"
                            options={[
                                { value: 'yes', label: t.profile_form.yes },
                                { value: 'no', label: t.profile_form.no },
                            ]}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <FormDatePicker
                                control={control}
                                name="start_date_take_care_child"
                                label={t.profile_form.start_pregnant_date}
                                placeholder="Enter your date of issue"
                                size="large"
                                type="text"
                            />
                            <FormDatePicker
                                control={control}
                                name="end_date_take_care_child"
                                label={t.profile_form.end_pregnant_date}
                                placeholder="Enter your date of issue"
                                size="large"
                                type="text"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SelfInformationForm;
