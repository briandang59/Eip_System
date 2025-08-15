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
    // Chỉ gọi API khi có params hợp lệ
    const shouldFetch = params && params.uuid && params.uuid.trim() !== '';
    const queryString = params ? `?${qs.stringify(params)}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<RemainHoursResponseType>>(
        shouldFetch ? `${API_URL}${queryString}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
        },
    );

    return {
        remainHours: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
