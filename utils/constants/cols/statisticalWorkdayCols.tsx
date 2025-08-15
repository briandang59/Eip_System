import { TableColumnsType } from 'antd';
import { useChangeLanguage } from '@/utils/hooks/useChangeLanguage';

import { StatisticalWorkdayType } from '@/types/response/attendance';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { formatNumber } from '@/utils/functions/formatNumber';

const UnitCell = ({ unit }: { unit: StatisticalWorkdayType['unit'] }) => {
    const unitName = useChangeLanguage(
        unit?.name_en || '',
        unit?.name_zh || '',
        unit?.name_vn || '',
    );
    return <div>{unitName || '-'}</div>;
};

export const useStatisticalWorkdayCols = (): TableColumnsType<StatisticalWorkdayType> => {
    const { t } = useTranslationCustom();
    return [
        {
            title: 'Stt',
            width: 50,
            dataIndex: 'stt',
            key: 'stt',
            fixed: 'left',
            render: (_, _record, index) => {
                return <div className="text-nowrap">{index + 1}</div>;
            },
        },
        {
            title: t.workday.card_number,
            width: 100,
            dataIndex: 'card_number',
            key: 'card_number',
            fixed: 'left',
            sorter: (a, b) => a.card_number.localeCompare(b.card_number),
        },
        {
            title: t.workday.fullname,
            dataIndex: 'fullname',
            key: 'fullname',
            width: 170,
            fixed: 'left',
            sorter: (a, b) => a.fullname.localeCompare(b.fullname),
        },
        {
            title: t.workday.unit,
            dataIndex: 'unit',
            key: 'unit',
            width: 120,
            fixed: 'left',
            render: (_, record) => {
                return <UnitCell unit={record.unit} />;
            },
            sorter: (a, b) => (a.unit.name_en || '').localeCompare(b.unit.name_en || ''),
        },

        {
            title: 'GC',
            dataIndex: 'total_GC',
            key: 'total_GC',
            width: 50,
            render: (_, record) => {
                return (
                    <div className="text-purple-500 font-medium">
                        {record.total_GC > 0 ? record.total_GC : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_GC - b.total_GC,
        },
        {
            title: 'NLE',
            dataIndex: 'total_NLE',
            key: 'total_NLE',
            width: 50,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_NLE > 0 ? record.total_NLE : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_NLE - b.total_NLE,
        },
        {
            title: '150',
            dataIndex: 'total_150',
            key: 'total_150',
            width: 100,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_150 > 0 ? record.total_150 : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_150 - b.total_150,
        },
        {
            title: '200',
            dataIndex: 'total_200',
            key: 'total_200',
            width: 50,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_200 > 0 ? record.total_200 : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_200 - b.total_200,
        },
        {
            title: '300',
            dataIndex: 'total_300',
            key: 'total_300',
            width: 50,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_300 > 0 ? record.total_300 : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_300 - b.total_300,
        },
        {
            title: '390',
            dataIndex: 'total_390',
            key: 'total_390',
            width: 50,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_390 > 0 ? record.total_390 : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_390 - b.total_390,
        },
        {
            title: '400',
            dataIndex: 'total_400',
            key: 'total_400',
            width: 50,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_400 > 0 ? record.total_400 : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_400 - b.total_400,
        },
        {
            title: 'A',
            dataIndex: 'total_A',
            key: 'total_A',
            width: 50,
            render: (_, record) => {
                return (
                    <div className="text-red-700 font-medium">
                        {record.total_A > 0 ? record.total_A : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_A - b.total_A,
        },
        {
            title: 'KP',
            dataIndex: 'total_KP',
            key: 'total_KP',
            width: 50,
            render: (_, record) => {
                return (
                    <div className="text-red-700 font-medium">
                        {record.total_KP > 0 ? record.total_KP : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_KP - b.total_KP,
        },
        {
            title: 'B',
            dataIndex: 'total_B',
            key: 'total_B',
            width: 50,
            render: (_, record) => {
                return (
                    <div className="text-blue-700 font-medium">
                        {record.total_B > 0 ? record.total_B : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_B - b.total_B,
        },

        {
            title: 'C',
            dataIndex: 'total_C',
            key: 'total_C',
            width: 50,
            render: (_, record) => {
                return (
                    <div className="text-red-700 font-medium">
                        {record.total_C > 0 ? record.total_C : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_C - b.total_C,
        },
        {
            title: 'DB',
            dataIndex: 'total_DB',
            key: 'total_DB',
            width: 50,
            render: (_, record) => {
                return <div>{record.total_DB > 0 ? record.total_DB : '-'}</div>;
            },
            sorter: (a, b) => a.total_DB - b.total_DB,
        },
        {
            title: 'CV',
            dataIndex: 'total_CV',
            key: 'total_CV',
            width: 50,
            render: (_, record) => {
                return <div>{record.total_CV > 0 ? record.total_CV : '-'}</div>;
            },
            sorter: (a, b) => a.total_CV - b.total_CV,
        },
        {
            title: 'DT',
            dataIndex: 'total_DT',
            key: 'total_DT',
            width: 100,
            render: (_, record) => {
                return <div>{record.total_DT > 0 ? formatNumber(record.total_DT) : '-'}</div>;
            },
            sorter: (a, b) => a.total_DT - b.total_DT,
        },
        {
            title: 'VS',
            dataIndex: 'total_VS',
            key: 'total_VS',
            width: 100,
            render: (_, record) => {
                return <div>{record.total_VS > 0 ? formatNumber(record.total_VS) : '-'}</div>;
            },
            sorter: (a, b) => a.total_VS - b.total_VS,
        },
        {
            title: 'G200',
            dataIndex: 'total_G200',
            key: 'total_G200',
            width: 60,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_G200 > 0 ? record.total_G200 : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_G200 - b.total_G200,
        },
        {
            title: 'G210',
            dataIndex: 'total_G210',
            key: 'total_G210',
            width: 60,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_G210 > 0 ? record.total_G210 : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_G210 - b.total_G210,
        },
        {
            title: 'Gdem',
            dataIndex: 'total_Gdem',
            key: 'total_Gdem',
            width: 70,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_Gdem > 0 ? record.total_Gdem : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_Gdem - b.total_Gdem,
        },
        {
            title: 'CCAN',
            dataIndex: 'total_CCAN',
            key: 'total_CCAN',
            width: 100,
            render: (_, record) => {
                return (
                    <div>
                        {record.total_CCAN > 0 ? formatNumber(record.total_CCAN.toFixed(0)) : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_CCAN - b.total_CCAN,
        },
        {
            title: 'Tcom',
            dataIndex: 'total_Tcom',
            key: 'total_Tcom',
            width: 100,
            render: (_, record) => {
                return <div>{record.total_Tcom > 0 ? formatNumber(record.total_Tcom) : '-'}</div>;
            },
            sorter: (a, b) => a.total_Tcom - b.total_Tcom,
        },
        {
            title: 'MonthH',
            dataIndex: 'total_MonthH',
            key: 'total_MonthH',
            width: 80,
            render: (_, record) => {
                return <div>{record.total_MonthH > 0 ? record.total_MonthH : '-'}</div>;
            },
            sorter: (a, b) => a.total_MonthH - b.total_MonthH,
        },
        {
            title: 'H chuẩn',
            dataIndex: 'total_HChuan',
            key: 'total_HChuan',
            width: 100,
            render: (_, record) => {
                return <div>{record.total_HChuan > 0 ? record.total_HChuan : '-'}</div>;
            },
            sorter: (a, b) => a.total_HChuan - b.total_HChuan,
        },
        {
            title: 'SGC',
            dataIndex: 'total_SGC',
            key: 'total_SGC',
            width: 60,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_SGC > 0 ? record.total_SGC : '-'}
                    </div>
                );
            },
            sorter: (a, b) => a.total_SGC - b.total_SGC,
        },
        {
            title: 'AllH',
            dataIndex: 'total_AllH',
            key: 'total_AllH',
            width: 60,
            render: (_, record) => {
                return <div>{record.total_AllH > 0 ? record.total_AllH : '-'}</div>;
            },
            sorter: (a, b) => a.total_AllH - b.total_AllH,
        },
        {
            title: 'KG KToan',
            dataIndex: 'KG KToan',
            key: 'KG KToan',
            width: 70,
            render: (_, _record) => {
                return <div>{'-'}</div>;
            },
        },
        {
            title: 'XL',
            dataIndex: 'XL',
            key: 'XL',
            width: 70,
            render: (_, _record) => {
                return <div>{'-'}</div>;
            },
        },
        {
            title: 'PcNu',
            dataIndex: 'PcNu',
            key: 'PcNu',
            width: 70,
            render: (_, _record) => {
                return <div>{'-'}</div>;
            },
        },
        {
            title: 'Date In',
            dataIndex: 'Date In',
            key: 'Date In',
            width: 70,
            render: (_, _record) => {
                return <div>{'-'}</div>;
            },
        },
        {
            title: 'Date HD',
            dataIndex: 'Date HD',
            key: 'Date HD',
            width: 70,
            render: (_, _record) => {
                return <div>{'-'}</div>;
            },
        },
        {
            title: 'Date Out',
            dataIndex: 'Date Out',
            key: 'Date Out',
            width: 70,
            render: (_, _record) => {
                return <div>{'-'}</div>;
            },
        },
        {
            title: 'DL NV',
            dataIndex: 'DL NV',
            key: 'DL NV',
            width: 70,
            render: (_, _record) => {
                return <div>{'-'}</div>;
            },
        },
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
            width: 100,
        },
    ];
};
