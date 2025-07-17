import React, { JSX } from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { createStyles } from 'antd-style';

// Define styles for the table
const useStyle = createStyles(({ css }) => ({
    customTable: css`
        .ant-table {
            .ant-table-container {
                .ant-table-body,
                .ant-table-content {
                    scrollbar-width: thin;
                    scrollbar-color: #eaeaea transparent;
                    scrollbar-gutter: stable;
                }
            }
        }
    `,
}));

// Extend the props interface to include rowSelection
export interface GenericTableProps<T extends object> {
    columns: TableColumnsType<T>;
    dataSource: T[];
    rowKey: string | keyof T | ((record: T) => string);
    scroll?: Parameters<typeof Table>[0]['scroll'];
    isLoading?: boolean;
    summary?: (pageData: readonly T[]) => React.ReactNode;
    pagination?: TableProps<T>['pagination'];
    virtual?: boolean;
    rowSelection?: TableProps<T>['rowSelection']; // Add rowSelection prop
}

// GenericTable component with row selection support
export function GenericTable<T extends object>({
    columns,
    dataSource,
    rowKey,
    scroll = { x: 'max-content', y: 110 * 5 },
    isLoading = false,
    summary,
    pagination,
    virtual = false,
    rowSelection, // Destructure the new rowSelection prop
}: GenericTableProps<T>): JSX.Element {
    const { styles } = useStyle();

    return (
        <Table<T>
            className={`${styles.customTable} primary-table`}
            columns={columns}
            dataSource={dataSource}
            rowKey={rowKey}
            scroll={scroll}
            bordered
            virtual={virtual}
            loading={isLoading}
            summary={summary}
            pagination={pagination}
            rowSelection={rowSelection} // Pass rowSelection to Ant Design Table
        />
    );
}
