import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import qs from 'qs';
import {
    RangeDateStatisticalAttendance,
    DailyStatisticalAttendance,
} from '@/types/response/dailyStatisticalAttendance';

const API_URL = `/${urls.statistics}/${urls.hr}/${urls.date_range}/${urls.attendance}`;

interface Params {
    place_id: number;
    start: string;
    end: string;
}

export const useDailyStatisticalAttendanceRangeDate = (params?: Params) => {
    const query = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';

    const { data, error, mutate } = useSWR<BaseResponse<RangeDateStatisticalAttendance[]>>(
        params ? `${API_URL}${query}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    const statisticalRangeDayAttendance: DailyStatisticalAttendance[] = data?.data
        ? data.data.flatMap((item) => Object.values(item.statistic_data))
        : [];

    return {
        statisticalRangeDayAttendance,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
