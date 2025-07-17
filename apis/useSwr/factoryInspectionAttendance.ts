import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { FactoryInspectionAttendance } from '@/types/response/factoryInspectionAttendance';

const API_URL = `/${urls.hr}/${urls.factory_inspection}/${urls.attendance}/${urls.summary_v2}`;

interface params {
    start?: string;
    end?: string;
    unit_id?: number;
    work_place_id?: number;
    card_number?: string;
}

export const useFactoryInspectionAttendance = (params?: params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<FactoryInspectionAttendance[]>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        factoryInspectionAttendance: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
