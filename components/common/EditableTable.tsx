// EditableTable.tsx
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import type { GetRef, InputRef } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { Button, Form, Input, Popconfirm, Table } from 'antd';

type FormInstance<T> = GetRef<typeof Form<T>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditableContext = createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
    index: number;
}
const EditableRow: React.FC<EditableRowProps & React.HTMLAttributes<HTMLTableRowElement>> = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    index,
    ...props
}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps<T> {
    title: ReactNode;
    editable: boolean;
    dataIndex: keyof T;
    record: T;
    handleSave: (record: T) => void;
    children?: React.ReactNode;
}

const EditableCell = <T extends { key: React.Key }>(
    props: EditableCellProps<T> & React.HTMLAttributes<HTMLTableCellElement>,
) => {
    const { title, editable, children, dataIndex, record, handleSave, ...restProps } = props;

    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex as string}
                rules={[{ required: true, message: `${title} is required.` }]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingInlineEnd: 24 }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

// Export EditableColumn type
export type EditableColumn<T> = ColumnType<T> & {
    editable?: boolean;
    dataIndex: keyof T;
    title: ReactNode;
};

interface EditableTableProps<T extends { key: React.Key }> {
    columns: EditableColumn<T>[];
    dataSource: T[];
    onSave: (updatedRow: T) => void;
    onDelete?: (key: React.Key) => void;
    onAdd?: () => void;
    addButtonText?: string;
    removeButtonText?: string;
    titleDelete?: string;
    okText?: string;
    cancelText?: string;
}

export function EditableTable<T extends { key: React.Key }>({
    columns,
    dataSource,
    onSave,
    onDelete,
    onAdd,
    addButtonText = 'Add a row',
    removeButtonText = 'Delete',
    titleDelete = 'Sure to delete?',
    okText = 'Ok',
    cancelText = 'Cancel',
}: EditableTableProps<T>) {
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell as React.FC<EditableCellProps<T>>,
        },
    };

    const finalColumns: ColumnsType<T> = [
        ...columns.map((col) => {
            if (!col.editable) return col;
            return {
                ...col,
                onCell: (record: T) =>
                    ({
                        record,
                        editable: col.editable,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        handleSave: onSave,
                    }) as React.HTMLAttributes<HTMLTableCellElement>,
            };
        }),
        ...(onDelete
            ? [
                  {
                      title: 'Action',
                      dataIndex: 'operation',
                      width: 100,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      render: (_: any, record: T) => (
                          <Popconfirm
                              title={titleDelete}
                              onConfirm={() => onDelete(record.key)}
                              okText={okText}
                              cancelText={cancelText}
                          >
                              <a>{removeButtonText}</a>
                          </Popconfirm>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <div>
            {onAdd && (
                <Button onClick={onAdd} type="primary" style={{ marginBottom: 16 }}>
                    {addButtonText}
                </Button>
            )}
            <Table<T>
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={finalColumns}
            />
        </div>
    );
}
