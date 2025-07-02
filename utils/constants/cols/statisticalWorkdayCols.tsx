import { TableColumnsType } from 'antd';
import { useChangeLanguage } from '@/utils/hooks/useChangeLanguage';

import { StatisticalWorkdayType } from '@/types/response/attendance';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { formatNumber } from '@/utils/functions/formatNumber';

const UnitCell = ({ unit }: { unit: StatisticalWorkdayType['unit'] }) => {
    const unitName = useChangeLanguage(unit.name_en, unit.name_zh, unit.name_vn);
    return <div>{unitName}</div>;
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
        },
        {
            title: t.workday.fullname,
            dataIndex: 'fullname',
            key: 'fullname',
            width: 170,
            fixed: 'left',
        },
        {
            title: t.workday.unit,
            dataIndex: 'unit',
            key: 'unit',
            width: 60,
            fixed: 'left',
            render: (_, record) => {
                return <UnitCell unit={record.unit} />;
            },
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
        },
        {
            title: '150',
            dataIndex: 'total_150',
            key: 'total_150',
            width: 50,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_150 > 0 ? record.total_150 : '-'}
                    </div>
                );
            },
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
        },
        {
            title: 'D',
            dataIndex: 'total_D',
            key: 'total_D',
            width: 50,
            render: (_, record) => {
                return <div>{record.total_D > 0 ? record.total_D : '-'}</div>;
            },
        },

        {
            title: 'DT',
            dataIndex: 'total_DT',
            key: 'total_DT',
            width: 50,
            render: (_, record) => {
                return <div>{record.total_DT > 0 ? formatNumber(record.total_DT) : '-'}</div>;
            },
        },
        {
            title: 'VS',
            dataIndex: 'total_VS',
            key: 'total_VS',
            width: 50,
            render: (_, record) => {
                return <div>{record.total_VS > 0 ? formatNumber(record.total_VS) : '-'}</div>;
            },
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
        },
        {
            title: 'Gdem',
            dataIndex: 'total_Gdem',
            key: 'total_Gdem',
            width: 60,
            render: (_, record) => {
                return (
                    <div className="text-green-700 font-medium">
                        {record.total_Gdem > 0 ? record.total_Gdem : '-'}
                    </div>
                );
            },
        },
        {
            title: 'CCAN',
            dataIndex: 'total_CCAN',
            key: 'total_CCAN',
            width: 60,
            render: (_, record) => {
                return <div>{record.total_CCAN > 0 ? record.total_CCAN : '-'}</div>;
            },
        },
        {
            title: 'Tcom',
            dataIndex: 'total_Tcom',
            key: 'total_Tcom',
            width: 70,
            render: (_, record) => {
                return <div>{record.total_Tcom > 0 ? formatNumber(record.total_Tcom) : '-'}</div>;
            },
        },
        {
            title: 'MonthH',
            dataIndex: 'total_MonthH',
            key: 'total_MonthH',
            width: 80,
            render: (_, record) => {
                return <div>{record.total_MonthH > 0 ? record.total_MonthH : '-'}</div>;
            },
        },
        {
            title: 'H chuẩn',
            dataIndex: 'total_HChuan',
            key: 'total_HChuan',
            width: 60,
            render: (_, record) => {
                return <div>{record.total_HChuan > 0 ? record.total_HChuan : '-'}</div>;
            },
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
        },
        {
            title: 'AllH',
            dataIndex: 'total_AllH',
            key: 'total_AllH',
            width: 60,
            render: (_, record) => {
                return <div>{record.total_AllH > 0 ? record.total_AllH : '-'}</div>;
            },
        },
        {
            title: 'KG KToan',
            dataIndex: 'KG KToan',
            key: 'KG KToan',
            width: 60,
        },
        {
            title: 'XL',
            dataIndex: 'XL',
            key: 'XL',
            width: 60,
        },
        {
            title: 'PcNu',
            dataIndex: 'PcNu',
            key: 'PcNu',
            width: 60,
        },
        {
            title: 'Date In',
            dataIndex: 'Date In',
            key: 'Date In',
            width: 60,
        },
        {
            title: 'Date HD',
            dataIndex: 'Date HD',
            key: 'Date HD',
            width: 60,
        },
        {
            title: 'Date Out',
            dataIndex: 'Date Out',
            key: 'Date Out',
            width: 60,
        },
        {
            title: 'DL NV',
            dataIndex: 'DL NV',
            key: 'DL NV',
            width: 60,
        },
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
            width: 100,
        },
    ];
};
