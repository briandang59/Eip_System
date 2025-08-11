'use client';

import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { WorkPlaceResponse } from '@/types/response/workplace';
import { deriveAllowedWorkplaceIds } from '@/utils/functions/allowedWorkplaces';
import { useRolesFromLocalStorage } from '@/utils/hooks/useRolesFromLocalStorage';

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
    const { roles } = useRolesFromLocalStorage('roles');

    const allowedIds = deriveAllowedWorkplaceIds(roles, 'union');

    const workPlaces = (data?.data ?? []).filter((workplace) => {
        const isAllowed = allowedIds.includes(workplace.id);
        return isAllowed;
    });

    const uniqueWorkPlaces = workPlaces.filter(
        (workplace, index, self) => index === self.findIndex((w) => w.id === workplace.id),
    );

    return {
        workPlaces: data?.data || [],
        filterWorkPlaces: uniqueWorkPlaces,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
