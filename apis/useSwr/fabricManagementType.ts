import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { FabricManagementTypeResponseType } from '@/types/response/fabricManagementType';

const API_URL = `/${urls.fabric_management}/${urls.types}`;

export const useFabricManagementTypes = () => {
    const { data, error, mutate } = useSWR<BaseResponse<FabricManagementTypeResponseType[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        fabricManagemnentTypes: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
