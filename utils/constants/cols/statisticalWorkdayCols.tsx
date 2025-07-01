import { TableColumnsType } from 'antd';
import { useChangeLanguage } from '@/utils/hooks/useChangeLanguage';

import { AttendanceV2Type } from '@/types/response/attendance';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

const UnitCell = ({ unit }: { unit: AttendanceV2Type['unit'] }) => {
    const unitName = useChangeLanguage(unit.name_en, unit.name_zh, unit.name_vn);
    return <div>{unitName}</div>;
};

export const useStatisticalWorkdayCols = (): TableColumnsType<AttendanceV2Type> => {
    const { t } = useTranslationCustom();
    return [
        {
            title: 'Stt',
            width: 100,
            dataIndex: 'stt',
            key: 'stt',
            fixed: 'left',
            render: (_, _record, index) => {
                return <div className="text-nowrap">{index + 1}</div>;
            },
        },
        {
            title: t.workday.card_number,
            width: 120,
            dataIndex: 'card_number',
            key: 'card_number',
            fixed: 'left',
        },
        {
            title: t.workday.fullname,
            dataIndex: 'fullname',
            key: 'fullname',
            width: 150,
            fixed: 'left',
        },
        {
            title: t.workday.unit,
            dataIndex: 'unit',
            key: 'unit',
            width: 100,
            fixed: 'left',
        },

        {
            title: 'GC',
            dataIndex: 'GC',
            key: 'GC',
            width: 50,
        },
        {
            title: 'NLE',
            dataIndex: 'NLE',
            key: 'NLE',
            width: 50,
        },
        {
            title: '150',
            dataIndex: '150',
            key: '150',
            width: 50,
        },
        {
            title: '200',
            dataIndex: '200',
            key: '200',
            width: 50,
        },
        {
            title: '300',
            dataIndex: '300',
            key: '300',
            width: 50,
        },
        {
            title: '390',
            dataIndex: '390',
            key: '390',
            width: 50,
        },
        {
            title: '400',
            dataIndex: '400',
            key: '400',
            width: 50,
        },
        {
            title: 'A',
            dataIndex: 'A',
            key: 'A',
            width: 50,
        },
        {
            title: 'KP',
            dataIndex: 'KP',
            key: 'KP',
            width: 50,
        },
        {
            title: 'B',
            dataIndex: 'B',
            key: 'B',
            width: 50,
        },

        {
            title: 'C',
            dataIndex: 'C',
            key: 'C',
            width: 50,
        },
        {
            title: 'D',
            dataIndex: 'D',
            key: 'D',
            width: 50,
        },
        {
            title: 'CV',
            dataIndex: 'CV',
            key: 'CV',
            width: 50,
        },
        {
            title: 'DT',
            dataIndex: 'DT',
            key: 'DT',
            width: 50,
        },
        {
            title: 'VS',
            dataIndex: 'VS',
            key: 'VS',
            width: 50,
        },
        {
            title: 'G200',
            dataIndex: 'G200',
            key: 'G200',
            width: 60,
        },
        {
            title: 'G210',
            dataIndex: 'G210',
            key: 'G210',
            width: 60,
        },
        {
            title: 'Gdem',
            dataIndex: 'Gdem',
            key: 'Gdem',
            width: 60,
        },
        {
            title: 'CCAN',
            dataIndex: 'CCAN',
            key: 'CCAN',
            width: 60,
        },
        {
            title: 'Tcom',
            dataIndex: 'Tcom',
            key: 'Tcom',
            width: 70,
        },
        {
            title: 'MonthH',
            dataIndex: 'Month',
            key: 'Month',
            width: 80,
        },
        {
            title: 'H chuẩn',
            dataIndex: 'H chuẩn',
            key: 'H chuẩn',
            width: 60,
        },
        {
            title: 'SGC',
            dataIndex: 'SG',
            key: 'SG',
            width: 60,
        },
        {
            title: 'AllH',
            dataIndex: 'AllH',
            key: 'AllH',
            width: 60,
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
    ];
};
