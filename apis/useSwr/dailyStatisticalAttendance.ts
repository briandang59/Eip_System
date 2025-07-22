import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';

import qs from 'qs';
import { DailyStatisticalAttendance } from '@/types/response/dailyStatisticalAttendance';
const API_URL = `/${urls.statistics}/${urls.hr}/${urls.daily}/${urls.attendance}`;

interface params {
    place_id: number;
    date: string;
}
export const useDailyStatisticalAttendance = (params: params) => {
    const query = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';

    const { data, error, mutate } = useSWR<
        BaseResponse<Record<string, DailyStatisticalAttendance>>
    >(`${API_URL}${query}`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });
    const statisticalOneDayAttendance = data?.data ? Object.values(data.data) : [];
    return {
        statisticalOneDayAttendance,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
