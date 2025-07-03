import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { UnitType } from '@/types/response/unit';

const API_URL = `/${urls.organization}/${urls.unit_type}`;

export const useUnitType = () => {
    const { data, error, mutate } = useSWR<BaseResponse<UnitType[]>>(`${API_URL}`, fetcher, {
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
