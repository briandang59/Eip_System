'use client';
import { useManageBulletinsPublic } from '@/apis/useSwr/bulletins';
import SwitchLanguages from '@/components/common/SwitchLanguages';
import LoginForm from '@/components/forms/LoginForm';
import BulletinsDetailUI from '@/components/ui/BulletinsDetailUI';
import BulletinUI from '@/components/ui/BulletinUI';
import { BulletinsResponseType } from '@/types/response/bulletins';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Modal, Spin } from 'antd';
import { Lock } from 'lucide-react';
import { useState } from 'react';

function LoginPage() {
    const { bulletinsPublic, isLoading: isLoadingBulletinPublic } = useManageBulletinsPublic();
    const { t } = useTranslationCustom();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedBulletin, setSelectedBulletin] = useState<BulletinsResponseType>();
    const handleOpenModal = () => {
        setIsOpenModal(true);
    };
    const handleCloseModal = () => {
        setIsOpenModal(false);
    };
    const handleClickBulletin = (bulletin: BulletinsResponseType) => {
        setSelectedBulletin(bulletin);
        handleOpenModal();
    };
    return (
        <div className="grid grid-cols-[30%_70%] gap-2 h-[700px]">
            <div className="flex flex-col justify-center items-center bg-gray-100 p-2">
                <div className="flex flex-col items-center justify-center gap-4 mb-8">
                    <div className="bg-blue-300 rounded-full p-2 w-fit">
                        <Lock className="!text-blue-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[18px] font-medium">{t.login.account_login}</h3>
                    <h3 className="text-gray-500">{t.login.please_sign_in}</h3>
                </div>
                <LoginForm />
            </div>
            <div className="flex flex-col gap-2 p-2 borbder-l border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-b-gray-300">
                    <h3 className="text-[18px] font-bold">{t.login.bulletins_boards}</h3>
                    <SwitchLanguages />
                </div>
                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                    {!isLoadingBulletinPublic ? (
                        bulletinsPublic &&
                        bulletinsPublic.map((item) => (
                            <BulletinUI
                                record={item}
                                key={item.id}
                                viewType="modal"
                                setSelectedBulletin={handleClickBulletin}
                                width="w-full"
                            />
                        ))
                    ) : (
                        <Spin />
                    )}
                </div>
            </div>
            <Modal
                centered
                open={isOpenModal}
                onCancel={handleCloseModal}
                width={800}
                footer={null}
            >
                {selectedBulletin && (
                    <BulletinsDetailUI bulletinsDetail={selectedBulletin} viewType="modal" />
                )}
            </Modal>
        </div>
    );
}

export default LoginPage;
