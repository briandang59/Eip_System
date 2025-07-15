import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import qs from 'qs';
import { WardsResponseType } from '@/types/response/wards';
const API_URL = `/${urls.ex_resource}/${urls.vn}/${urls.wards}`;

interface params {
    district?: string;
}
export const useWards = (params?: params) => {
    const query = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';

    const { data, error, mutate } = useSWR<BaseResponse<WardsResponseType[]>>(
        `${API_URL}${query}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        wards: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
