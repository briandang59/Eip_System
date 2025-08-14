import useSWR from 'swr';
import qs from 'qs';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { TakeLeaveResponseType } from '@/types/response/takeLeave';

const API_URL = `/${urls.hr}/${urls.dayoff}/`;

interface params {
    id?: number;
    work_place_id: number;
    start: string;
    end: string;
    uuid?: string;
    is_pregnant?: string;
    children?: string;
    leave_id?: number;
}

interface filterParams {
    search?: string;
}
export const useTakeLeave = (params?: params, filterParams?: filterParams) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';
    const { data, error, mutate } = useSWR<BaseResponse<TakeLeaveResponseType[]>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
        },
    );
    const filterData = data?.data?.filter((item) => {
        const matchesSearch =
            !filterParams?.search ||
            [item.applicant.fullname, item.applicant.fullname_other, item.applicant.card_number]
                .filter(Boolean)
                .some((field) =>
                    (field ?? '')
                        .trim()
                        .toLowerCase()
                        .includes(filterParams?.search?.toLowerCase() ?? ''),
                );
        return matchesSearch;
    });
    return {
        takeLeaves: filterData,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
