import { WorkPlaceType } from '@/types/response/roles';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { TableColumnsType } from 'antd';

export const useEmployeeCols = (): TableColumnsType<any> => {
    const { t } = useTranslationCustom();

    return [
        {
            title: 'Stt',
            width: 60,
            dataIndex: 'stt',
            key: 'stt',
            fixed: 'left',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: 'Full Name',
            dataIndex: 'full_name',
            key: 'full_name',
            width: 200,
        },
        {
            title: 'Foreign Name',
            dataIndex: 'foreign_name',
            key: 'foreign_name',
            width: 200,
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            width: 200,
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: 100,
        },
        {
            title: 'Place Of Birth',
            dataIndex: 'place_of_birth',
            key: 'place_of_birth',
            width: 500,
        },
        {
            title: 'Birthday',
            dataIndex: 'birthday',
            key: 'birthday',
            width: 200,
        },
        {
            title: 'Date Join Company 1',
            dataIndex: 'date_join_company_1',
            key: 'date_join_company_1',
            width: 200,
        },
        {
            title: 'Date Join Company 2',
            dataIndex: 'date_join_company_2',
            key: 'date_join_company_2',
            width: 200,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 200,
        },
        {
            title: 'Province/City',
            dataIndex: 'province_city',
            key: 'province_city',
            width: 200,
        },
        {
            title: 'Workplace',
            dataIndex: 'workplace',
            key: 'workplace',
            width: 200,
        },
        {
            title: 'ID Card Number',
            dataIndex: 'id_card_number',
            key: 'id_card_number',
            width: 200,
        },
        {
            title: 'ID Card Date',
            dataIndex: 'id_card_date',
            key: 'id_card_date',
            width: 200,
        },
        {
            title: 'ID Card Place',
            dataIndex: 'id_card_place',
            key: 'id_card_place',
            width: 200,
        },

        {
            title: 'ID Card Place',
            dataIndex: 'id_card_place',
            key: 'id_card_place',
            width: 200,
        },
        {
            title: 'Education',
            dataIndex: 'education',
            key: 'education',
            width: 200,
        },
        {
            title: 'Vietnam Phone',
            dataIndex: 'vietnam_phone',
            key: 'vietnam_phone',
            width: 200,
        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
            width: 200,
        },
        {
            title: 'Marriage',
            dataIndex: 'marriage',
            key: 'marriage',
            width: 200,
        },
        {
            title: 'Pregnant Woman',
            dataIndex: 'pregnant_woman',
            key: 'pregnant_woman',
            width: 200,
        },
        {
            title: 'Children',
            dataIndex: 'children',
            key: 'children',
            width: 200,
        },
        {
            title: 'Date Start Pregnant',
            dataIndex: 'date_start_pregnant',
            key: 'date_start_pregnant',
            width: 200,
        },
        {
            title: 'Date End Pregnant',
            dataIndex: 'date_end_pregnant',
            key: 'date_end_pregnant',
            width: 200,
        },
        {
            title: 'Date Start Take Care Child',
            dataIndex: 'date_start_take_care_child',
            key: 'date_start_take_care_child',
            width: 200,
        },
        {
            title: 'Date End Take Care Child',
            dataIndex: 'date_end_take_care_child',
            key: 'date_end_take_care_child',
            width: 200,
        },
        {
            title: 'Job Class',
            dataIndex: 'job_class',
            key: 'job_class',
            width: 200,
        },
        {
            title: 'Work Description',
            dataIndex: 'work_description',
            key: 'work_description',
            width: 200,
        },
        {
            title: 'Ethnic',
            dataIndex: 'ethnic',
            key: 'ethnic',
            width: 200,
        },
        {
            title: 'Speak Language',
            dataIndex: 'speak_language',
            key: 'speak_language',
            width: 200,
        },
        {
            title: 'Join Insurance',
            dataIndex: 'join_insurance',
            key: 'join_insurance',
            width: 200,
        },
        {
            title: 'Init Deduction Date',
            dataIndex: 'init_deduction_date',
            key: 'init_deduction_date',
            width: 200,
        },
        {
            title: 'Refusal Insurance',
            dataIndex: 'refusal_insurance',
            key: 'refusal_insurance',
            width: 200,
        },
        {
            title: 'Contract Effect Date',
            dataIndex: 'contract_effect',
            key: 'contract_effect',
            width: 200,
        },
        {
            title: 'Contract Expiration Date',
            dataIndex: 'contract_expiration_date',
            key: 'contract_expiration_date',
            width: 200,
        },
        {
            title: 'Old Department',
            dataIndex: 'old_department',
            key: 'old_department',
            width: 200,
        },
        {
            title: 'Old Factory',
            dataIndex: 'old_factory',
            key: 'old_factory',
            width: 200,
        },
        {
            title: 'Transfer Date',
            dataIndex: 'transfer_date',
            key: 'transfer_date',
            width: 200,
        },
        {
            title: 'New Department',
            dataIndex: 'new_department',
            key: 'new_department',
            width: 200,
        },
        {
            title: 'New Factory',
            dataIndex: 'new_factory',
            key: 'new_factory',
            width: 200,
        },
        {
            title: 'Date of Resignation',
            dataIndex: 'date_of_resignation',
            key: 'date_of_resignation',
            width: 200,
        },
        {
            title: 'Reason of Resignation',
            dataIndex: 'reason_of_resignation',
            key: 'reason_of_resignation',
            width: 200,
        },
    ];
};
