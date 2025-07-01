'use client';

import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { WorkPlaceResponse } from '@/types/response/workplace';

const API_URL = `/${urls.cache}/${urls.work_place}`;

export const useWorkPlaces = () => {
    const { data, error, mutate } = useSWR<BaseResponse<WorkPlaceResponse[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );
    const filteredWorkPlaces = data?.data?.filter((item) => item.id !== 1 && item.id !== 6);

    return {
        workPlaces: filteredWorkPlaces,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
