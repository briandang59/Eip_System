'use client';
import { useMeetingRoom } from '@/apis/useSwr/meetingRoom';
import { useMeetingType } from '@/apis/useSwr/meetingType';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import BookingForm from '@/components/forms/bookingForm';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Calendar, DatePicker, DatePickerProps, Modal, Select } from 'antd';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

function Meeting() {
    const { t } = useTranslationCustom();
    const { workPlaces, isLoading: isLoadingWorkplace } = useWorkPlaces();
    const { meetingRooms } = useMeetingRoom();
    const { meetingTypes } = useMeetingType();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedWorkplace, setSelectedWorkplace] = useState<number | undefined>(undefined);
    useEffect(() => {
        if (workPlaces && workPlaces.length > 0 && selectedWorkplace === undefined) {
            setSelectedWorkplace(workPlaces[0].id);
        }
    }, [workPlaces, selectedWorkplace]);

    const toggleModal = () => {
        setIsOpenModal(!isOpenModal);
    };

    const onSelect = (date: Dayjs) => {
        console.log(date.format('YYYY-MM-DD'));
        toggleModal();
    };
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };
    return (
        <>
            <div className="grid grid-cols-[70%_30%] gap-4">
                <Calendar onSelect={onSelect} />
                <div className="p-2 rounded-[10px] border border-gray-200 flex flex-col gap-4">
                    <h2 className="text-[20px] font-bold">{t.meeting_form.meeting_information}</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <Select
                            options={workPlaces?.map((item) => ({
                                label: item.name_en,
                                value: item.id,
                            }))}
                            loading={isLoadingWorkplace}
                            value={selectedWorkplace}
                            onChange={setSelectedWorkplace}
                            size="large"
                        />
                        <DatePicker onChange={onChange} size="large" allowClear={false} />
                    </div>
                    <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 font-semibold uppercase tracking-wider">
                            <p>{t.meeting_form.meeting_room}</p>
                            <p>{t.meeting_form.time}</p>
                            <p>{t.meeting_form.content}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 p-3 border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors duration-200 bg-[#E6F4EC]">
                            <p className="font-medium text-gray-800">6F(X1)</p>
                            <p>08:00 - 16:00</p>
                            <p>8h kiểm xưởng TNXH KH 342</p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                centered
                title="Meeting Information"
                onCancel={toggleModal}
                open={isOpenModal}
                width={1000}
                footer={null}
            >
                {meetingRooms && meetingTypes && workPlaces && (
                    <BookingForm
                        meetingRooms={meetingRooms}
                        meetingTypes={meetingTypes}
                        workplaces={workPlaces}
                        close={toggleModal}
                    />
                )}
            </Modal>
        </>
    );
}

export default Meeting;
