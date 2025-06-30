'use client';

import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';

const API_URL = `/${urls.user}/${urls.account}/${urls.roles}`;

export const useRoles = (page: number = 1, pageSize: number = 10) => {
    const { data, error, mutate } = useSWR<BaseResponse<any[]>>(`${API_URL}`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });

    let filteredData = [...(data?.data || [])];

    const pagination = filteredData.slice((page - 1) * pageSize, page * pageSize);

    return {
        roles: pagination,
        isLoading: !error && !data,
        isError: error,
        total: filteredData.length,
        mutate,
    };
};
