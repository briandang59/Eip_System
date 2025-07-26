import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import qs from 'qs';
import { BasicEmployee } from '@/types/printing/baseEmployee';
const API_URL = `/${urls.hr}/${urls.doc}/${urls.employee}/${urls.basic_info}`;

interface params {
    place_id: number;
    card_number_list: string[];
    unit_id?: number;
}

const basicInforEmployeeFetcher = (url: string, params: params) =>
    fetcher(
        url,
        {
            method: 'POST',
            body: JSON.stringify(params),
        },
        120000,
    );
export const useBasicInforEmployee = (params: params) => {
    const query = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';

    const { data, error, mutate } = useSWR<BaseResponse<BasicEmployee[]>>(
        `${API_URL}${query}`,
        () => basicInforEmployeeFetcher(API_URL, params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        basicInforEmployee: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
