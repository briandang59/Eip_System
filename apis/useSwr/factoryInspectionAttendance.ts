import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { FactoryInspectionAttendance } from '@/types/response/factoryInspectionAttendance';

const API_URL = `/${urls.hr}/${urls.factory_inspection}/${urls.attendance}/${urls.summary_v2}`;

interface params {
    start: string;
    end: string;
    unit_id?: number;
    work_place_id: number;
    card_number?: string;
}
const attendanceFetcher = (url: string, params: params) =>
    fetcher(
        url,
        {
            method: 'POST',
            body: JSON.stringify(params),
        },
        120000,
    );
export const useFactoryInspectionAttendance = (params: params) => {
    const swrKey = [API_URL, params] as const;
    const { data, error, mutate } = useSWR<BaseResponse<FactoryInspectionAttendance[]>>(
        swrKey,
        () => attendanceFetcher(API_URL, params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            dedupingInterval: 10000,
        },
    );

    return {
        factoryInspectionAttendance: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
