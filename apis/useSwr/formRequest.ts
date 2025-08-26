import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import qs from 'qs';
import { FormRequestResponseType } from '@/types/response/formRequest';
const API_URL = `/${urls.from_request}`;

interface params {
    pageSize: number;
    pageNum: number;
    form_type_id?: number;
}

export const useFormRequest = (params: params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';

    const { data, error, mutate } = useSWR<BaseResponse<FormRequestResponseType[]>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        formRequests: data?.data || [],
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
