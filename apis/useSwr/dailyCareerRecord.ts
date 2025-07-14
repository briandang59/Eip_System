import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { CareerHistoryResponseType } from '@/types/response/dailyCareerRecord';
import qs from 'qs';

const API_URL = `/${urls.hr}/${urls.daily}/${urls.career}/${urls.records}`;

interface params {
    uuid: string;
}
export const useDailyCareerRecord = (params: params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<CareerHistoryResponseType[]>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        dailyCareerRecord: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
