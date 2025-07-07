import { useMemo } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { DateLogMap, LogEntry } from '@/types/response/log';

const API_URL = `/${urls.hr}/${urls.log}/${urls.attendance}`;

interface Params {
    date: string | null;
    card_number?: string;
    work_place_id: number | null;
    scope_days: number;
}

export const useLogs = (params?: Params) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';

    // ⬇️ response bây giờ là BaseResponse<DateLogMap>
    const { data, error, mutate } = useSWR<BaseResponse<DateLogMap>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    const logs: LogEntry[] = useMemo(() => {
        if (!data?.data) return [];
        return Object.values(data.data).flat();
    }, [data]);

    return {
        logsByDate: data?.data ?? {},
        logs,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
