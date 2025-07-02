import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { NationResponseType } from '@/types/response/nation';

const API_URL = `/${urls.cache}/${urls.nation}`;

interface params {
    id?: number;
}

interface filterParams {
    search?: string;
}
export const useNations = (params?: params, filterParams?: filterParams) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<NationResponseType[]>>(
        `${API_URL}${queryString}`,
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
            const matchesSearch =
                (unit.name_en && unit.name_en.toLowerCase().includes(searchTerm)) ||
                (unit.name_zh && unit.name_zh.toLowerCase().includes(searchTerm)) ||
                (unit.name_vn && unit.name_vn.toLowerCase().includes(searchTerm));

            if (!matchesSearch) return false;
        }

        return true;
    });
    return {
        nations: filterData,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
