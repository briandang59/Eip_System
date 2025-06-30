'use client';

import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { TrackingLogResponse } from '@/types/response/trackingLog';
import { BaseResponse } from '@/types/response/baseResponse';

const API_URL = `/${urls.IT}/${urls.logs}/${urls.user_operation}`;

interface params {
    start_date: string; // 2025-06-01
    end_date: string; // 2025-06-30
}
export const useTrackingLog = (
    params: params,
    page: number = 1,
    pageSize: number = 10,
    method: string = '',
    sort: string = 'asc',
    search: string = '',
) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<TrackingLogResponse[]>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    let filteredData = [...(data?.data || [])];

    if (method) {
        filteredData = filteredData.filter((item) => item.method === method);
    }
    if (search) {
        filteredData = filteredData.filter(
            (item) =>
                item.account === search ||
                item.url === search ||
                item.description === search ||
                item.user.toLowerCase().includes(search.toLowerCase()),
        );
    }
    if (sort) {
        filteredData = filteredData.sort((a, b) =>
            sort === 'asc'
                ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                : new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    }
    const pagination = filteredData.slice((page - 1) * pageSize, page * pageSize);

    return {
        trackingLogs: pagination,
        isLoading: !error && !data,
        isError: error,
        total: filteredData.length,
        mutate,
    };
};
