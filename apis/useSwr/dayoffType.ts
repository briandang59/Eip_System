import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { DayOffResponseType } from '@/types/response/dayOffType';

interface params {
    nation?: string;
}
export const useDayOffType = (params: params) => {
    const API_URL1 = `/${urls.hr}/${urls.dayoff}/${urls.vn}/${urls.type}/${urls.list}`;
    const API_URL2 = `/${urls.hr}/${urls.dayoff}/${urls.tw}/${urls.type}/${urls.list}`;

    const URL = `${params?.nation === 'Vietnam' || params?.nation === undefined ? API_URL1 : API_URL2}`;
    const { data, error, mutate } = useSWR<BaseResponse<DayOffResponseType[]>>(URL, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });

    return {
        dayoffTypes: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
