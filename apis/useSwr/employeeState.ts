import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { EmployeeStateResponseType } from '@/types/response/employeeState';

const API_URL = `/${urls.cache}/${urls.employee_state}`;

interface params {
    id?: number;
}

export const useEmployeeState = (params?: params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<EmployeeStateResponseType[]>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    const newData = data?.data
        ? [
              ...data.data,
              {
                  id: 7,
                  name_en: 'Transfer',
                  name_zh: '轉移',
                  name_vn: 'Chuyển công tác',
              },
          ]
        : [];

    return {
        employeeState: newData,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
