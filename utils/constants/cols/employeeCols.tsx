import { EmployeeResponseType } from '@/types/response/employees';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { DeleteOutlined, EditOutlined, EyeFilled } from '@ant-design/icons';
import { Button, Popover, TableColumnsType } from 'antd';
import { Folder, Settings } from 'lucide-react';

interface params {
    state?: number;
    setSelectedUUID: (uuid: string) => void;
    setSelectedKey: (key: string) => void;
    setSelectedRecord: (record: EmployeeResponseType) => void;
}
export const useEmployeeCols = ({
    state,
    setSelectedKey,
    setSelectedUUID,
    setSelectedRecord,
}: params): TableColumnsType<any> => {
    const { t } = useTranslationCustom();
    const STATE = {
        NORMAL: 1,
        PROBATIONARY: 2,
        PREGNANCY: 3,
        CHILDREN: 4,
        QUIT: 5,
        RETIREMENT: 6,
        TRANSFER: 7,
    };
    const filterColumnsByState = {
        [STATE.NORMAL]: [
            'stt',
            'full_name',
            'fullname_other',
            'unit',
            'gender',
            'place_of_birth',
            'birthday',
            'date_join_company_1',
            'date_join_company_2',
            'address',
            'province_city',
            'workplace',
            'id_card_number',
            'id_card_date',
            'id_card_place',
            'education',
            'vietnam_phone',
            'nationality',
            'marriage',
            'pregnant_woman',
            'children',
            'date_start_pregnant',
            'date_end_pregnant',
            'date_start_take_care_child',
            'date_end_take_care_child',
            'job_class',
            'work_description',
            'ethnic',
            'speak_language',
            'join_insurance',
            'init_deduction_date',
            'refusal_insurance',
            'contract_effect',
            'contract_expiration_date',
            'old_department',
            'old_factory',
            'transfer_date',
            'new_department',
            'new_factory',
            'date_of_resignation',
            'reason_of_resignation',
            'actions',
        ],
        [STATE.PREGNANCY]: [
            'stt',
            'full_name',
            'foreign_name',
            'unit',
            'nationality',
            'date_start_pregnant',
            'date_end_pregnant',
            'job_class',
            'work_description',
            'actions',
        ],
        [STATE.CHILDREN]: [
            'stt',
            'full_name',
            'foreign_name',
            'unit',
            'nationality',
            'date_start_take_care_child',
            'date_end_take_care_child',
            'job_class',
            'work_description',
            'actions',
        ],
        [STATE.TRANSFER]: [],
        [STATE.QUIT]: [
            'stt',
            'full_name',
            'foreign_name',
            'unit',
            'gender',
            'place_of_birth',
            'birthday',
            'date_join_company_1',
            'date_join_company_2',
            'address',
            'province_city',
            'workplace',
            'id_card_number',
            'id_card_date',
            'id_card_place',
            'education',
            'vietnam_phone',
            'nationality',
            'job_class',
            'date_of_resignation',
            'reason_of_resignation',
            'actions',
        ],
        [STATE.RETIREMENT]: [
            'stt',
            'full_name',
            'foreign_name',
            'unit',
            'gender',
            'place_of_birth',
            'birthday',
            'date_join_company_1',
            'date_join_company_2',
            'address',
            'province_city',
            'workplace',
            'id_card_number',
            'id_card_date',
            'id_card_place',
            'education',
            'vietnam_phone',
            'nationality',
            'job_class',
            'date_of_resignation',
            'reason_of_resignation',
            'actions',
        ],
    };

    const allCols: TableColumnsType<EmployeeResponseType> = [
        {
            title: 'Stt',
            width: 60,
            dataIndex: 'stt',
            key: 'stt',
            fixed: 'left',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t.employee.full_name,
            dataIndex: 'full_name',
            key: 'full_name',
            width: 200,
            fixed: 'left',
            render: (_, record: EmployeeResponseType) => (
                <span className="flex items-center gap-2">
                    <button
                        className="cursor-pointer"
                        onClick={() => {
                            setSelectedKey('career_record');
                            setSelectedUUID(record?.uuid);
                            setSelectedRecord(record);
                        }}
                    >
                        <Folder strokeWidth={1.5} className="size-4 text-blue-700" />{' '}
                    </button>
                    {record?.fullname || '-'}
                </span>
            ),
        },
        {
            title: t.employee.foreign_name,
            dataIndex: ['fullname_other'],
            key: 'fullname_other',
            width: 200,
            fixed: 'left',

            render: (_, record: EmployeeResponseType) => (
                <span>{record?.fullname_other || '-'}</span>
            ),
        },
        {
            title: t.employee.unit,
            dataIndex: ['unit', 'name_en'],
            key: 'unit',
            width: 200,
            fixed: 'left',

            render: (_, record: EmployeeResponseType) => (
                <span>{record?.unit?.name_en || '-'}</span>
            ),
        },
        {
            title: t.employee.gender,
            dataIndex: ['gender'],
            key: 'gender',
            width: 100,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.gender ? 'Male' : 'Female'}</span>
            ),
        },
        {
            title: t.employee.place_of_birth,
            dataIndex: ['place_of_birth'],
            key: 'place_of_birth',
            width: 100,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.place_of_birth || '-'}</span>
            ),
        },
        {
            title: t.employee.birthday,
            dataIndex: ['birthday'],
            key: 'birthday',
            width: 200,
            render: (_, record: EmployeeResponseType) => <span>{record?.birthday || '-'}</span>,
        },
        {
            title: t.employee.date_join_company_1,
            dataIndex: 'date_join_company_1',
            key: 'date_join_company_1',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.join_company_date1 || '-'}</span>
            ),
        },
        {
            title: t.employee.date_join_company_2,
            dataIndex: 'date_join_company_2',
            key: 'date_join_company_2',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.join_company_date2 || '-'}</span>
            ),
        },
        {
            title: t.employee.address,
            dataIndex: 'address',
            key: 'address',
            width: 200,
            render: (_, record: EmployeeResponseType) => <span>{record?.address || '-'}</span>,
        },
        {
            title: t.employee.province_city,
            dataIndex: 'province_city',
            key: 'province_city',
            width: 200,
            render: (_, record: EmployeeResponseType) => <span>{record?.province || '-'}</span>,
        },
        {
            title: t.employee.workplace,
            dataIndex: 'workplace',
            key: 'workplace',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.work_place?.name_en || '-'}</span>
            ),
        },
        {
            title: t.employee.id_card_number,
            dataIndex: 'id_card_number',
            key: 'id_card_number',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.id_card_number || '-'}</span>
            ),
        },
        {
            title: t.employee.id_card_date,
            dataIndex: 'id_card_date',
            key: 'id_card_date',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.id_card_issue_date || '-'}</span>
            ),
        },
        {
            title: t.employee.id_card_place,
            dataIndex: 'id_card_place',
            key: 'id_card_place',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.id_card_issue_by || '-'}</span>
            ),
        },
        {
            title: t.employee.education,
            dataIndex: 'education',
            key: 'education',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.education?.name_en || '-'}</span>
            ),
        },
        {
            title: t.employee.vietnam_phone,
            dataIndex: 'vietnam_phone',
            key: 'vietnam_phone',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.phone_vientnam || '-'}</span>
            ),
        },
        {
            title: t.employee.nationality,
            dataIndex: 'nationality',
            key: 'nationality',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.nation?.name_en || '-'}</span>
            ),
        },
        {
            title: t.employee.marriage,
            dataIndex: 'marriage',
            key: 'marriage',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.marriage_status ? 'Married' : 'Single'}</span>
            ),
        },
        {
            title: t.employee.pregnant_woman,
            dataIndex: 'pregnant_woman',
            key: 'pregnant_woman',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.is_pregnant_woman ? 'Yes' : 'No'}</span>
            ),
        },
        {
            title: t.employee.children,
            dataIndex: 'children',
            key: 'children',
            width: 200,
            render: (_, record: EmployeeResponseType) => <span>{record?.has_children || '-'}</span>,
        },
        {
            title: t.employee.date_start_pregnant,
            dataIndex: 'date_start_pregnant',
            key: 'date_start_pregnant',
            width: 200,
            render: (_, record: EmployeeResponseType) => {
                const pregnancy = record?.pregnancy;
                if (pregnancy && typeof pregnancy === 'object') {
                    return <span>{(pregnancy as any)?.start_date || '-'}</span>;
                }
                return <span>{pregnancy || '-'}</span>;
            },
        },
        {
            title: t.employee.date_end_pregnant,
            dataIndex: 'date_end_pregnant',
            key: 'date_end_pregnant',
            width: 200,
            render: (_, record: EmployeeResponseType) => {
                const pregnancy = record?.pregnancy;
                if (pregnancy && typeof pregnancy === 'object') {
                    return <span>{(pregnancy as any)?.end_date || '-'}</span>;
                }
                return <span>{pregnancy || '-'}</span>;
            },
        },
        {
            title: t.employee.date_start_take_care_child,
            dataIndex: 'date_start_take_care_child',
            key: 'date_start_take_care_child',
            width: 200,
            render: (_, record: EmployeeResponseType) => {
                const takeCarePeriod = record?.take_care_of_child;
                if (takeCarePeriod && typeof takeCarePeriod === 'object') {
                    return <span>{(takeCarePeriod as any)?.start_date || '-'}</span>;
                }
                return <span>{takeCarePeriod || '-'}</span>;
            },
        },
        {
            title: t.employee.date_end_take_care_child,
            dataIndex: 'date_end_take_care_child',
            key: 'date_end_take_care_child',
            width: 200,
            render: (_, record: EmployeeResponseType) => {
                const takeCarePeriod = record?.take_care_of_child;
                if (takeCarePeriod && typeof takeCarePeriod === 'object') {
                    return <span>{(takeCarePeriod as any)?.end_date || '-'}</span>;
                }
                return <span>{takeCarePeriod || '-'}</span>;
            },
        },
        {
            title: t.employee.job_class,
            dataIndex: 'job_class',
            key: 'job_class',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.class?.name_en || '-'}</span>
            ),
        },
        {
            title: t.employee.work_description,
            dataIndex: 'work_description',
            key: 'work_description',
            width: 200,
            render: (_, record: EmployeeResponseType) => {
                const workDescription = record?.work_description;
                if (workDescription && typeof workDescription === 'object') {
                    return <span>{JSON.stringify(workDescription)}</span>;
                }
                return <span>{workDescription || '-'}</span>;
            },
        },
        {
            title: t.employee.ethnic,
            dataIndex: 'ethnic',
            key: 'ethnic',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.ethnic?.name_en || '-'}</span>
            ),
        },
        {
            title: t.employee.speak_language,
            dataIndex: 'speak_language',
            key: 'speak_language',
            width: 200,
            render: (_, record: EmployeeResponseType) => {
                const speakLanguages = record?.speak_languages;
                if (speakLanguages && typeof speakLanguages === 'object') {
                    return <span>{speakLanguages?.languages?.name_en || '-'}</span>;
                }
                return <span>{speakLanguages || '-'}</span>;
            },
        },
        {
            title: t.employee.join_insurance,
            dataIndex: 'join_insurance',
            key: 'join_insurance',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.insurance?.join_date || '-'}</span>
            ),
        },
        {
            title: t.employee.init_deduction_date,
            dataIndex: 'init_deduction_date',
            key: 'init_deduction_date',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.insurance?.initial_deduction_date || '-'}</span>
            ),
        },
        {
            title: t.employee.refusal_insurance,
            dataIndex: 'refusal_insurance',
            key: 'refusal_insurance',
            width: 200,
            render: (_, record: EmployeeResponseType) => {
                const refusalInsurance = record?.refusal_insurance;
                if (refusalInsurance && typeof refusalInsurance === 'object') {
                    return <span>{JSON.stringify(refusalInsurance)}</span>;
                }
                return <span>{refusalInsurance || '-'}</span>;
            },
        },
        {
            title: t.employee.contract_effect_date,
            dataIndex: 'contract_effect',
            key: 'contract_effect',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.contract?.effect_date || '-'}</span>
            ),
        },
        {
            title: t.employee.contract_expiration_date,
            dataIndex: 'contract_expiration_date',
            key: 'contract_expiration_date',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.contract?.expir_date || '-'}</span>
            ),
        },
        {
            title: t.employee.old_department,
            dataIndex: 'old_department',
            key: 'old_department',
            width: 200,
            render: () => <span>-</span>,
        },
        {
            title: t.employee.old_factory,
            dataIndex: 'old_factory',
            key: 'old_factory',
            width: 200,
            render: () => <span>-</span>,
        },
        {
            title: t.employee.transfer_date,
            dataIndex: 'transfer_date',
            key: 'transfer_date',
            width: 200,
            render: () => <span>-</span>,
        },
        {
            title: t.employee.new_department,
            dataIndex: 'new_department',
            key: 'new_department',
            width: 200,
            render: () => <span>-</span>,
        },
        {
            title: t.employee.new_factory,
            dataIndex: 'new_factory',
            key: 'new_factory',
            width: 200,
            render: () => <span>-</span>,
        },
        {
            title: t.employee.date_of_resignation,
            dataIndex: 'date_of_resignation',
            key: 'date_of_resignation',
            width: 200,
            render: () => <span>-</span>,
        },
        {
            title: t.employee.reason_of_resignation,
            dataIndex: 'reason_of_resignation',
            key: 'reason_of_resignation',
            width: 200,
            render: () => <span>-</span>,
        },
        {
            title: t.employee.actions,
            dataIndex: 'actions',
            key: 'actions',
            width: 50,
            fixed: 'right',
            render: (_, record: EmployeeResponseType) => (
                <Popover
                    trigger="click"
                    content={
                        <div className="flex flex-col gap-2">
                            <Button icon={<EyeFilled className="!text-green-700" />}>
                                Xem hồ sơ
                            </Button>
                            <Button icon={<EditOutlined className="!text-blue-500" />}>
                                Sửa hồ sơ
                            </Button>
                            <Button icon={<DeleteOutlined className="!text-red-500" />}>
                                Xoá hồ sơ
                            </Button>
                        </div>
                    }
                >
                    <Button>
                        <Settings className="size-4 text-green-700" />
                    </Button>
                </Popover>
            ),
        },
    ];

    if (!state || !filterColumnsByState[state]) return allCols;

    const filteredKeys = filterColumnsByState[state];

    const result = allCols.filter(
        (col) => 'key' in col && typeof col.key === 'string' && filteredKeys.includes(col.key),
    );
    return result;
};
