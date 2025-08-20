import { EmployeeResponseType } from '@/types/response/employees';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { EditOutlined, EyeFilled } from '@ant-design/icons';
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
            'card_number',
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
            'card_number',
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
            'card_number',
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
            'card_number',
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
            'card_number',
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
            title: 'Card number',
            width: 100,
            dataIndex: 'card_number',
            key: 'card_number',
            fixed: 'left',
            sorter: (a, b) => (a.card_number || '').localeCompare(b.card_number || ''),
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
            sorter: (a, b) => (a.fullname || '').localeCompare(b.fullname || '') || 0,
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
            sorter: (a, b) => a.fullname_other?.localeCompare(b.fullname_other || '') || 0,
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
            sorter: (a, b) => a.unit?.name_en?.localeCompare(b.unit?.name_en || '') || 0,
        },
        {
            title: t.employee.gender,
            dataIndex: ['gender'],
            key: 'gender',
            width: 100,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.gender ? t.common.male : t.common.female}</span>
            ),
            sorter: (a, b) =>
                (a.gender ?? '').toString().localeCompare((b.gender ?? '').toString()),
        },
        {
            title: t.employee.place_of_birth,
            dataIndex: ['place_of_birth'],
            key: 'place_of_birth',
            width: 100,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.place_of_birth || '-'}</span>
            ),
            sorter: (a, b) => (a.place_of_birth || '').localeCompare(b.place_of_birth || '') || 0,
        },
        {
            title: t.employee.birthday,
            dataIndex: ['birthday'],
            key: 'birthday',
            width: 200,
            render: (_, record: EmployeeResponseType) => <span>{record?.birthday || '-'}</span>,
            sorter: (a, b) => (a.birthday || '').localeCompare(b.birthday || '') || 0,
        },
        {
            title: t.employee.date_join_company_1,
            dataIndex: 'date_join_company_1',
            key: 'date_join_company_1',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.join_company_date1 || '-'}</span>
            ),
            sorter: (a, b) =>
                (a.join_company_date1 || '').localeCompare(b.join_company_date1 || '') || 0,
        },
        {
            title: t.employee.date_join_company_2,
            dataIndex: 'date_join_company_2',
            key: 'date_join_company_2',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.join_company_date2 || '-'}</span>
            ),
            sorter: (a, b) =>
                (a.join_company_date2 || '').localeCompare(b.join_company_date2 || '') || 0,
        },
        {
            title: t.employee.address,
            dataIndex: 'address',
            key: 'address',
            width: 200,
            render: (_, record: EmployeeResponseType) => <span>{record?.address || '-'}</span>,
            sorter: (a, b) => a.address?.localeCompare(b.address || '') || 0,
        },
        {
            title: t.employee.province_city,
            dataIndex: 'province_city',
            key: 'province_city',
            width: 200,
            render: (_, record: EmployeeResponseType) => <span>{record?.province || '-'}</span>,
            sorter: (a, b) => a.province?.localeCompare(b.province || '') || 0,
        },
        {
            title: t.employee.workplace,
            dataIndex: 'workplace',
            key: 'workplace',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.work_place?.name_en || '-'}</span>
            ),
            sorter: (a, b) =>
                (a.work_place?.name_en || '').localeCompare(b.work_place?.name_en || '') || 0,
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
            sorter: (a, b) =>
                (a.id_card_issue_date || '').localeCompare(b.id_card_issue_date || '') || 0,
        },
        {
            title: t.employee.id_card_place,
            dataIndex: 'id_card_place',
            key: 'id_card_place',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.id_card_issue_by ? record.id_card_issue_by : '-'}</span>
            ),
            sorter: (a, b) =>
                (a.id_card_issue_by || '').localeCompare(b.id_card_issue_by || '') || 0,
        },
        {
            title: t.employee.education,
            dataIndex: 'education',
            key: 'education',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.education?.name_en || '-'}</span>
            ),
            sorter: (a, b) =>
                (a.education?.name_en || '').localeCompare(b.education?.name_en || '') || 0,
        },
        {
            title: t.employee.vietnam_phone,
            dataIndex: 'vietnam_phone',
            key: 'vietnam_phone',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.phone_vietnam || '-'}</span>
            ),
            sorter: (a, b) => (a.phone_vietnam || '').localeCompare(b.phone_vietnam || '') || 0,
        },
        {
            title: t.employee.nationality,
            dataIndex: 'nationality',
            key: 'nationality',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.nation?.name_en || '-'}</span>
            ),
            sorter: (a, b) => (a.nation?.name_en || '').localeCompare(b.nation?.name_en || '') || 0,
        },
        {
            title: t.employee.marriage,
            dataIndex: 'marriage',
            key: 'marriage',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.marriage_status ? t.common.yes : t.common.no}</span>
            ),
            sorter: (a, b) =>
                a.marriage_status === b.marriage_status ? 0 : a.marriage_status ? 1 : -1,
        },
        {
            title: t.employee.pregnant_woman,
            dataIndex: 'pregnant_woman',
            key: 'pregnant_woman',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.is_pregnant_woman ? t.common.yes : t.common.no}</span>
            ),
            sorter: (a, b) =>
                a.is_pregnant_woman === b.is_pregnant_woman ? 0 : a.is_pregnant_woman ? 1 : -1,
        },
        {
            title: t.employee.children,
            dataIndex: 'children',
            key: 'children',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{typeof record?.has_children === 'number' ? record.has_children : '-'}</span>
            ),
            sorter: (a, b) => {
                const aVal = typeof a.has_children === 'number' ? a.has_children : -1;
                const bVal = typeof b.has_children === 'number' ? b.has_children : -1;
                return aVal - bVal;
            },
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
            sorter: (a, b) => {
                const aDate = a.pregnancy?.start_date || '';
                const bDate = b.pregnancy?.start_date || '';
                return aDate.localeCompare(bDate);
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
            sorter: (a, b) => {
                const aDate = a.pregnancy?.end_date || '';
                const bDate = b.pregnancy?.end_date || '';
                return aDate.localeCompare(bDate);
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
            sorter: (a, b) => {
                const aDate = a.take_care_of_child?.start_date || '';
                const bDate = b.take_care_of_child?.start_date || '';
                return aDate.localeCompare(bDate);
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
            sorter: (a, b) => {
                const aDate = a.take_care_of_child?.end_date || '';
                const bDate = b.take_care_of_child?.end_date || '';
                return aDate.localeCompare(bDate);
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
            sorter: (a, b) => (a.class?.name_en || '').localeCompare(b.class?.name_en || '') || 0,
        },
        {
            title: t.employee.work_description,
            dataIndex: 'work_description',
            key: 'work_description',
            width: 200,
            render: (_, record: EmployeeResponseType) => {
                const workDescription = record?.work_description;
                if (
                    workDescription &&
                    typeof workDescription === 'object' &&
                    'description' in workDescription
                ) {
                    return (
                        <span>
                            {(workDescription as { description: string }).description || '-'}
                        </span>
                    );
                }
                return <span>{typeof workDescription === 'string' ? workDescription : '-'}</span>;
            },
            sorter: (a, b) => {
                const aDesc =
                    a.work_description &&
                    typeof a.work_description === 'object' &&
                    'description' in a.work_description
                        ? (a.work_description as { description?: string }).description || ''
                        : typeof a.work_description === 'string'
                          ? a.work_description
                          : '';
                const bDesc =
                    b.work_description &&
                    typeof b.work_description === 'object' &&
                    'description' in b.work_description
                        ? (b.work_description as { description?: string }).description || ''
                        : b.work_description || '';
                return aDesc.localeCompare(bDesc);
            },
        },
        {
            title: t.employee.ethnic,
            dataIndex: 'ethnic',
            key: 'ethnic',
            width: 200,
            render: (_, record: EmployeeResponseType) => <span>{record?.ethnic?.name || '-'}</span>,
            sorter: (a, b) => (a.ethnic?.name || '').localeCompare(b.ethnic?.name || '') || 0,
        },
        {
            title: t.employee.speak_language,
            dataIndex: 'speak_language',
            key: 'speak_language',
            width: 200,
            render: (_, record: EmployeeResponseType) => {
                const speakLanguages = record?.speak_languages;
                if (
                    speakLanguages &&
                    typeof speakLanguages === 'object' &&
                    'languages' in speakLanguages
                ) {
                    return <span>{speakLanguages.languages?.name_en || '-'}</span>;
                }
                return <span>-</span>;
            },
            sorter: (a, b) => {
                const aLang = a.speak_languages?.languages?.name_en || '';
                const bLang = b.speak_languages?.languages?.name_en || '';
                return aLang.localeCompare(bLang);
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
            sorter: (a, b) =>
                (a.insurance?.join_date || '').localeCompare(b.insurance?.join_date || '') || 0,
        },
        {
            title: t.employee.init_deduction_date,
            dataIndex: 'init_deduction_date',
            key: 'init_deduction_date',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.insurance?.initial_deduction_date || '-'}</span>
            ),
            sorter: (a, b) =>
                (a.insurance?.initial_deduction_date || '').localeCompare(
                    b.insurance?.initial_deduction_date || '',
                ) || 0,
        },
        {
            title: t.employee.refusal_insurance,
            dataIndex: 'refusal_insurance',
            key: 'refusal_insurance',
            width: 200,
            render: (_, record: EmployeeResponseType) => {
                const refusalInsurance = record?.refusal_insurance;
                if (
                    refusalInsurance &&
                    typeof refusalInsurance === 'object' &&
                    'reason' in refusalInsurance
                ) {
                    return <span>{(refusalInsurance as { reason: string }).reason || '-'}</span>;
                }
                return <span>{typeof refusalInsurance === 'string' ? refusalInsurance : '-'}</span>;
            },
            sorter: (a, b) => {
                const aRefusal =
                    a.refusal_insurance &&
                    typeof a.refusal_insurance === 'object' &&
                    'reason' in a.refusal_insurance
                        ? (a.refusal_insurance as { reason?: string }).reason || ''
                        : typeof a.refusal_insurance === 'string'
                          ? a.refusal_insurance
                          : '';
                const bRefusal =
                    b.refusal_insurance &&
                    typeof b.refusal_insurance === 'object' &&
                    'reason' in b.refusal_insurance
                        ? (b.refusal_insurance as { reason?: string }).reason || ''
                        : b.refusal_insurance || '';
                return aRefusal.localeCompare(bRefusal);
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
            sorter: (a, b) =>
                (a.contract?.effect_date || '').localeCompare(b.contract?.effect_date || '') || 0,
        },
        {
            title: t.employee.contract_expiration_date,
            dataIndex: 'contract_expiration_date',
            key: 'contract_expiration_date',
            width: 200,
            render: (_, record: EmployeeResponseType) => (
                <span>{record?.contract?.expir_date || '-'}</span>
            ),
            sorter: (a, b) =>
                (a.contract?.expir_date || '').localeCompare(b.contract?.expir_date || '') || 0,
        },
        {
            title: t.employee.old_department,
            dataIndex: 'old_department',
            key: 'old_department',
            width: 200,
            render: () => <span>-</span>,
            sorter: (a, b) => 0,
        },
        {
            title: t.employee.old_factory,
            dataIndex: 'old_factory',
            key: 'old_factory',
            width: 200,
            render: () => <span>-</span>,
            sorter: (a, b) => 0,
        },
        {
            title: t.employee.transfer_date,
            dataIndex: 'transfer_date',
            key: 'transfer_date',
            width: 200,
            render: () => <span>-</span>,
            sorter: (a, b) => 0,
        },
        {
            title: t.employee.new_department,
            dataIndex: 'new_department',
            key: 'new_department',
            width: 200,
            render: () => <span>-</span>,
            sorter: (a, b) => 0,
        },
        {
            title: t.employee.new_factory,
            dataIndex: 'new_factory',
            key: 'new_factory',
            width: 200,
            render: () => <span>-</span>,
            sorter: (a, b) => 0,
        },
        {
            title: t.employee.date_of_resignation,
            dataIndex: 'date_of_resignation',
            key: 'date_of_resignation',
            width: 200,
            render: () => <span>-</span>,
            sorter: (a, b) => 0,
        },
        {
            title: t.employee.reason_of_resignation,
            dataIndex: 'reason_of_resignation',
            key: 'reason_of_resignation',
            width: 200,
            render: () => <span>-</span>,
            sorter: (a, b) => 0,
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
                            <Button
                                icon={<EyeFilled className="!text-green-700" />}
                                onClick={() => {
                                    setSelectedKey('profile');
                                    setSelectedRecord(record);
                                }}
                            >
                                {t.employee.view}
                            </Button>
                            <Button
                                icon={<EditOutlined className="!text-blue-500" />}
                                onClick={() => {
                                    setSelectedKey('modify_profile');
                                    setSelectedRecord(record);
                                }}
                            >
                                {t.employee.edit}
                            </Button>
                            {/* <Button icon={<DeleteOutlined className="!text-red-500" />}>
                                {t.employee.delete}
                            </Button> */}
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
