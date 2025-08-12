'use client';
import { useFromRecord } from '@/apis/useSwr/formRecord';
import { useFormTypeList } from '@/apis/useSwr/formTypeList';
import { GenericTable } from '@/components/common/GenericTable';
import { IsoForm } from '@/types/response/isoForm';
import { RecordFormResponse } from '@/types/response/recordForm';
import { useRecordFormCols } from '@/utils/constants/cols/formRecordCols';
import { getInfomation } from '@/utils/functions/getInfomation';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks';
import { DatePicker, Input, Modal, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
const { RangePicker } = DatePicker;

function Form() {
    const { t, lang } = useTranslationCustom();
    const [selectedFormType, setSelectedFormType] = useState<number>();
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedLocations, setSelectedLocations] = useState<string>('Vietnam');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedIsoForm, setSelectedIsoForm] = useState<RecordFormResponse | null>(null);
    const [selectedTypeForm, setSelectedTypeForm] = useState<IsoForm | null>(null);
    const [key, setKey] = useState<string | null>(null);
    const myInfo = getInfomation();
    const [url, setUrl] = useState<string>('');
    // Debounce search

    const locations = [
        { label: t.iso_form.vn, value: 'Vietnam' },
        { label: t.iso_form.zh, value: 'Taiwan' },
    ];

    const statusOptions = [
        { label: t.iso_form.all, value: '' },
        { label: t.iso_form.pending, value: 'in progress' },
        { label: t.iso_form.approved, value: 'approved' },
        { label: t.iso_form.rejected, value: 'rejected' },
    ];

    useEffect(() => {
        const handler = debounce(() => {
            setDebouncedSearch(searchText.trim());
        }, 400);
        handler();
        return () => handler.cancel();
    }, [searchText]);

    // Cập nhật URL khi selectedTypeForm thay đổi
    useEffect(() => {
        if (selectedIsoForm && selectedTypeForm && key) {
            setUrl(generateUrl(selectedIsoForm, key));
        }
    }, [selectedTypeForm, selectedIsoForm, key, selectedLocations]);

    const [rangeDate, setRangeDate] = useState<{ start_date: Dayjs; end_date: Dayjs }>({
        start_date: dayjs().month(0).date(1),
        end_date: dayjs().month(11).date(31),
    });
    const { formRecords, isLoading: isLoadingFormRecord } = useFromRecord(
        {
            start_date: rangeDate.start_date.format('YYYY-MM-DD'),
            end_date: rangeDate.end_date.format('YYYY-MM-DD'),
        },
        {
            locations: selectedLocations,
            search: debouncedSearch,
            status: selectedStatus,
            type: selectedFormType,
        },
    );
    const { fromTypeList, isLoading: isLoadingFormTypeList } = useFormTypeList({
        locations: selectedLocations,
        search: debouncedSearch,
    });

    const onChangeDate = (date: [Dayjs | null, Dayjs | null] | null) => {
        if (date && date[0] && date[1]) {
            setRangeDate({
                start_date: date[0],
                end_date: date[1],
            });
        }
    };

    const handleCloseModal = () => {
        setIsOpenModal(false);
        setSelectedIsoForm(null);
        setKey(null);
    };

    const handleOpenModal = (form: RecordFormResponse, key?: string) => {
        setIsOpenModal(true);
        setSelectedIsoForm(form);
        const exists = fromTypeList.find((item) => item.id === form.type_id);
        setSelectedTypeForm(exists || null);
        setKey(key || null);

        if (exists) {
            setUrl(generateUrl(form, key, exists));
        }
    };

    const generateUrl = (form: RecordFormResponse, key?: string, typeForm?: IsoForm) => {
        const targetTypeForm = typeForm || selectedTypeForm;

        if (!targetTypeForm) return '';

        switch (key) {
            case 'view':
                return `http://10.2.1.159:8085/form/${selectedLocations}/${targetTypeForm?.tag}?id=${form?._id}`;
            case 'modify':
                return `http://10.2.1.159:8085/form/${selectedLocations}/${targetTypeForm?.tag}?id=${form?._id}&isEdit=true`;
            default:
                return `http://10.2.1.159:8085/form/${selectedLocations}/${targetTypeForm?.tag}?employee_uuid=${myInfo?.uuid}&isEdit=true&uuid=${form._id}`;
        }
    };

    const recordFormCols = useRecordFormCols({
        openModal: handleOpenModal,
    });

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
                <div className="flex flex-col gap-2">
                    <span className="font-medium">{t.iso_form.status}</span>
                    <Select
                        value={selectedStatus}
                        options={statusOptions}
                        onChange={setSelectedStatus}
                        className="w-[150px]"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-medium">{t.record_form.range_date}</span>
                    <RangePicker
                        value={[rangeDate.start_date, rangeDate.end_date]}
                        onChange={onChangeDate}
                        format="YYYY-MM-DD"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-medium">{t.record_form.form}</span>
                    <Select
                        value={selectedFormType}
                        options={fromTypeList.map((item) => ({
                            label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                            value: item.id,
                        }))}
                        onChange={setSelectedFormType}
                        loading={isLoadingFormTypeList}
                        className="w-[300px]"
                        allowClear
                    />
                </div>
            </div>
            <GenericTable<RecordFormResponse>
                columns={recordFormCols}
                dataSource={formRecords || []}
                rowKey="_id"
                isLoading={isLoadingFormRecord}
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
                open={isOpenModal}
                onCancel={handleCloseModal}
                footer={null}
                centered
                width={1200}
            >
                {selectedIsoForm && selectedTypeForm && (
                    <iframe src={url} width="100%" height="700" className="border-none" />
                )}
            </Modal>
        </div>
    );
}

export default Form;
