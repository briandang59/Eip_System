import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { TransferEmployeesResponseType } from '@/types/response/transferEmployees';

const API_URL = `/${urls.employee}/${urls.transfer_list}`;

interface params {
    place_id: number;
    unit_id?: number;
}
export const useTransferEmployee = (params: params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<TransferEmployeesResponseType[]>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        transferEmployee: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
