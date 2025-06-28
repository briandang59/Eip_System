import { TableColumnsType } from 'antd';

export interface DataType {
    key: React.Key;
    stt: number;
    cardNumber: string;
    fullName: string;
    unit: string;
    shift: string;
    date: string;
    week: string;
    t1: string;
    t2: string;
    log: string;
    abnormal: string;
    GC: string;
    NLE: string;
    _150: string;
    _200: string;
    _300: string;
    _390: string;
    _400: string;
    A: string;
    KP: string;
    B: string;
    C: string;
    D: string;
    DT: string;
    VS: string;
    GDem: string;
    G200: string;
    Tcom: string;
    CTMTCN: string;
    VPSX: string;
    PNTrua: string;
    PNTca: string;
}

export const workdayCols: TableColumnsType<DataType> = [
    {
        title: 'Stt',
        width: 60,
        dataIndex: 'stt',
        key: 'stt',
        fixed: 'left',
    },
    {
        title: 'Card number',
        width: 150,
        dataIndex: 'cardNumber',
        key: 'cardNumber',
        fixed: 'left',
    },
    {
        title: 'Full name',
        dataIndex: 'fullName',
        key: 'fullName',
        width: 150,
        fixed: 'left',
    },
    {
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
        width: 150,
        fixed: 'left',
    },
    {
        title: 'Shift',
        dataIndex: 'shift',
        key: 'shift',
        width: 150,
        fixed: 'left',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        width: 150,
    },
    {
        title: 'Week',
        dataIndex: 'week',
        key: 'week',
        width: 150,
    },
    {
        title: 'T1',
        dataIndex: 't1',
        key: 't1',
        width: 150,
    },
    {
        title: 'T2',
        dataIndex: 't2',
        key: 't2',
        width: 150,
    },
    { title: 'Log', dataIndex: 'log', key: 'log', width: 150 },
    {
        title: 'Abnormal',
        dataIndex: 'abnorma',
        key: 'abnorma',
        width: 150,
    },
    { title: 'GC', dataIndex: 'GC', key: 'GC', width: 100 },
    { title: 'NLE', dataIndex: 'NLE', key: 'NLE', width: 100 },
    { title: '150', dataIndex: '150', key: '150', width: 100 },
    { title: '200', dataIndex: '200', key: '200', width: 100 },
    { title: '300', dataIndex: '300', key: '300', width: 100 },
    { title: '390', dataIndex: '390', key: '390', width: 100 },
    { title: '400', dataIndex: '400', key: '400', width: 100 },
    { title: 'A', dataIndex: 'A', key: 'A', width: 100 },
    { title: 'KP', dataIndex: 'KP', key: 'KP', width: 100 },
    { title: 'B', dataIndex: 'B', key: 'B', width: 100 },
    { title: 'C', dataIndex: 'C', key: 'C', width: 100 },
    { title: 'D', dataIndex: 'D', key: 'D', width: 100 },
    { title: 'DT', dataIndex: 'DT', key: 'DT', width: 100 },
    { title: 'VS', dataIndex: 'VS', key: 'VS', width: 100 },
    { title: 'GDem', dataIndex: 'GDem', key: 'GDem', width: 100 },
    { title: 'G200', dataIndex: 'G200', key: 'G200', width: 100 },
    { title: 'Tcom', dataIndex: 'Tcom', key: 'Tcom', width: 100 },
    { title: 'CTMTCN', dataIndex: 'CTMTCN', key: 'CTMTCN', width: 100 },
    { title: 'VPSX', dataIndex: 'VPSX', key: 'VPSX', width: 100 },
    { title: 'PNTrua', dataIndex: 'PNTrua', key: 'PNTrua', width: 100 },
    { title: 'PNTca', dataIndex: 'PNTca', key: 'PNTca', width: 100 },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => {
            return <a href="#">Action</a>;
        },
    },
];
