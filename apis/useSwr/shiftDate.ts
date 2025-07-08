import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { ShiftDateResponseType } from '@/types/response/shiftType';
import qs from 'qs';

const API_URL = `/${urls.hr}/${urls.daily}/${urls.shift}`;

interface params {
    card_number?: string;
    shift_type?: string;
    unit_id?: number;
    is_pregnant?: boolean;
    range_date_start: string;
    range_date_end: string;
    work_place_id: number;
}
export const useShiftsDate = (params: params) => {
    const query = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';

    const { data, error, mutate } = useSWR<BaseResponse<ShiftDateResponseType[]>>(
        `${API_URL}${query}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        shiftsDate: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
