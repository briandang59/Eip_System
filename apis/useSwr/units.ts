import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { UnitType } from '@/types/response/unit';

const API_URL = `/${urls.cache}/${urls.dept_unit}`;

interface params {
    id?: number;
    classid?: number;
    place_id?: number;
}
export const useUnits = (params?: params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<UnitType[]>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        units: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
