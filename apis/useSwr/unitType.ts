import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';

const API_URL = `/${urls.organization}/${urls.unit_type}`;

export const useUnitType = () => {
    const { data, error, mutate } = useSWR<BaseResponse<any[]>>(`${API_URL}`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });

    return {
        unitTypes: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
