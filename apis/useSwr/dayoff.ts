import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import qs from 'qs';
import { DayoffType } from '@/types/response/dayoff';
const API_URL = `/${urls.hr}/${urls.dayoff}/`;

interface params {
    work_place_id: number;
    start: string;
    end: string;
}
export const useDayoff = (params?: params) => {
    const query = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';

    const { data, error, mutate } = useSWR<BaseResponse<DayoffType[]>>(
        `${API_URL}${query}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        dayoff: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
