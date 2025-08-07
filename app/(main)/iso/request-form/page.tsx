'use client';
import { useFormTypeList } from '@/apis/useSwr/formTypeList';
import { IsoForm } from '@/types/response/isoForm';
import { getInfomation } from '@/utils/functions/getInfomation';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks';
import { Input, Modal, Select, Spin } from 'antd';
import { PenBox } from 'lucide-react';
import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

function RequestForm() {
    const { t, lang } = useTranslationCustom();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<string>('Vietnam');
    const [selectedIsoForm, setSelectedIsoForm] = useState<IsoForm | null>(null);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [, setKey] = useState<string>('');
    const myInfo = getInfomation();

    const { fromTypeList, isLoading: isLoadingFormTypeList } = useFormTypeList({
        locations: selectedLocations,
        search: debouncedSearch,
    });

    const handleOpenModal = (form: IsoForm, key?: string) => {
        if (key) setKey(key);
        setSelectedIsoForm(form);
        setIsOpenModal(true);
    };

    const handleCloseModal = () => {
        setKey('');
        setSelectedIsoForm(null);
        setIsOpenModal(false);
    };

    const locations = [
        { label: t.iso_form.vn, value: 'Vietnam' },
        { label: t.iso_form.zh, value: 'Taiwan' },
    ];

    // Debounce search
    useEffect(() => {
        const handler = debounce(() => {
            setDebouncedSearch(searchText.trim());
        }, 400);
        handler();
        return () => handler.cancel();
    }, [searchText]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-end gap-2">
                <div className="flex flex-col gap-2">
                    <span className="font-medium">{t.record_form.location}</span>
                    <Select
                        value={selectedLocations}
                        options={locations}
                        onChange={setSelectedLocations}
                        className="w-[150px]"
                    />
                </div>
                <div className="w-[200px]">
                    <Input.Search
                        placeholder={t.iso_form.find}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        className="w-[200px]"
                    />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
                {isLoadingFormTypeList ? (
                    <div className="col-span-4 flex justify-center items-center">
                        <Spin />
                    </div>
                ) : fromTypeList && fromTypeList.length > 0 ? (
                    fromTypeList.map((item) => (
                        <button
                            key={item.id}
                            className="p-4 rounded-[10px] border border-gray-300 bg-gray-100 min-h-[200px] flex flex-col gap-4 items-center justify-center cursor-pointer hover:translate-x-0.5 hover:scale-105 duration-300 hover:border-green-700"
                            onClick={() => handleOpenModal(item)}
                        >
                            <PenBox />
                            <p className="text-[16px] font-medium text-center">
                                {getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}
                            </p>
                        </button>
                    ))
                ) : (
                    <div className="col-span-4 text-center text-gray-500">
                        {t.iso_form.no_form_display}
                    </div>
                )}
            </div>
            <Modal
                open={isOpenModal}
                onCancel={handleCloseModal}
                footer={null}
                centered
                width={1200}
            >
                {selectedIsoForm && (
                    <iframe
                        src={`http://10.2.1.159:8085/form/${selectedLocations}/${selectedIsoForm.tag}?employee_uuid=${myInfo?.uuid}`}
                        width="100%"
                        height="700"
                        className="border-none"
                    />
                )}
            </Modal>
        </div>
    );
}

export default RequestForm;
