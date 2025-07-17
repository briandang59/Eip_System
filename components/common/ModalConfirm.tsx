'use client';
import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

interface ModalConfirmProps {
    isOpen: boolean;
    toggleModal: () => void;
    confirmAndClose: () => void;
    title?: string;
    content?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

const useStyle = createStyles(({ css, token }) => ({
    modal: css`
        .ant-modal-content {
            border-radius: ${token.borderRadiusLG}px;
            padding: 24px;
            box-shadow: ${token.boxShadow};
        }
        .ant-modal-header {
            border-bottom: none;
            padding-bottom: 0;
        }
        .ant-modal-body {
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: ${token.fontSizeLG}px;
            color: ${token.colorText};
        }
        .ant-modal-footer {
            border-top: none;
            padding-top: 16px;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }
    `,
    warningIcon: css`
        color: ${token.colorWarning};
        font-size: 24px;
    `,
}));

function ModalConfirm({
    isOpen,
    toggleModal,
    confirmAndClose,
    title = 'Xác nhận xoá bản ghi',
    content = 'Bạn có chắc muốn xoá bản ghi này? Hành động này không thể hoàn tác.',
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    loading = false,
}: ModalConfirmProps) {
    const { styles } = useStyle();

    return (
        <Modal
            title={<div style={{ fontSize: 18, fontWeight: 500, color: '#1F1F1F' }}>{title}</div>}
            open={isOpen}
            onOk={confirmAndClose}
            onCancel={toggleModal}
            centered
            className={styles.modal}
            footer={[
                <Button key="cancel" onClick={toggleModal}>
                    {cancelText}
                </Button>,
                <Button
                    key="confirm"
                    type="primary"
                    danger
                    onClick={confirmAndClose}
                    loading={loading}
                >
                    {confirmText}
                </Button>,
            ]}
        >
            <Space align="start">
                <ExclamationCircleOutlined className={styles.warningIcon} />
                <p style={{ margin: 0, lineHeight: '1.5' }}>{content}</p>
            </Space>
        </Modal>
    );
}

export default ModalConfirm;
