'use client';
import { bookingService } from '@/apis/services/booking';
import { useBookings } from '@/apis/useSwr/booking';
import { useMeetingRoom } from '@/apis/useSwr/meetingRoom';
import { useMeetingType } from '@/apis/useSwr/meetingType';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import ModalConfirm from '@/components/common/ModalConfirm';
import BookingForm from '@/components/forms/bookingForm';
import { MeetingBookingDetailResponseType } from '@/types/response/meeting';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Calendar, DatePicker, DatePickerProps, Modal, Select, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function Meeting() {
    const { t } = useTranslationCustom();
    const { workPlaces, isLoading: isLoadingWorkplace } = useWorkPlaces();
    const { meetingRooms } = useMeetingRoom();
    const { meetingTypes } = useMeetingType();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedWorkplace, setSelectedWorkplace] = useState<number | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number>();
    const [selectedRecord, setSelectedRecord] = useState<MeetingBookingDetailResponseType>();

    const {
        bookings,
        originData,
        isLoading: isLoadingBooking,
        mutate: bookingMutate,
    } = useBookings({
        date: selectedDate,
        meetingRooms: meetingRooms,
        factory_id: selectedWorkplace,
    });

    useEffect(() => {
        if (workPlaces && workPlaces.length > 0 && selectedWorkplace === undefined) {
            setSelectedWorkplace(workPlaces[0].id);
        }
    }, [workPlaces, selectedWorkplace]);

    // Thay thế toggleModal và handleSelectedRecord bằng openModal/closeModal
    const openModal = (record?: MeetingBookingDetailResponseType) => {
        setSelectedRecord(record);
        setIsOpenModal(true);
    };
    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedRecord(undefined);
    };

    const handleSelectedRecord = (record: MeetingBookingDetailResponseType) => {
        openModal(record);
    };
    const onSelect = (date: Dayjs) => {
        setSelectedDate(date);
        openModal(undefined);
    };

    const onChange: DatePickerProps['onChange'] = (date) => {
        setSelectedDate(date);
    };

    const handleFindMeetingByID = (id: number) => {
        const exist = meetingRooms?.find((item) => item.id === id);
        if (exist) {
            return exist.name_en;
        }

        return null;
    };
    const handleRemoveBooking = async (id: number) => {
        try {
            await bookingService.remove({ active: false, id });
            toast.success('successed');
            bookingMutate();
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    const toggleModalConfirm = (id?: number) => {
        setIsOpenModalConfirm(!isOpenModalConfirm);
        if (id) {
            setSelectedBookingId(id);
        }
    };

    const handleConfirmed = () => {
        if (selectedBookingId) {
            handleRemoveBooking(selectedBookingId);
            setSelectedBookingId(undefined);
            toggleModalConfirm();
        }
    };

    const dateCellRender = (current: Dayjs) => {
        const meetingsForDate = originData?.filter((item) => {
            const isSameDate =
                dayjs(item.date_book).format('YYYY-MM-DD') === current.format('YYYY-MM-DD');
            const hasMatchingFactory =
                selectedWorkplace && meetingRooms
                    ? item.book_meeting?.some((booking) =>
                          booking.book_meeting_room?.some((roomBooking) =>
                              meetingRooms.some(
                                  (room) =>
                                      room.work_place_id === selectedWorkplace &&
                                      room.id === roomBooking.meeting_room_id,
                              ),
                          ),
                      )
                    : false;
            return isSameDate && hasMatchingFactory;
        });

        if (!meetingsForDate || meetingsForDate.length === 0) {
            return null;
        }

        return (
            <ul className="events">
                {meetingsForDate.map((item) => (
                    <li
                        key={item.id}
                        className="text-[12px] overflow-hidden whitespace-nowrap text-ellipsis"
                    >
                        <span className="font-semibold">{item.topic}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <div className="grid grid-cols-[70%_30%] gap-4">
                <Calendar
                    onSelect={onSelect}
                    cellRender={(current, info) => {
                        if (info.type === 'date') {
                            return dateCellRender(current);
                        }
                        return info.originNode;
                    }}
                />
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
                        <DatePicker
                            onChange={onChange}
                            size="large"
                            allowClear={false}
                            value={selectedDate}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 font-semibold uppercase tracking-wider">
                            <p>{t.meeting_form.meeting_room}</p>
                            <p>{t.meeting_form.time}</p>
                            <p>{t.meeting_form.content}</p>
                        </div>
                        {!isLoadingBooking ? (
                            bookings?.map((item) => (
                                <div
                                    className="cursor-pointer grid grid-cols-4 gap-2 p-3 border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors duration-200 bg-[#E6F4EC]"
                                    key={item.id}
                                    onClick={() => handleSelectedRecord(item)}
                                >
                                    <p className="font-medium text-gray-800">
                                        {handleFindMeetingByID(
                                            item?.book_meeting[0]?.book_meeting_room[0]
                                                ?.meeting_room_id,
                                        )}
                                    </p>
                                    <p>
                                        {dayjs(item?.book_meeting[0]?.start).format('HH:mm')} -{' '}
                                        {dayjs(item?.book_meeting[0]?.end).format('HH:mm')}
                                    </p>
                                    <div className="col-span-2 flex items-center gap-2 justify-between">
                                        <p>{item?.topic}</p>
                                        <div className="flex items-center justify-end">
                                            <Button
                                                icon={
                                                    <Trash
                                                        strokeWidth={1.5}
                                                        className="size-[16px] !text-red-600"
                                                    />
                                                }
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleModalConfirm(item.id);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="min-h-[100px] flex items-center justify-center">
                                <Spin />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                centered
                title="Meeting Information"
                onCancel={closeModal}
                open={isOpenModal}
                width={1000}
                footer={null}
                destroyOnClose
            >
                {meetingRooms && meetingTypes && workPlaces && (
                    <BookingForm
                        meetingRooms={meetingRooms}
                        meetingTypes={meetingTypes}
                        workplaces={workPlaces}
                        close={closeModal}
                        date={selectedDate}
                        record={selectedRecord}
                        mutate={bookingMutate}
                    />
                )}
            </Modal>
            <ModalConfirm
                isOpen={isOpenModalConfirm}
                toggleModal={toggleModalConfirm}
                confirmAndClose={handleConfirmed}
            />
        </>
    );
}

export default Meeting;
