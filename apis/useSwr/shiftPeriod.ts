import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { ShiftPeriodResponseType } from '@/types/response/shiftPeriod';

const API_URL = `/${urls.hr}/${urls.daily}/${urls.shift}/${urls.list}/${urls.period}`;

export const useShiftPeriod = () => {
    const { data, error, mutate } = useSWR<BaseResponse<ShiftPeriodResponseType[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        shiftPeriod: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
