import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { AnalysisDataFabricTestResponseType } from '@/types/response/analysisDataFabricTest';

interface params {
    code?: string;
}
export const useAnalysisDataFabricTest = ({ code }: params) => {
    const shouldFetch = Boolean(code);

    const API_URL = `/${urls.fabric_management}/${urls.analysis}/${code}`;

    const { data, error, mutate } = useSWR<BaseResponse<AnalysisDataFabricTestResponseType>>(
        shouldFetch ? API_URL : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        analysisDataFabricTest: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
