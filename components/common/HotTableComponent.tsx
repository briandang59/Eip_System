'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { HotTable, HotTableClass } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import 'handsontable/styles/ht-theme-main.css';
import { registerAllModules } from 'handsontable/registry';
registerAllModules();

export interface HotTableRef {
    getTableData: () => string[][]; // Phương thức để lấy dữ liệu
}

interface HotTableComponentProps {
    data: string[][];
    colHeaders?: string[];
    columns?: { type: string }[];
    width?: string | number;
    height?: string | number;
}

// Sử dụng forwardRef để truyền ref
const HotTableComponent = forwardRef<HotTableRef, HotTableComponentProps>(
    (
        {
            data,
            colHeaders = ['Cột 1', 'Cột 2', 'Cột 3'],
            columns = [{ type: 'text' }, { type: 'numeric' }, { type: 'text' }],
            width = '100%',
            height = 'auto',
        },
        ref,
    ) => {
        const hotRef = useRef<HotTableClass>(null);

        useImperativeHandle(ref, () => ({
            getTableData: () => {
                const hotInstance = hotRef.current?.hotInstance;
                if (!hotInstance) return [];
                return hotInstance.getData();
            },
        }));

        return (
            <HotTable
                ref={hotRef}
                data={data}
                colHeaders={colHeaders}
                columns={columns}
                width={width}
                height={height}
                rowHeights={30}
                stretchH="none"
                autoRowSize={true}
                licenseKey="non-commercial-and-evaluation"
                rowHeaders={true}
                contextMenu={['copy', 'cut']}
                autoWrapRow={true}
                autoWrapCol={true}
                themeName="ht-theme-main"
                beforeKeyDown={(event: KeyboardEvent) => {
                    const hot = hotRef.current?.hotInstance;
                    if (!hot) return;

                    if (event.key === 'Enter') {
                        const selected = hot.getSelectedLast();
                        if (!selected) return;

                        const [row, col] = selected;

                        if (col === hot.countCols() - 1) {
                            event.preventDefault();

                            const nextRow = row + 1;
                            if (nextRow >= hot.countRows()) {
                                hot.alter('insert_row_below', nextRow, 1);
                            }

                            hot.selectCell(nextRow, 0);
                            hot.scrollViewportTo(nextRow, 0);
                        }
                    }
                }}
            />
        );
    },
);

HotTableComponent.displayName = 'HotTableComponent';

export default HotTableComponent;
