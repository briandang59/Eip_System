import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import {
    MeetingBookingDetailResponseType,
    MeetingRoomResponseType,
} from '@/types/response/meeting';
import dayjs, { Dayjs } from 'dayjs';

const API_URL = `/${urls.meeting}/${urls.detail}`;

interface params {
    factory_id?: number;
    date?: Dayjs;
    meetingRooms?: MeetingRoomResponseType[];
}

export const useBookings = ({ factory_id, date, meetingRooms }: params) => {
    const { data, error, mutate } = useSWR<BaseResponse<MeetingBookingDetailResponseType[]>>(
        API_URL,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    const filterData = data?.data.filter((item) => {
        const isSameDate = date
            ? dayjs(item.date_book).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
            : true;

        const hasMatchingFactory =
            factory_id && meetingRooms
                ? item.book_meeting?.some((booking) =>
                      booking.book_meeting_room?.some((roomBooking) =>
                          meetingRooms.some(
                              (room) =>
                                  room.work_place_id === factory_id &&
                                  room.id === roomBooking.meeting_room_id,
                          ),
                      ),
                  )
                : true;

        return isSameDate && hasMatchingFactory;
    });

    return {
        bookings: filterData,
        originData: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
