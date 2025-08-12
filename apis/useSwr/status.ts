import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { StatusResponse } from '@/types/response/status';

const API_URL = `/${urls.form_request_statuses}`;

export const useStatus = () => {
    const { data, error, mutate } = useSWR<BaseResponse<StatusResponse[]>>(`${API_URL}`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
    });

    return {
        statuses: data?.data || [],
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
