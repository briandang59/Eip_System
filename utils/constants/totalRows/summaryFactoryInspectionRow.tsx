import { Table } from 'antd';
import { formatNumber } from '@/utils/functions/formatNumber';
import { FactoryInspectionAttendance } from '@/types/response/factoryInspectionAttendance';
import { calculateTotalsFactoryInspection } from '@/utils/functions/calculateTotalsFactoryInspection';

export const summaryFactoryInspectionRow = (
    pageData: readonly FactoryInspectionAttendance[],
    t: any,
) => {
    const currentTotals = calculateTotalsFactoryInspection(
        pageData as FactoryInspectionAttendance[],
    );

    return (
        <Table.Summary fixed>
            <Table.Summary.Row style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                {/* Stt */}
                <Table.Summary.Cell index={0} align="center">
                    <div className="font-bold text-blue-600">{t.workday.total}</div>
                </Table.Summary.Cell>
                {/* card_number, fullname, unit, shift, date, week, T1, T2 */}
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={4}></Table.Summary.Cell>
                <Table.Summary.Cell index={5}></Table.Summary.Cell>
                <Table.Summary.Cell index={6}></Table.Summary.Cell>
                <Table.Summary.Cell index={7}></Table.Summary.Cell>
                <Table.Summary.Cell index={8}></Table.Summary.Cell>

                {/* GC */}
                <Table.Summary.Cell index={9} align="center">
                    {currentTotals.GC > 0 ? currentTotals.GC : '-'}
                </Table.Summary.Cell>
                {/* NLE */}
                <Table.Summary.Cell index={10} align="center">
                    {currentTotals.nle > 0 ? currentTotals.nle : '-'}
                </Table.Summary.Cell>
                {/* 150 */}
                <Table.Summary.Cell index={11} align="center">
                    {currentTotals.c150 > 0 ? currentTotals.c150 : '-'}
                </Table.Summary.Cell>
                {/* 200 */}
                <Table.Summary.Cell index={12} align="center">
                    {currentTotals.c200 > 0 ? currentTotals.c200 : '-'}
                </Table.Summary.Cell>
                {/* 300 */}
                <Table.Summary.Cell index={13} align="center">
                    {currentTotals.c300 > 0 ? currentTotals.c300 : '-'}
                </Table.Summary.Cell>
                {/* 390 */}
                <Table.Summary.Cell index={14} align="center">
                    {currentTotals.c390 > 0 ? currentTotals.c390 : '-'}
                </Table.Summary.Cell>
                {/* 400 */}
                <Table.Summary.Cell index={15} align="center">
                    {currentTotals.c400 > 0 ? currentTotals.c400 : '-'}
                </Table.Summary.Cell>
                {/* A */}
                <Table.Summary.Cell index={16} align="center">
                    {currentTotals.A > 0 ? currentTotals.A : '-'}
                </Table.Summary.Cell>
                {/* KP */}
                <Table.Summary.Cell index={17} align="center">
                    {currentTotals.KP > 0 ? currentTotals.KP : '-'}
                </Table.Summary.Cell>
                {/* B */}
                <Table.Summary.Cell index={18} align="center">
                    {currentTotals.B > 0 ? currentTotals.B : '-'}
                </Table.Summary.Cell>
                {/* C */}
                <Table.Summary.Cell index={19} align="center">
                    {currentTotals.C > 0 ? currentTotals.C : '-'}
                </Table.Summary.Cell>
                {/* DB */}
                <Table.Summary.Cell index={20} align="center">
                    {currentTotals.DB > 0 ? currentTotals.DB : '-'}
                </Table.Summary.Cell>
                {/* CV */}
                <Table.Summary.Cell index={21} align="center">
                    {currentTotals.CV > 0 ? currentTotals.CV : '-'}
                </Table.Summary.Cell>
                {/* DT */}
                <Table.Summary.Cell index={22} align="center">
                    {currentTotals.DT > 0 ? currentTotals.DT : '-'}
                </Table.Summary.Cell>
                {/* VS */}
                <Table.Summary.Cell index={23} align="center">
                    {currentTotals.VS > 0 ? currentTotals.VS : '-'}
                </Table.Summary.Cell>
                {/* GDem */}
                <Table.Summary.Cell index={24} align="center">
                    {currentTotals.GDem > 0 ? currentTotals.GDem : '-'}
                </Table.Summary.Cell>
                {/* G200 */}
                <Table.Summary.Cell index={25} align="center">
                    {currentTotals.G200 > 0 ? currentTotals.G200 : '-'}
                </Table.Summary.Cell>
                {/* G210 */}
                <Table.Summary.Cell index={26} align="center">
                    {currentTotals.G210 > 0 ? currentTotals.G210 : '-'}
                </Table.Summary.Cell>
                {/* Tcom */}
                <Table.Summary.Cell index={27} align="center">
                    {currentTotals.Tcom > 0 ? formatNumber(currentTotals.Tcom) : '-'}
                </Table.Summary.Cell>

                {/* CTMTCN, VPSX, PNTrua, PNTca */}
                <Table.Summary.Cell index={28}></Table.Summary.Cell>
                <Table.Summary.Cell index={29}></Table.Summary.Cell>
                <Table.Summary.Cell index={30}></Table.Summary.Cell>
                <Table.Summary.Cell index={31}></Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    );
};
