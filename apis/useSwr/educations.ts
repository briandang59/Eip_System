import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { EducationResponseType } from '@/types/response/education';

const API_URL = `/${urls.cache}/${urls.education}`;

interface filterParams {
    search?: string;
}
export const useEducations = (filterParams?: filterParams) => {
    const { data, error, mutate } = useSWR<BaseResponse<EducationResponseType[]>>(
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
        educations: filterData,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
