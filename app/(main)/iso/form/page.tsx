'use client';
// import { formApprovalService } from '@/apis/services/formApproval';
// import { useFormApproval } from '@/apis/useSwr/formApproval';
import { useFormTypeList } from '@/apis/useSwr/formTypeList';
// import { GenericTable } from '@/components/common/GenericTable';
// import { FormApprovalResponse } from '@/types/response/formRequest';
// import { useRecordFormCols } from '@/utils/constants/cols/formRecordCols';
// import { getInfomation } from '@/utils/functions/getInfomation';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks';
import { DatePicker, Input, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
// import { toast } from 'sonner';
const { RangePicker } = DatePicker;

function Form() {
    const { t, lang } = useTranslationCustom();
    const [selectedFormType, setSelectedFormType] = useState<number>();
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedLocations, setSelectedLocations] = useState<string>('Vietnam');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    // const myInfo = getInfomation();
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

    // const { formApprovals, isLoading: isLoadingFormApproval } = useFormApproval(
    //     {},
    //     myInfo?.card_number ?? '',
    // );

    const [rangeDate, setRangeDate] = useState<{ start_date: Dayjs; end_date: Dayjs }>({
        start_date: dayjs().month(0).date(1),
        end_date: dayjs().month(11).date(31),
    });

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

    // const handleApprove = async (key: string, record: FormApprovalResponse) => {
    //     try {
    //         if (!myInfo) return;
    //         const approvedPayload = {
    //             status: 4,
    //             comment: 'Đồng ý cho nghỉ phép',
    //             approverCardNumber: myInfo?.card_number,
    //         };
    //         const dismissPayload = {
    //             status: 2,
    //             comment: 'Không đồng ý cho nghỉ phép',
    //             approverCardNumber: myInfo?.card_number,
    //         };
    //         switch (key) {
    //             case 'approve': {
    //                 await formApprovalService.approve(record?.id, approvedPayload);
    //                 break;
    //             }
    //             case 'dismiss': {
    //                 await formApprovalService.approve(record?.id, dismissPayload);
    //                 break;
    //             }
    //         }
    //         toast.success(t.common.forms.successed);
    //     } catch (error) {
    //         toast.error(`${error}`);
    //     }
    // };

    // const recordFormCols = useRecordFormCols({ handleApprove });

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
            {/* <GenericTable<FormApprovalResponse>
                columns={recordFormCols}
                dataSource={formApprovals || []}
                rowKey="_id"
                isLoading={isLoadingFormApproval}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: 'default',
                }}
            /> */}
        </div>
    );
}

export default Form;
