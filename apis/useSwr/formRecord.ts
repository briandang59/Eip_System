import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import qs from 'qs';
import { RecordFormResponse } from '@/types/response/recordForm';
const API_URL = `/${urls.form}/${urls.record}`;

interface filterParams {
    locations?: string;
    search?: string;
    type?: number;
    status?: string;
}

interface params {
    start_date: string;
    end_date: string;
}

export const useFromRecord = (params: params, filterParams?: filterParams) => {
    const queryString = params ? `?${qs.stringify(params)}` : '';

    const { data, error, mutate } = useSWR<BaseResponse<RecordFormResponse[]>>(
        `${API_URL}${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    const filteredData = data?.data.filter((item) => {
        const matchType = filterParams?.type === undefined || item.type_id === filterParams.type;
        const matchSearch =
            !filterParams?.search ||
            item.applicant.fullname.toLowerCase().includes(filterParams.search.toLowerCase());
        const matchStatus =
            !filterParams?.status ||
            item.status.name.toLowerCase() === filterParams.status.toLowerCase();
        const matchLocation =
            !filterParams?.locations ||
            item.location.toLowerCase() === filterParams.locations.toLowerCase();

        return matchType && matchSearch && matchStatus && matchLocation;
    });

    return {
        formRecords: filteredData || [],
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
