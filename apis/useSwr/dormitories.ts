import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { DormitoriesResponseType } from '@/types/response/dormitories';

const API_URL = `/${urls.basic_data}/${urls.dormitory}`;

interface filterParams {
    search?: string;
}
export const useDormitories = (filterParams?: filterParams) => {
    const { data, error, mutate } = useSWR<BaseResponse<DormitoriesResponseType[]>>(
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
            const matchesSearch =
                (unit.name_en && unit.name_en.toLowerCase().includes(searchTerm)) ||
                (unit.name_zh && unit.name_zh.toLowerCase().includes(searchTerm)) ||
                (unit.name_vn && unit.name_vn.toLowerCase().includes(searchTerm));

            if (!matchesSearch) return false;
        }

        return true;
    });
    return {
        dormitories: filterData,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
