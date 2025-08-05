'use client';
import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useTranslationCustom } from '@/utils/hooks';

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
    title,
    content,
    confirmText,
    cancelText,
    loading = false,
}: ModalConfirmProps) {
    const { styles } = useStyle();
    const { t } = useTranslationCustom();

    const mergedTitle = title ?? t.common.confirm_modal.title;
    const mergedContent = content ?? t.common.confirm_modal.content;
    const mergedConfirmText = confirmText ?? t.common.confirm_modal.confirmText;
    const mergedCancelText = cancelText ?? t.common.confirm_modal.cancelText;
    return (
        <Modal
            title={
                <div style={{ fontSize: 18, fontWeight: 500, color: '#1F1F1F' }}>{mergedTitle}</div>
            }
            open={isOpen}
            onOk={confirmAndClose}
            onCancel={toggleModal}
            centered
            className={styles.modal}
            footer={[
                <Button key="cancel" onClick={toggleModal}>
                    {mergedCancelText}
                </Button>,
                <Button
                    key="confirm"
                    type="primary"
                    danger
                    onClick={confirmAndClose}
                    loading={loading}
                >
                    {mergedConfirmText}
                </Button>,
            ]}
        >
            <Space align="start">
                <ExclamationCircleOutlined className={styles.warningIcon} />
                <p style={{ margin: 0, lineHeight: '1.5' }}>{mergedContent}</p>
            </Space>
        </Modal>
    );
}

export default ModalConfirm;
