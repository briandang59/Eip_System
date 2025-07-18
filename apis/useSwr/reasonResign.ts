import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { ReasonResignResponseType } from '@/types/response/reasonResign';

const API_URL = `/${urls.hr}/${urls.daily}/${urls.resign}/${urls.reason}`;

export const useReasonResign = () => {
    const { data, error, mutate } = useSWR<BaseResponse<ReasonResignResponseType[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        reasonResigns: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
