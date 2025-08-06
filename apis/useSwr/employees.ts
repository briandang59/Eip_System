import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { EmployeeResponseType } from '@/types/response/employees';

const API_URL = `/${urls.employee}`;

interface params {
    unit_id?: number;
    card_number?: string;
    place_id?: number;
    place_ids?: string;
}
interface filterParams {
    status?: number;
    search?: string;
    state?: number;
}

export const useEmployees = (params?: params, filterParams?: filterParams) => {
    // Chỉ gọi API khi có params hợp lệ
    const shouldFetch = params && Object.keys(params).length > 0;
    const queryString = params ? `?${qs.stringify(params, { encode: false })}` : '';

    const { data, error, mutate } = useSWR<BaseResponse<EmployeeResponseType[]>>(
        shouldFetch ? `${API_URL}${queryString}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
            revalidateIfStale: true,
        },
    );
    const filterData = data?.data?.filter((item) => {
        const matchesSearch =
            !filterParams?.search ||
            [item.fullname, item.fullname_other, item.card_number]
                .filter(Boolean)
                .some((field) =>
                    (field ?? '')
                        .trim()
                        .toLowerCase()
                        .includes(filterParams.search!.trim().toLowerCase()),
                );

        const matchesState = !filterParams?.state || item.employee_state?.id === filterParams.state;

        return matchesSearch && matchesState;
    });

    const activeEmployees = filterData?.filter((item) => item.active);

    return {
        employees: filterData,
        activeEmployees,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
