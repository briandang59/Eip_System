import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { OvertimeResponseType } from '@/types/response/overtime';

const API_URL = `/${urls.hr}/${urls.daily}/${urls.overtime}`;

interface params {
    start_time: string;
    end_time: string;
    place_id?: number;
    unit_id?: number;
    uuid?: string;
}

export const useOvertime = (params: params) => {
    const query = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<OvertimeResponseType[]>>(
        `${API_URL}${query}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        overtimes: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
