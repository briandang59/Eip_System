import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { IsoForm } from '@/types/response/isoForm';

const API_URL = `/${urls.form}/${urls.type}/${urls.list}`;

interface filterParams {
    locations?: string;
    search?: string;
}

export const useFormTypeList = (filterParams?: filterParams) => {
    const { data, error, mutate } = useSWR<BaseResponse<IsoForm[]>>(API_URL, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });

    const filterData = data?.data.filter((item) => {
        const matchLocation = filterParams?.locations
            ? item.location.toLowerCase() === filterParams.locations.toLowerCase()
            : true;

        const searchText = filterParams?.search?.toLowerCase() || '';
        const matchSearch =
            item.name_en.toLowerCase().includes(searchText) ||
            item.name_zh.toLowerCase().includes(searchText) ||
            item.name_vn.toLowerCase().includes(searchText);

        return matchLocation && matchSearch;
    });

    return {
        fromTypeList: filterData || [],
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
