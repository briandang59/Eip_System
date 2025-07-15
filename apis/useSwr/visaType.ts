import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { VisaTypeResponseType } from '@/types/response/visaType';

const API_URL = `/${urls.cache}/${urls.visa_type}`;

export const useVisaType = () => {
    const { data, error, mutate } = useSWR<BaseResponse<VisaTypeResponseType[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        visaTypes: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
