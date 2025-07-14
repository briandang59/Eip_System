import { Button, Collapse, CollapseProps, Form } from 'antd';
import {
    FormDatePicker,
    FormDateRangePicker,
    FormInput,
    FormSelect,
    FormTextArea,
} from '../formsComponent';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UploadCloud } from 'lucide-react';
import { useNations } from '@/apis/useSwr/nation';
import { useEducations } from '@/apis/useSwr/educations';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { useUnits } from '@/apis/useSwr/units';
import { useLanguages } from '@/apis/useSwr/languages';
import { useShifts } from '@/apis/useSwr/shift';
import { useUnitType } from '@/apis/useSwr/unitType';

function ProfileForm() {
    const { nations, isLoading: isLoadingNations } = useNations();
    const { educations, isLoading: isLoadingEducations } = useEducations();
    const { workPlaces, isLoading: isLoadingWorkplace } = useWorkPlaces();
    const { units, isLoading: isLoadingUnit } = useUnits();
    const { languages, isLoading: isLoadingLanguage } = useLanguages();
    const { shifts, isLoading: isLoadingShifts } = useShifts();
    const { unitTypes, isLoading: isLoadingUnitType } = useUnitType();

    const schema = yup
        .object({
            card_number: yup.string().required(),
            fullname: yup.string().required(),
            fullname_other: yup.string().required(),
            nation: yup.number().required(),
            education: yup.number().required(),
            gender: yup.string().required(),
            phone_vn: yup.string().required(),
            phone_tw: yup.string().required(),
            address: yup.string().required(),
            cccd: yup.string().required(),
            place_of_birth: yup.string().required(),
            place_of_issue: yup.string().required(),
            date_of_issue: yup.string().required(),
            date_of_birth: yup.string().required(),
            marriage: yup.string().required(),
            number_of_children: yup.number().required(),
            type_of_work: yup.number().required(),
            language: yup.number().required(),
            work_place: yup.number().required(),
            unit: yup.number().required(),
            job_title: yup.number().required(),
            description: yup.string().required(),
            shift: yup.string().required(),
            date_shift: yup.string().required(),
            active_contract_date: yup.string().required(),
            expired_contract_date: yup.string().required(),
            join_company_date1: yup.string().required(),
            join_company_date2: yup.string().required(),
            type_contract: yup.number().required(),
            passport_number: yup.string().required(),
            date_of_passport: yup.string().required(),
            date_of_passport_expired: yup.string().required(),
            visa_number: yup.string().required(),
            date_created_visa: yup.string().required(),
            date_expired_visa: yup.string().required(),
            work_permit_number: yup.string().required(),
            work_permit_number_expired: yup.string().required(),
            residence_time: yup.number().required(),
            type_visa: yup.number().required(),
            memo_visa: yup.string().required(),
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
        defaultValues: {
            card_number: '',
            fullname: '',
            fullname_other: '',
            nation: 1,
            education: 1,
            gender: '',
            phone_vn: '',
            phone_tw: '',
            address: '',
        },
    });
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Thông tin chung',
            children: (
                <div className="flex items-center gap-4">
                    <div className="grid grid-cols-2 gap-2 w-[60%]">
                        <FormInput
                            control={control}
                            name="card_number"
                            label="Mã nhân viên"
                            placeholder="Enter your username"
                            size="large"
                            type="text"
                            required
                            error={errors.card_number?.message}
                        />
                        <FormInput
                            control={control}
                            name="fullname"
                            label="Họ và tên"
                            placeholder="Enter your username"
                            size="large"
                            type="text"
                            required
                            error={errors.fullname?.message}
                        />
                        <FormInput
                            control={control}
                            name="fullname_other"
                            label="Tên gọi khác"
                            placeholder="Enter your username"
                            size="large"
                            type="text"
                            required
                            error={errors.fullname_other?.message}
                        />
                        <FormSelect
                            control={control}
                            name="nation"
                            label="Quốc tịch"
                            size="large"
                            required
                            placeholder="Select a role"
                            options={
                                nations?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en,
                                })) || []
                            }
                            loading={isLoadingNations}
                        />

                        <FormSelect
                            control={control}
                            name="education"
                            label="Học vấn"
                            size="large"
                            required
                            placeholder="Select a role"
                            options={
                                educations?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en,
                                })) || []
                            }
                            loading={isLoadingEducations}
                        />

                        <FormSelect
                            control={control}
                            name="gender"
                            label="Giới tính"
                            size="large"
                            required
                            placeholder="Select a role"
                            options={[
                                { value: 'male', label: 'Nam' },
                                { value: 'female', label: 'Nữ' },
                            ]}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center w-[40%] space-y-3">
                        <label
                            htmlFor="imageUpload"
                            className="w-full h-[200px] border border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                        >
                            <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">
                                Click để tải ảnh lên
                            </p>
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
            ),
        },
        {
            key: '2',
            label: 'Thông tin liên hệ',
            children: (
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        control={control}
                        name="phone_vn"
                        label="Số điện thoại Việt Nam"
                        placeholder="Enter your username"
                        size="large"
                        type="text"
                        error={errors.phone_vn?.message}
                    />
                    <FormInput
                        control={control}
                        name="phone_tw"
                        label="Số điện thoại Đài Loan"
                        placeholder="Enter your username"
                        size="large"
                        type="text"
                        error={errors.phone_tw?.message}
                    />
                    <div className="col-span-2">
                        <FormTextArea
                            control={control}
                            name="address"
                            label="Địa chỉ"
                            placeholder="Enter your username"
                            size="large"
                        />
                    </div>
                </div>
            ),
        },
        {
            key: '3',
            label: 'Thông tin cá nhân',
            children: (
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                        <FormInput
                            control={control}
                            name="cccd"
                            label="Số CCCD"
                            placeholder="Enter your username"
                            size="large"
                            type="text"
                            error={errors.cccd?.message}
                        />
                        <FormInput
                            control={control}
                            name="place_of_issue"
                            label="Nơi cấp CCCD"
                            placeholder="Enter your username"
                            size="large"
                            type="text"
                            error={errors.place_of_issue?.message}
                        />
                        <FormInput
                            control={control}
                            name="date_of_issue"
                            label="Ngày cấp CCCD"
                            placeholder="Enter your username"
                            size="large"
                            type="text"
                            error={errors.date_of_issue?.message}
                        />
                        <FormInput
                            control={control}
                            name="date_of_birth"
                            label="Ngày sinh"
                            placeholder="Enter your username"
                            size="large"
                            type="text"
                            error={errors.date_of_birth?.message}
                        />
                        <FormInput
                            control={control}
                            name="place_of_birth"
                            label="Nơi sinh"
                            placeholder="Enter your username"
                            size="large"
                            type="text"
                            error={errors.place_of_birth?.message}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <FormSelect
                            control={control}
                            name="marriage"
                            label="Tình trạng hôn nhân"
                            size="large"
                            required
                            placeholder="Select a role"
                            options={[
                                { value: '1', label: 'Chưa kết hôn' },
                                { value: '2', label: 'Đã kết hôn' },
                            ]}
                        />
                        <FormInput
                            control={control}
                            name="number_of_children"
                            label="Số con nhỏ"
                            placeholder="Enter your username"
                            size="large"
                            type="text"
                            error={errors.number_of_children?.message}
                        />
                    </div>
                </div>
            ),
        },
        {
            key: '4',
            label: 'Thông tin công việc',
            children: (
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                        <FormSelect
                            control={control}
                            name="type_of_work"
                            label="Loại công việc"
                            size="large"
                            required
                            placeholder="Select a role"
                            options={
                                unitTypes?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en,
                                })) || []
                            }
                            loading={isLoadingNations}
                        />
                        <FormSelect
                            control={control}
                            name="work_place"
                            label="Nơi làm việc"
                            size="large"
                            required
                            placeholder="Select a role"
                            options={
                                workPlaces?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en,
                                })) || []
                            }
                            loading={isLoadingNations}
                        />
                        <FormSelect
                            control={control}
                            name="unit"
                            label="Đơn vị"
                            size="large"
                            required
                            placeholder="Select a role"
                            options={
                                units?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en ?? item.name_vn ?? item.name_zh,
                                })) || []
                            }
                            loading={isLoadingNations}
                        />
                        <FormSelect
                            control={control}
                            name="job_title"
                            label="Chức vụ"
                            size="large"
                            required
                            placeholder="Select a role"
                            options={
                                nations?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en,
                                })) || []
                            }
                            loading={isLoadingNations}
                        />
                        <FormSelect
                            control={control}
                            name="language"
                            label="Ngôn ngữ"
                            size="large"
                            required
                            placeholder="Select a role"
                            options={
                                languages?.map((item) => ({
                                    value: item.id,
                                    label: item.name_en,
                                })) || []
                            }
                            loading={isLoadingNations}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <FormSelect
                            control={control}
                            name="shift"
                            label="Chọn ca làm"
                            size="large"
                            required
                            placeholder="Select a role"
                            options={
                                shifts?.map((item) => ({
                                    value: item.id,
                                    label: item.tag,
                                })) || []
                            }
                            loading={isLoadingShifts}
                        />
                        <FormDateRangePicker
                            control={control}
                            name="date_shift"
                            label="Khoảng ngày"
                            size="large"
                            required
                            placeholder={['Từ ngày', 'Đến ngày']}
                        />
                        <FormTextArea
                            control={control}
                            name="description"
                            label="Mô tả công việc"
                            placeholder="Enter your username"
                            size="large"
                        />
                    </div>
                </div>
            ),
        },
        {
            key: '5',
            label: 'Thông tin hợp đồng',
            children: (
                <div className="grid grid-cols-2 gap-2">
                    <FormDatePicker
                        control={control}
                        name="active_contract_date"
                        label="Ngày hiệu lực hợp đồng"
                        required
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="expired_contract_date"
                        label="Ngày hết hạn hợp đồng"
                        required
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="join_company_date1"
                        label="Ngày vào công ty"
                        required
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="join_company_date2"
                        label="Ngày vào công ty 2"
                        required
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormSelect
                        control={control}
                        name="shift"
                        label="Loại hợp đồng"
                        size="large"
                        required
                        placeholder="Select a role"
                        options={
                            shifts?.map((item) => ({
                                value: item.id,
                                label: item.tag,
                            })) || []
                        }
                        loading={isLoadingShifts}
                    />
                </div>
            ),
        },
        {
            key: '6',
            label: 'Thông tin visa',
            children: (
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        control={control}
                        name="card_number"
                        label="Số hộ chiếu"
                        placeholder="Enter your username"
                        size="large"
                        type="text"
                        required
                        error={errors.card_number?.message}
                    />
                    <FormInput
                        control={control}
                        name="card_number"
                        label="Số giấy phép lao động"
                        placeholder="Enter your username"
                        size="large"
                        type="text"
                        required
                        error={errors.card_number?.message}
                    />
                    <FormDatePicker
                        control={control}
                        name="join_company_date2"
                        label="Ngày cấp hộ chiếu"
                        required
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="join_company_date2"
                        label="Ngày hết hạn giấy phép làm việc"
                        required
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="join_company_date2"
                        label="Ngày hết hạn hộ chiếu"
                        size="large"
                        required
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormInput
                        control={control}
                        name="card_number"
                        label="Thời gian cư trú"
                        placeholder="Enter your username"
                        size="large"
                        type="number"
                        required
                        error={errors.card_number?.message}
                    />
                    <FormInput
                        control={control}
                        name="card_number"
                        label="Số visa"
                        placeholder="Enter your username"
                        size="large"
                        type="text"
                        required
                        error={errors.card_number?.message}
                    />
                    <FormSelect
                        control={control}
                        name="shift"
                        label="Loại visa"
                        size="large"
                        required
                        placeholder="Select a role"
                        options={
                            shifts?.map((item) => ({
                                value: item.id,
                                label: item.tag,
                            })) || []
                        }
                        loading={isLoadingShifts}
                    />
                    <FormDatePicker
                        control={control}
                        name="join_company_date2"
                        label="Ngày tạo visa"
                        size="large"
                        required
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormDatePicker
                        control={control}
                        name="join_company_date2"
                        label="Ngày hết visa"
                        size="large"
                        required
                        placeholder="Chọn ngày bắt đầu"
                    />
                    <FormTextArea
                        control={control}
                        name="description"
                        label="Ghi chú visa"
                        placeholder="Enter your username"
                        size="large"
                    />
                </div>
            ),
        },
    ];
    const onSubmit = async (data: FormData) => {
        console.log(data);
    };
    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Collapse
                items={items}
                bordered={false}
                defaultActiveKey={['1', '2', '3', '4', '5', '6']}
            />
            <Form.Item>
                <div className="flex items-center gap-2 justify-end">
                    <Button size="large">Huỷ</Button>
                    <Button size="large" type="primary" htmlType="submit">
                        Lưu thông tin
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default ProfileForm;
