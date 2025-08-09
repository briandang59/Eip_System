import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { TakeLeaveResponseType } from '@/types/response/takeLeave';

const API_URL = `/${urls.hr}/${urls.dayoff}/`;

interface params {
    id?: number;
    work_place_id: number;
    start: string;
    end: string;
    uuid?: string;
    is_pregnant?: string;
    children?: string;
    leave_id?: number;
}

export const useTakeLeave = (params?: params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<TakeLeaveResponseType[]>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
        },
    );

    return {
        takeLeaves: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
