import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { MeetingTypeResponseType } from '@/types/response/meeting';

const API_URL = `/${urls.meeting_type}`;

export const useMeetingType = () => {
    const { data, error, mutate } = useSWR<BaseResponse<MeetingTypeResponseType[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        meetingTypes: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
