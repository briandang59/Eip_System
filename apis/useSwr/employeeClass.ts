import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { EmployeeClassResponseType } from '@/types/response/employeeClass';
import qs from 'qs';
const API_URL = `/${urls.cache}/${urls.employee_class}`;

interface params {
    id: number;
}
export const useEmployeeClass = (params?: params) => {
    const query = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<EmployeeClassResponseType[]>>(
        `${API_URL}${query}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        employeeClasses: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
