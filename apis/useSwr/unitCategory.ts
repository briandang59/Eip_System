import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { CategoryResponseType } from '@/types/response/category';

const API_URL = `/${urls.organization}/${urls.unit_category}`;

export const useCategory = () => {
    const { data, error, mutate } = useSWR<BaseResponse<CategoryResponseType[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        categories: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
