import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { FabricTypeTestResponseType } from '@/types/response/fabricTest';

interface Params {
    code?: string;
}

export const useFabricManagementTypesTests = ({ code }: Params) => {
    const shouldFetch = Boolean(code);

    const API_URL = `/${urls.fabric_management}/${urls.types}/${code}/${urls.tests}`;

    const { data, error, mutate } = useSWR<BaseResponse<FabricTypeTestResponseType[]>>(
        shouldFetch ? API_URL : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            dedupingInterval: 0, // Disable deduping to ensure fresh data
        },
    );

    return {
        fabricManagemnentTypesTests: data?.data,
        isLoading: shouldFetch && !error && !data,
        isError: error,
        mutate,
    };
};
