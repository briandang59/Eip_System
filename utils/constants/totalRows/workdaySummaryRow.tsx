import { AttendanceV2Type } from '@/types/response/attendance';
import { calculateTotals } from '@/utils/functions/calculateTotalWorkday';
import { formatNumber } from '@/utils/functions/formatNumber';
import { Table } from 'antd';

export const summaryWorkdayRow = (pageData: readonly AttendanceV2Type[], t: any) => {
    const currentTotals = calculateTotals(pageData as AttendanceV2Type[]);

    return (
        <Table.Summary fixed>
            <Table.Summary.Row style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                <Table.Summary.Cell index={0} align="center">
                    <div className="font-bold text-blue-600">{t.workday.total}</div>
                </Table.Summary.Cell>
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
                    <div className="font-bold text-blue-600">
                        {currentTotals.GC > 0 ? currentTotals.GC : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* NLE */}
                <Table.Summary.Cell index={10} align="center">
                    <div className="font-bold text-blue-600">
                        {currentTotals.NLE > 0 ? currentTotals.NLE : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* 150 */}
                <Table.Summary.Cell index={11} align="center">
                    <div className="font-bold text-blue-600">
                        {currentTotals.c150 > 0 ? currentTotals.c150 : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* 200 */}
                <Table.Summary.Cell index={12} align="center">
                    <div className="font-bold text-blue-600">
                        {currentTotals.c200 > 0 ? currentTotals.c200 : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* 300 */}
                <Table.Summary.Cell index={13} align="center">
                    <div className="font-bold text-blue-600">
                        {currentTotals.c300 > 0 ? currentTotals.c300 : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* A */}
                <Table.Summary.Cell index={14} align="center">
                    <div className="font-bold text-blue-600">
                        {currentTotals.A > 0 ? currentTotals.A : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* KP */}
                <Table.Summary.Cell index={15} align="center">
                    <div className="font-bold text-blue-600">
                        {currentTotals.KP > 0 ? currentTotals.KP : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* B */}
                <Table.Summary.Cell index={16} align="center">
                    <div className="font-bold text-blue-600">
                        {currentTotals.B > 0 ? currentTotals.B : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* DT */}
                <Table.Summary.Cell index={17} align="center">
                    <div className="font-bold text-blue-600">
                        {currentTotals.DT > 0 ? currentTotals.DT : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* G200 */}
                <Table.Summary.Cell index={18} align="center">
                    <div className="font-bold text-green-600">
                        {currentTotals.G200 > 0 ? currentTotals.G200 : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* G210 */}
                <Table.Summary.Cell index={19} align="center">
                    <div className="font-bold text-blue-600">
                        {currentTotals.G210 > 0 ? currentTotals.G210 : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* Tcom */}
                <Table.Summary.Cell index={20} align="center">
                    <div className="font-bold text-blue-600">
                        {currentTotals.Tcom > 0 ? formatNumber(currentTotals.Tcom) : '-'}
                    </div>
                </Table.Summary.Cell>
                {/* CTMTCN */}
                <Table.Summary.Cell index={21}></Table.Summary.Cell>
                {/* VPSX */}
                <Table.Summary.Cell index={22}></Table.Summary.Cell>
                {/* Actions */}
                <Table.Summary.Cell index={23}></Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    );
};
