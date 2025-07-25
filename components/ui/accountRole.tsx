import { PlusOutlined, ReloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import { useMemo, useState } from 'react';
import { GenericTable } from '../common/GenericTable';

import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';

import { useAccountRoleIT } from '@/apis/useSwr/accountRoleIT';
import { AccountRoleITResponse } from '@/types/response/accountRole';
import { useAccountRoleCols } from '@/utils/constants/cols/accountRoleCols';
import AcountRoleUI from '../forms/AccountRoleUI';

function AccountRoles() {
    const [search, setSearch] = useState<string>('');
    const { accountRoles, isLoading: isLoadingPermission, mutate } = useAccountRoleIT({ search });
    const [selectedCardNumber, setSelectedCardNumber] = useState<string>('');
    const { t } = useTranslationCustom();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [key, setKey] = useState<string>('');

    const selectedAccountRole = useMemo(
        () =>
            accountRoles?.filter((item) => item.employee.card_number === selectedCardNumber) ?? [],
        [accountRoles, selectedCardNumber],
    );
    const toggleModal = (key: string, cardNumber?: string) => {
        if (cardNumber) setSelectedCardNumber(cardNumber);
        setKey(key);
        setIsOpenModal((prev) => !prev);
    };
    const cols = useAccountRoleCols({ toggleModal });
    const { exportBasic } = useExportToExcel(cols, 'AccountRoles', 'AccountRoles');
    const handleExportExcel = () => {
        if (!accountRoles || accountRoles.length === 0) return;
        exportBasic(accountRoles);
    };

    function renderUI() {
        switch (key) {
            case 'account_role':
                return (
                    <div className="min-h-[500px]">
                        <AcountRoleUI
                            accountRoles={selectedAccountRole}
                            mutate={mutate}
                            toggleModal={toggleModal}
                        />
                    </div>
                );
        }
    }

    return (
        <div>
            <div className="flex items-end gap-2 mb-4">
                <Button icon={<PlusOutlined />}>{t.role_and_permission.add}</Button>
                <Button icon={<ReloadOutlined />}>{t.role_and_permission.refresh}</Button>
                <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
                    {t.role_and_permission.refresh}
                </Button>
                <div className="w-[200px]">
                    <Input.Search
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />
                </div>
            </div>
            <GenericTable<AccountRoleITResponse>
                columns={cols}
                dataSource={accountRoles || []}
                rowKey="id"
                isLoading={isLoadingPermission}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: 'default',
                }}
            />
            <Modal
                centered
                width={1000}
                footer={null}
                title=""
                open={isOpenModal}
                onCancel={() => toggleModal(key)}
            >
                {renderUI()}
            </Modal>
        </div>
    );
}

export default AccountRoles;
