import useSWR from 'swr';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import qs from 'qs';
import { FormApprovalResponse } from '@/types/response/formRequest';
import { customFetcher } from '@/utils/functions/customFetcher';

interface params {
    pageSize?: number;
    pageNum?: number;
}

export const useFormApproval = (params: params, cardNumber: string) => {
    const API_URL = `/${urls.form_approval}/${urls.pending}/${cardNumber}`;
    const queryString = params ? `?${qs.stringify(params)}` : '';

    const { data, error, mutate } = useSWR<BaseResponse<FormApprovalResponse[]>>(
        `${API_URL}${queryString}`,
        customFetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        formApprovals: data?.data || [],
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
