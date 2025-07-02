import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { EthnicResponseType } from '@/types/response/ethnic';

const API_URL = `/${urls.cache}/${urls.ethnic}`;

interface filterParams {
    search?: string;
}
export const useEthnics = (filterParams?: filterParams) => {
    const { data, error, mutate } = useSWR<BaseResponse<EthnicResponseType[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );
    const filterData = data?.data?.filter((unit) => {
        // Filter by search term
        if (filterParams?.search) {
            const searchTerm = filterParams.search.toLowerCase();
            const matchesSearch = unit.name && unit.name.toLowerCase().includes(searchTerm);

            if (!matchesSearch) return false;
        }

        return true;
    });
    return {
        ethnics: filterData,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
