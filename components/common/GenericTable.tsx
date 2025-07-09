import React, { JSX } from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { createStyles } from 'antd-style';

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

/**
 * Generic props:
 *   - T là bất kỳ interface/tipe hàng dữ liệu nào (User, Product, ...).
 */
export interface GenericTableProps<T extends object> {
    /** Cột hiển thị – buộc TableColumnsType khớp với T */
    columns: TableColumnsType<T>;
    /** Dữ liệu – mỗi phần tử đúng kiểu T */
    dataSource: T[];
    /** Cách lấy key duy nhất, nên truyền `rowKey` cho antd */
    rowKey: string | keyof T | ((record: T) => string);
    /** Các props gốc khác của antd Table nếu cần */
    scroll?: Parameters<typeof Table>[0]['scroll'];
    isLoading?: boolean;
    /** Summary/footer row for totals */
    summary?: (pageData: readonly T[]) => React.ReactNode;
    /** Pagination configuration */
    pagination?: TableProps<T>['pagination'];
    virtual?: boolean;
}

export function GenericTable<T extends object>({
    columns,
    dataSource,
    rowKey,
    scroll = { x: 'max-content', y: 110 * 5 },
    isLoading = false,
    summary,
    pagination,
    virtual = false,
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
        />
    );
}
