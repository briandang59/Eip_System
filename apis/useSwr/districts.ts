import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { ProvincesResponseType } from '@/types/response/provinces';
import qs from 'qs';
const API_URL = `/${urls.ex_resource}/${urls.vn}/${urls.districts}`;

interface params {
    province?: string;
}
export const useDistricts = (params?: params) => {
    const query = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';

    const { data, error, mutate } = useSWR<BaseResponse<ProvincesResponseType[]>>(
        `${API_URL}${query}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        districts: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
