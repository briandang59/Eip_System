import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { ResignTypeResopnseType } from '@/types/response/resignType';

const API_URL = `/${urls.hr}/${urls.daily}/${urls.resign}/${urls.type}`;

export const useResignType = () => {
    const { data, error, mutate } = useSWR<BaseResponse<{ [key: string]: ResignTypeResopnseType }>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    const arrayData: ResignTypeResopnseType[] = data?.data ? Object.values(data.data) : [];

    return {
        resignTypes: arrayData,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
