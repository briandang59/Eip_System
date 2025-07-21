import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { MeetingRoomResponseType } from '@/types/response/meeting';

const API_URL = `/${urls.meeting_room}`;

export const useMeetingRoom = () => {
    const { data, error, mutate } = useSWR<BaseResponse<MeetingRoomResponseType[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        meetingRooms: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
