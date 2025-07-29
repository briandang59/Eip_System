import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import qs from 'qs';

const API_URL = `/${urls.manage}/${urls.bulletins}`;

interface Params {
    card: string;
}

export const useManageBulletins = (params: Params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';

    const customFetcher = (url: string) =>
        fetcher(url, {
            baseURL: process.env.NEXT_PUBLIC_API_URL_2 || 'http://10.2.1.159:4499',
        });

    const { data, error, mutate } = useSWR<BaseResponse<any>>(
        `${API_URL}${queryString}`,
        customFetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        checkCardNumber: data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
