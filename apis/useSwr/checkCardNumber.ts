import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import qs from 'qs';
const API_URL = `/${urls.cache}/${urls.check_card_number}`;

interface params {
    card: string;
}
export const useCheckCardNumber = (params: params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';

    const { data, error, mutate } = useSWR<BaseResponse<any>>(`${API_URL}${queryString}`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });

    return {
        checkCardNumber: data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
