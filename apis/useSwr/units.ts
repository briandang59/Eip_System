import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { UnitType } from '@/types/response/unit';

const API_URL = `/${urls.cache}/${urls.dept_unit}`;

interface params {
    id?: number;
    classid?: number;
    place_id?: string;
}

interface filterParams {
    search?: string;
    category_id?: number;
}
export const useUnits = (params?: params, filterParams?: filterParams) => {
    const queryString = params ? `?${qs.stringify(params, { encode: false })}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<UnitType[]>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnMount: true,
            revalidateIfStale: true,
            revalidateOnReconnect: false,
        },
    );
    const filterData = data?.data?.filter((unit) => {
        // Filter by search term
        console.log('filterParams?.search', filterParams?.search);
        if (filterParams?.search) {
            const searchTerm = filterParams.search.toLowerCase();
            const matchesSearch =
                (unit.name_en && unit.name_en.toLowerCase().includes(searchTerm)) ||
                (unit.name_zh && unit.name_zh.toLowerCase().includes(searchTerm)) ||
                (unit.name_vn && unit.name_vn.toLowerCase().includes(searchTerm)) ||
                (unit.code && unit.code.toLowerCase().includes(searchTerm));

            if (!matchesSearch) return false;
        }

        // Filter by category
        if (filterParams?.category_id !== undefined) {
            return unit.category_id === filterParams.category_id;
        }

        return true;
    });
    return {
        units: filterData,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
