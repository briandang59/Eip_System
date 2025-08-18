import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { ShiftDateResponseType } from '@/types/response/shiftType';
import { FactoryInspectionShift } from '@/types/response/factoryInspectionShift';

const API_URL = `/${urls.hr}/${urls.factory_inspection}/${urls.shift}/${urls.list}`;

export const useFactoryInspectionShift = () => {
    const { data, error, mutate } = useSWR<BaseResponse<FactoryInspectionShift[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
        },
    );

    return {
        factoryInspectionShifts: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
