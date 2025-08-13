import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import qs from 'qs';
import { BulletinsResponseType } from '@/types/response/bulletins';

interface Params {
    pageNum?: number;
    pageSize?: number;
    work_places?: string;
    card_number?: string;
}

export const useManageBulletins = (params?: Params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';

    const customFetcher = (url: string) =>
        fetcher(url, {
            baseURL: process.env.NEXT_PUBLIC_API_URL_2 || 'http://10.2.1.159:4499/api',
        });
    const API_URL = `/${urls.manage}/${urls.bulletins}`;

    const { data, error, mutate } = useSWR<BaseResponse<BulletinsResponseType[]>>(
        `${API_URL}${queryString}`,
        customFetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
        },
    );
    const filterData = data?.data?.filter((item) => item.active);
    return {
        bulletins: filterData?.sort((a, b) =>
            a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1,
        ),
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};

export const useManageBulletinsDetails = (id: string) => {
    const customFetcher = (url: string) =>
        fetcher(url, {
            baseURL: process.env.NEXT_PUBLIC_API_URL_2 || 'http://10.2.1.159:4499/api',
        });
    const API_URL = `/${urls.bulletin}/${id}`;

    const { data, error, mutate } = useSWR<BaseResponse<BulletinsResponseType>>(
        `${API_URL}`,
        customFetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
        },
    );
    return {
        bulletinsDetail: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};

export const useManageBulletinsPublic = () => {
    const customFetcher = (url: string) =>
        fetcher(url, {
            baseURL: process.env.NEXT_PUBLIC_API_URL_2 || 'http://10.2.1.159:4499/api',
        });
    const API_URL = `/${urls.bulletins}`;

    const { data, error, mutate } = useSWR<BaseResponse<BulletinsResponseType[]>>(
        `${API_URL}`,
        customFetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
        },
    );
    return {
        bulletinsPublic: data?.data?.sort((a, b) =>
            a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1,
        ),
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};

export const useManageBulletinsSelf = (card_number: string) => {
    const customFetcher = (url: string) =>
        fetcher(url, {
            baseURL: process.env.NEXT_PUBLIC_API_URL_2 || 'http://10.2.1.159:4499/api',
        });
    const API_URL = `/${urls.bulletin}/${urls.employee}/${card_number}`;

    const { data, error, mutate } = useSWR<BaseResponse<BulletinsResponseType[]>>(
        `${API_URL}`,
        customFetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
        },
    );
    return {
        bulletinsSelf: data?.data?.sort((a, b) =>
            a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1,
        ),
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
