import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { SystemModeResponseType } from '@/types/response/systemMode';

const API_URL = `/${urls.system}/${urls.mode}/${urls.all}`;

export const useSystemMode = () => {
    const { data, error, mutate } = useSWR<BaseResponse<SystemModeResponseType[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
        },
    );

    return {
        systemModes: data?.data || [],
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
