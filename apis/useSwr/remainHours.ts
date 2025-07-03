import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { RemainHoursResponseType } from '@/types/response/remainHours';

const API_URL = `/${urls.hr}/${urls.dayoff}/${urls.remain_hours}`;

interface params {
    uuid?: string;
}

export const useRemainHours = (params?: params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<RemainHoursResponseType>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        remainHours: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
