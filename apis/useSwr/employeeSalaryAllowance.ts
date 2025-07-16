import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { SalaryAllowance } from '@/types/response/salaryAllowance';

const API_URL = `/${urls.hr}/${urls.salary}/${urls.employee}/${urls.salary_allowance}`;

interface params {
    place_id?: number;
    unit_id?: number;
    uuid?: string;
}

export const useEmployeeSalaryAllowances = (params?: params) => {
    const query = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<SalaryAllowance[]>>(
        `${API_URL}${query}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        employeeSalaryAllowance: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
