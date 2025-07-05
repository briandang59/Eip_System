import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { AttendanceModifyReasonList } from '@/types/response/attendance';

const API_URL = `/${urls.hr}/${urls.attendance}/${urls.modify}/${urls.reason}/${urls.list}`;

export const useAttendanceModifyReasonList = () => {
    const { data, error, mutate } = useSWR<BaseResponse<AttendanceModifyReasonList[]>>(
        API_URL,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        reasonList: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
