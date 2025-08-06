'use client';
import { useFormTypeList } from '@/apis/useSwr/formTypeList';
import { IsoForm } from '@/types/response/isoForm';
import { getInfomation } from '@/utils/functions/getInfomation';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks';
import { DatePicker, Input, Modal, Select, Spin, Tabs } from 'antd';
import { ClipboardCheck, ClipboardList, PenBox } from 'lucide-react';
import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { GenericTable } from '@/components/common/GenericTable';
import { RecordFormResponse } from '@/types/response/recordForm';
import { useFromRecord } from '@/apis/useSwr/formRecord';
import dayjs, { Dayjs } from 'dayjs';
import { useRecordFormCols } from '@/utils/constants/cols/formRecordCols';
import { useHasRoles } from '@/utils/hooks/useHasPermission';
const { RangePicker } = DatePicker;

function RequestForm() {
    const { t, lang } = useTranslationCustom();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<string>('Vietnam');
    const [selectedIsoForm, setSelectedIsoForm] = useState<IsoForm | null>(null);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedFormType, setSelectedFormType] = useState<number>();
    const [selectedTab, setSelectedTab] = useState<string>('1');
    const [, setKey] = useState<string>('');
    const myInfo = getInfomation();
    const hasFormManagerPermission = useHasRoles('form_manager');

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

    const [rangeDate, setRangeDate] = useState<{ start_date: Dayjs; end_date: Dayjs }>({
        start_date: dayjs(),
        end_date: dayjs(),
    });

    const onChangeDate = (date: [Dayjs | null, Dayjs | null] | null) => {
        if (date && date[0] && date[1]) {
            setRangeDate({
                start_date: date[0],
                end_date: date[1],
            });
        }
    };

    const { formRecords, isLoading: isLoadingFormRecord } = useFromRecord(
        {
            start_date: rangeDate.start_date.format('YYYY-MM-DD'),
            end_date: rangeDate.end_date.format('YYYY-MM-DD'),
        },
        {
            locations: selectedLocations,
            search: debouncedSearch,
            status: '',
            type: selectedFormType,
        },
    );

    const recordFormCols = useRecordFormCols();
    const tabs = [
        {
            key: '1',
            label: t.iso_form.request_form,
            children: (
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
                                    {getLocalizedName(
                                        item.name_en,
                                        item.name_zh,
                                        item.name_vn,
                                        lang,
                                    )}
                                </p>
                            </button>
                        ))
                    ) : (
                        <div className="col-span-4 text-center text-gray-500">
                            {t.iso_form.no_form_display}
                        </div>
                    )}
                </div>
            ),
            icon: <ClipboardList strokeWidth={1.5} />,
        },
        ...(hasFormManagerPermission
            ? [
                  {
                      key: '2',
                      label: t.iso_form.form,
                      children: (
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
                                  showTotal: (total, range) =>
                                      `${range[0]}-${range[1]} of ${total} items`,
                                  size: 'default',
                              }}
                          />
                      ),
                      icon: <ClipboardCheck strokeWidth={1.5} />,
                  },
              ]
            : []),
    ];

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
                {selectedTab === '2' ? (
                    <div className="flex items-end gap-2">
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
                                className="w-[300px]"
                            />
                        </div>
                    </div>
                ) : null}
            </div>
            <Tabs
                defaultActiveKey="1"
                items={tabs}
                onChange={setSelectedTab}
                defaultValue={selectedTab}
            />

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
