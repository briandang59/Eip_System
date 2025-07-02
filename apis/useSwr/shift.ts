import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { ShiftType } from '@/types/response/shiftType';

const API_URL = `/${urls.hr}/${urls.daily}/${urls.shift}/${urls.list}`;

interface filterParams {
    search?: string;
}
export const useShifts = (filterParams?: filterParams) => {
    const { data, error, mutate } = useSWR<BaseResponse<ShiftType[]>>(`${API_URL}`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });
    const shiftsArray = data?.data ? Object.values(data.data) : [];

    const filterShifts = shiftsArray.filter((shift) => {
        if (filterParams?.search) {
            return shift.tag.toLowerCase().includes(filterParams.search.toLowerCase());
        }
        return true;
    });
    return {
        shifts: filterShifts,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
