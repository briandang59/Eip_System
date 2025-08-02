import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import qs from 'qs';
import { DayoffType } from '@/types/response/dayoff';
const API_URL = `/${urls.hr}/${urls.dayoff}/`;

interface params {
    work_place_id: number;
    start: string;
    end: string;
    uuid?: string;
}
export const useDayoff = (params?: params) => {
    console.log('useDayoff - params:', params);

    // Chỉ gọi API khi có params hợp lệ
    const shouldFetch =
        params && params.uuid && params.uuid.trim() !== '' && params.work_place_id > 0;

    console.log('useDayoff - shouldFetch:', shouldFetch);
    console.log('useDayoff - params.uuid:', params?.uuid);
    console.log('useDayoff - params.work_place_id:', params?.work_place_id);

    const query = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';
    const url = shouldFetch ? `${API_URL}${query}` : null;

    console.log('useDayoff - url:', url);

    const { data, error, mutate } = useSWR<BaseResponse<DayoffType[]>>(url, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });

    return {
        dayoff: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
